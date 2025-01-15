import {SyntaxNode, TreeCursor} from "@lezer/common";
import {parser, rendProp, unitProp} from "@leiden-plus/parser-leiden-plus";

function text(input: string, node: TreeCursor) {
    return input.substring(node.from, node.to);
}

function diacriticValue(input: string) {
    switch (input) {
        case ' ῾':
            return 'asper';
        case '´':
            return 'acute';
        case '¨':
            return 'diaeresis';
        case '`':
            return 'grave';
        case '^':
            return 'circumflex';
        case ' ᾿':
            return 'lenis';
        default:
            return '';
    }
}

function stripCodepoints(input: string, ...codepoints: number[]) {
    let stripped = '';
    for (let i = 0; i < input.length;) {
        const current = input.codePointAt(i);
        if (current && !codepoints.includes(current)) {
            stripped += String.fromCodePoint(current);
        }
        i += current && current > 0xFFFF ? 2 : 1;
    }
    return stripped;
}

/**
 * Find a first-child Number leaf
 */
function findNumber(input: string, node: TreeCursor) {
    if (node.name === "Number") {
        return text(input, node);
    }

    let depth = 0;
    let value;
    while (node.firstChild()) {
        depth++;
        if (node.name === "Number") {
            value = text(input, node);
        }
    }
    for (let i = 0; i < depth; i++) node.parent();
    return value;
}

export function toXml(input: string, root = parser.parse(input)) {

    const xml: string[] = [];
    let needsCloseEdition = false;
    let value;
    const selfClosingNodeSet = new WeakSet<SyntaxNode>() // TODO: use lezer NodeWeakMap?
    root.iterate({
        enter: (node: TreeCursor) => {
            if (node.type.isError || node.type.is("Error")) {
                xml.push(`<!-- Error:${text(input, node)} -->`);
                return false;
            }

            const name = node.name;

            // re-create weird XSugar behaviour
            // these rules are printed as text on one-line editorial notes, but are
            // expanded in multi-line editorial notes
            if ([
                "Vacat", "LineBreak", "LostLines", "LineBreakWrapped",
                "Vestige", "Illegible", "Gap"
            ].includes(name)) {
                if (node.matchContext(['EditorialNote'])) {
                    let currentNode = node.node
                    while (currentNode.parent && currentNode.name !== "EditorialNote") {
                        currentNode = currentNode.parent
                    }
                    const noteContent = text(input, currentNode.cursor());
                    if (!noteContent.includes("\n")) {
                        xml.push(text(input, node));
                        return false;
                    }
                }
            }

            switch (name) {
                case 'Document':
                    break;

                case 'Text':
                case 'Number':
                    xml.push(text(input, node));
                    break;

                case 'IncompletePattern':
                    const nodeStart = node.from;
                    if (node.firstChild()) {
                        const firstChildStart = node.from;
                        xml.push(input.substring(nodeStart, firstChildStart));
                        node.parent();
                    } else {
                        xml.push(text(input, node));
                    }
                    break;

                case 'LineBreak':
                case 'LineBreakWrapped':
                case 'LineBreakSpecial':
                case 'LineBreakSpecialWrapped': {
                    node.firstChild() // Opening delim "("
                    node.nextSibling(); // Line number node (num)
                    value = text(input, node);
                    xml.push(`<lb n="${value}"`);

                    if (name === "LineBreakSpecial" || name === "LineBreakSpecialWrapped") {
                        node.nextSibling();
                        xml.push(` rend="${text(input, node)}"`);
                    }

                    if (name === "LineBreakWrapped" || name === "LineBreakSpecialWrapped") {
                        xml.push(` break="no"`);
                    }

                    xml.push('/>')
                    return false;
                }

                case 'EditionStart':
                    xml.push(`<div`);
                    node.firstChild();
                    if (node.name === "LanguageId") {
                        xml.push(` xml:lang="${text(input, node)}"`);
                    }

                    xml.push(' type="edition" xml:space="preserve">');

                    needsCloseEdition = true;
                    break;

                case 'Div':
                    xml.push(`<div`);
                    node.firstChild(); // Opening delim <D=
                    node.nextSibling();
                    if (node.name === "Num") {
                        xml.push(` n="${text(input, node)}"`);
                    }
                    node.nextSibling();
                    if (node.name === "Subtype") {
                        xml.push(` subtype="${text(input, node)}"`);
                    } else {
                        node.prevSibling();
                    }

                    xml.push(' type="textpart"');

                    node.nextSibling();
                    if (node.name === "Ref") {
                        xml.push(` corresp="${text(input, node)}"`);
                    } else {
                        node.prevSibling();
                    }

                    xml.push(`>`);
                    break;

                case 'Ab':
                    node.firstChild() // <= (opening delim)
                    node.nextSibling() // content or => (closing delim)
                    if (node.type.is("Delims")) {
                        xml.push("<ab/>")
                        node.parent();
                        return false;
                    }
                    node.prevSibling();

                    xml.push("<ab>")
                    break;

                case 'Foreign':
                    node.lastChild();
                    const foreignLangId = text(input, node).substring(2);
                    xml.push(`<foreign xml:lang="${foreignLangId}">`);
                    node.parent();
                    break;

                case 'Unclear':
                    xml.push(`<unclear>${stripCodepoints(text(input, node), 0x304, 0x323)}</unclear>`);
                    return false;

                case 'Illegible':
                case 'Vestige':
                case 'LostLines':
                case 'Vacat':
                case 'Gap':
                case 'GapOmitted': {
                    node.firstChild(); // GapNumberX or opening delimiter
                    if (node.type.is("Delims")) {
                        // Skip delimiter if necessary
                        node.nextSibling()
                    }

                    let quantityAttrs;
                    let precAttr = '';
                    let incompleteRange = false;

                    // XSugar output: no <desc>Vestiges</desc> for vestig.?lin
                    let isVestiges = name === 'Vestige' && node.name !== 'GapNumberUnknownLines';

                    switch (node.name) {
                        case 'GapNumber':
                        case 'GapNumberChars':
                        case 'GapNumberLines':
                            quantityAttrs = ` quantity="${findNumber(input, node)}"`;
                            break;

                        case 'GapNumberCirca':
                        case 'GapNumberCircaChars':
                        case 'GapNumberCircaLines':
                            const quantity = findNumber(input, node);
                            if (!quantity) {
                                node.parent();
                                xml.push(text(input, node));
                                return false;
                            }
                            quantityAttrs = ` quantity="${findNumber(input, node)}"`;
                            precAttr = ` precision="low"`;
                            break;

                        case 'GapNumberRange':
                        case 'GapNumberRangeLines':
                        case 'GapNumberRangeChars':
                            const gapRangeValue = text(input, node);
                            const range = /(\d+)-(\d+)?/.exec(gapRangeValue);
                            // XSugar workaround
                            if (!range![2]) {
                                quantityAttrs = ` quantity="${range![1]}"`;
                                incompleteRange = true;
                                break;
                            }
                            quantityAttrs = ` atLeast="${range![1]}" atMost="${range![2]}"`;
                            break;

                        case 'GapNumberUnknown':
                        case 'GapNumberUnknownLines':
                        case "VestigStandalone":
                            quantityAttrs = ` extent="unknown"`;
                            break;

                        default:
                            node.parent();
                            xml.push(text(input, node));
                            return false;
                    }

                    let reason: string;
                    switch (name) {
                        case "LostLines":
                        case "Gap":
                            reason = "lost";
                            break;
                        case "GapOmitted":
                            reason = "omitted";
                            break;
                        default:
                            reason = "illegible";
                    }

                    // Generate output element
                    if (name === "Vacat") {
                        xml.push(`<space${quantityAttrs} unit="${node.type.prop(unitProp)}"${precAttr}`);
                    } else {
                        xml.push(`<gap reason="${reason}"${quantityAttrs} unit="${node.type.prop(unitProp)}"${precAttr}`);

                    }

                    // Leave the element open for vestiges or if it contains CertLow
                    // CertLow output is handled by the 'CertLow' switch case
                    if (isVestiges) {
                        xml.push('><desc>vestiges</desc>');
                    } else {
                        node.nextSibling();
                        if ((node.name as string) === 'CertLow') {
                            xml.push('>');
                            node.parent();
                        } else {
                            xml.push('/>');

                            // XSugar workaround
                            if (incompleteRange) {
                                xml.push('-');
                            }

                            node.parent();
                            return false;
                        }
                    }
                }
                    break;

                case 'Deletion':
                    const rend = node.type.prop(rendProp);
                    xml.push(`<del rend="${rend}">`);
                    node.firstChild(); // Opening Delimiter
                    node.nextSibling() // Content
                    break;

                case 'InsertionAbove':
                    xml.push('<add place="above">');
                    break;
                case 'InsertionBelow':
                    xml.push('<add place="below">');
                    break;
                case 'InsertionMargin':
                    node.firstChild() // AddPlace
                    value = text(input, node);
                    value = value.substring(2, value.indexOf(":"));
                    if (value) {
                        const place = value === "interlin" ? "interlinear" : value;
                        xml.push(`<add place="${place}">`);
                    }
                    break;
                case 'InsertionMarginSling':
                    xml.push('<add rend="sling" place="margin">');
                    break;
                case 'InsertionMarginUnderline':
                    xml.push('<add rend="underline" place="margin">');
                    break;

                case 'AbbrevUnresolved':
                    xml.push('<abbr>');
                    break;

                case 'Abbrev':
                    xml.push(`<expan>`);
                    break;

                case 'AbbrevInnerEx':
                    node.firstChild(); // opening delim "("
                    node.nextSibling() // AbbrevInnerExContent
                    node.firstChild(); // Expansion
                    value = text(input, node);
                    node.nextSibling();
                    if (node.name === 'QuestionMark') {
                        xml.push(`<ex cert="low">`);
                    } else {
                        xml.push(`<ex>`);
                    }
                    xml.push(value, `</ex>`);
                    return false;

                case 'NumberSpecial':
                case 'NumberSpecialTick':
                    // In NumberSpecial lezer sometimes inserts anonymous nodes (probably due to the template pattern
                    // in ghe grammar).
                    // This gets a tree cursor that does not include anonymous nodes
                    let cursor = node.node.cursor();

                    cursor.lastChild();                                    // Closing delim "#>"
                    cursor.prevSibling();
                    let certLow = cursor.name === "CertLow";
                    cursor.parent()

                    cursor.firstChild()                                     // opening delim "<#"
                    cursor.nextSibling()                                    // Number symbol inline content

                    let hasInline = false;

                    // Skip inline children
                    while (
                        cursor.name !== "NumberSpecialValue" &&
                        cursor.name !== "FracNoValue" &&
                        !cursor.type.is("Delims")
                        ) {
                        hasInline = true;
                        if (!cursor.nextSibling()) break;
                    }

                    let isTickWithoutContent = name === "NumberSpecialTick" && !hasInline;

                    // Build num element
                    xml.push('<num');
                    if (cursor.name === "NumberSpecialValue") {
                        value = text(input, cursor);
                        let numVal = text(input, cursor).substring(value.indexOf("=") + 1);
                        cursor.nextSibling();
                        if ((cursor.name as string) === "RangePart") {
                            xml.push(` atLeast="${numVal}"`);
                            cursor.firstChild();
                            if ((cursor.name as string) !== "QuestionMark") {
                                xml.push(` atMost="${text(input, cursor)}"`);
                            }
                            cursor.parent();
                        } else {
                            if ((cursor.name as string) === "FracPart") {
                                numVal += text(input, cursor);
                            }
                            xml.push(` value="${numVal}"`);
                        }
                    } else if (cursor.name === "FracNoValue") {
                        xml.push(' type="fraction"');
                    }

                    if (name === "NumberSpecialTick" && !isTickWithoutContent) {
                        xml.push(' rend="tick"');
                    }

                    cursor.parent();
                    // Leave element open if needed
                    if (hasInline || certLow || isTickWithoutContent) {
                        xml.push('>');
                        if (isTickWithoutContent) {
                            xml.push(" '")
                        }
                    } else {
                        xml.push('/>');
                        return false;
                    }
                    break;

                case 'OrthoReg':
                    xml.push('<choice>');
                    break;

                case 'OrthoRegReg':
                    node.firstChild();
                    let langAttr = '';
                    let certAttr = '';
                    while (node.nextSibling()) {
                        if (node.name === 'LanguageIdSpec') {
                            const lang = text(input, node).substring(1);
                            langAttr = ` xml:lang="${lang}"`;
                        } else if (node.name === 'CertLow') {
                            certAttr = ' cert="low"';
                        }
                    }
                    xml.push(`<reg${langAttr}${certAttr}>`);
                    node.parent();
                    break;

                case 'OrthoRegOrig':
                    xml.push('<orig>');
                    break;

                case 'AlternateReading':
                    xml.push('<app type="alternative">');
                    break;
                case 'AlternateReadingLemma':
                    if (!node.firstChild()) {
                        xml.push('<lem/>');
                        return false;
                    } else {
                        node.parent()
                        xml.push('<lem>');
                    }
                    break;
                case 'AlternateReadingLemmaEmpty':
                    xml.push('<lem/>');
                    break;
                case 'AlternateReadingReading':
                    if (node.firstChild()) {
                        xml.push('<rdg>');
                        node.parent();
                    } else {
                        xml.push('<rdg/>');
                        return false;
                    }
                    break;
                case 'AlternateReadingReadingEmpty':
                    xml.push('<rdg/>');
                    break;

                case 'ScribalCorrection':
                    xml.push('<subst>');
                    break;
                case 'ScribalCorrectionAdd':
                    xml.push('<add place="inline"');
                    if (node.firstChild()) {
                        xml.push('>')
                        node.parent()
                    } else {
                        xml.push('/>')
                        node.parent();
                        return false;
                    }
                    break;
                case 'ScribalCorrectionAddEmpty':
                    xml.push('<add place="inline"/>');
                    break;

                case 'ScribalCorrectionDel':
                    xml.push('<del rend="corrected">');
                    break;

                case 'SpellingCorrection':
                    xml.push('<choice>');
                    break;
                case 'SpellingCorrectionCorr':
                    node.lastChild();
                    if (node.name === 'CertLow') {
                        xml.push('<corr cert="low">');
                    } else {
                        xml.push('<corr>');
                    }
                    node.parent();
                    break;
                case 'SpellingCorrectionSic':
                    xml.push('<sic>');
                    break;

                case 'EditorialCorrection':
                    xml.push('<app type="editorial">');
                    break;
                case 'EditorialCorrectionLemma':
                    node.firstChild();
                    if (node.name === "Citation") {
                        xml.push(`<lem resp="${text(input, node).substring(1)}"/>`);
                        node.parent();
                        selfClosingNodeSet.add(node.node);
                        return false;
                    }

                    node.parent();
                    node.lastChild();
                    if (node.name === "Citation") {
                        xml.push(`<lem resp="${text(input, node).substring(1)}">`);
                    } else {
                        xml.push('<lem>');
                    }
                    node.parent();
                    break;
                case 'EditorialCorrectionLemmaEmpty':
                    xml.push('<lem/>');
                    break;
                case 'EditorialCorrectionReading':
                    const isEmpty = !node.firstChild();
                    if (isEmpty) {
                        xml.push('<rdg/>');
                        node.parent();
                        return false;
                    }

                    if (node.name === "Citation") {
                        xml.push(`<rdg resp="${text(input, node).substring(1)}"/>`);
                        node.parent();
                        selfClosingNodeSet.add(node.node);
                        return false;
                    }

                    node.parent();
                    node.lastChild();
                    if (node.name === "Citation") {
                        xml.push(`<rdg resp="${text(input, node).substring(1)}">`);
                    } else {
                        xml.push('<rdg>');
                    }
                    node.parent()
                    break;
                case 'EditorialCorrectionReadingEmpty':
                    xml.push('<rdg/>');
                    break;

                case 'SuppliedOmitted':
                case 'SuppliedLost':
                case 'AbbrevInnerSuppliedLost':
                case 'SuppliedParallel':
                case 'AbbrevInnerSuppliedParallel':
                case 'SuppliedParallelLost':
                    let reason;
                    switch (name) {
                        case "SuppliedOmitted":
                            reason = "omitted";
                            break;
                        case "SuppliedLost":
                        case "SuppliedParallelLost":
                        case "AbbrevInnerSuppliedLost":
                            reason = "lost";
                            break;
                        case "SuppliedParallel":
                        case "AbbrevInnerSuppliedParallel":
                            reason = "undefined";
                            break;
                    }

                    let evidenceAttr = name === "SuppliedParallel" || name === "SuppliedParallelLost" || name === "AbbrevInnerSuppliedParallel"
                        ? ' evidence="parallel"' : "";

                    // find CertLow?
                    node.lastChild();
                    if (node.type.is("Delims")) {
                        node.prevSibling();
                    }
                    const certLowAttr = node.name === "CertLow"
                        ? ` cert="low"` : "";

                    xml.push(`<supplied${evidenceAttr} reason="${reason}"${certLowAttr}>`);

                    node.parent();
                    break;

                case 'TextTall':
                    xml.push('<hi rend="tall">');
                    break;
                case 'TextSuperscript':
                    xml.push('<hi rend="superscript">');
                    break;
                case 'TextSubscript':
                    xml.push('<hi rend="subscript">');
                    break;
                case 'Supraline':
                    xml.push('<hi rend="supraline">');
                    break;
                case 'SupralineSicContent':
                    xml.push(stripCodepoints(text(input, node), 0x304));
                    return false;
                case 'SupralineUnderline':
                    xml.push('<hi rend="supraline-underline">');
                    break;

                case 'Surplus':
                    xml.push('<surplus>');
                    break;

                case 'EditorialNote':
                    xml.push('<note xml:lang="en">');
                    break;

                case 'EditorialNoteRef': {
                    node.firstChild();
                    const ref = text(input, node);
                    node.nextSibling();
                    xml.push(`<ref n="${ref}" type="reprint-in">${text(input, node)}</ref>`);
                    return false;
                }

                case 'Quotation':
                    xml.push('<q>');
                    break;

                case 'Orig':
                    node.firstChild(); // Opening Delim
                    node.nextSibling(); // Content
                    xml.push(`<orig>${text(input, node)}</orig>`);
                    return false;

                case 'Milestone':
                    xml.push(`<milestone rend="${node.type.prop(rendProp)}" unit="undefined"/>`);
                    return false;

                case 'Handshift':
                    node.firstChild(); // HandshiftHand
                    xml.push(`<handShift new="${text(input, node)}"`);
                    if (node.nextSibling()) { // can only be CertLow per grammar
                        xml.push(' cert="low"');
                    }
                    xml.push('/>');
                    break;

                case 'Diacritical':
                    node.firstChild(); // GapNumber, DiacriticUnclear, DiacritChar or "[" (LostNumber open)

                    // Xsugar compatibility workaround
                    if (node.name === "LineBreakWrapped") {
                        const lbText = text(input, node);
                        xml.push(lbText.substring(0, lbText.length - 1));
                        node.nextSibling();
                    }

                    if (node.type.is("Delims")) {
                        node.nextSibling(); // skip "[" (LostNumber open)
                    }

                    value = text(input, node);
                    let innerXml = '';
                    switch (node.name) {
                        case "GapNumber":
                            innerXml = `<gap reason="illegible" quantity="${findNumber(input, node)}" unit="character"/>`
                            break;
                        case "LostNumber":
                            innerXml = `<gap reason="lost" quantity="${findNumber(input, node)}" unit="character"/>`;
                            break;
                        case "DiacriticUnclear":
                            innerXml = `<unclear>${stripCodepoints(text(input, node), 0x323)}</unclear>`
                            break;
                        case "DiacritChar":
                            innerXml = text(input, node);
                    }

                    if (node.name === "LostNumber") {
                        node.nextSibling(); // skip "]" (LostNumber close)
                    }
                    node.nextSibling(); // "(" (DiacriticSymbol open)
                    node.nextSibling(); // DiacriticSymbol
                    let closeHiTags = `</hi>`;
                    xml.push(`<hi rend="${diacriticValue(text(input, node))}">`);

                    if (node.nextSibling() && node.name === "DiacriticSymbol") { // second DiacriticSymbol
                        xml.push(`<hi rend="${diacriticValue(text(input, node))}">`);
                        closeHiTags += `</hi>`
                    }

                    node.parent(); // Diacritical
                    node.lastChild(); // ")" or CertLow
                    xml.push(innerXml, node.name === "CertLow" ? '<certainty match=".." locus="value"/>' : '', closeHiTags);
                    node.parent();
                    return false;
                case 'Glyph': {
                    node.firstChild(); // Opening Delim
                    node.nextSibling();
                    const glyphType = text(input, node);
                    node.nextSibling();

                    const isUnclear = node.name === 'QuestionMark';
                    if (isUnclear) {
                        xml.push('<unclear>');
                        node.nextSibling();
                    }

                    xml.push(`<g type="${glyphType}"`);

                    if (node.name === 'Text') {
                        xml.push('>');
                    } else {
                        xml.push('/>');
                        if (isUnclear) {
                            xml.push('</unclear>');
                        }
                        node.parent();
                        selfClosingNodeSet.add(node.node);
                        return false;
                    }

                    node.prevSibling();
                    break;
                }
                case 'Filler': {
                    node.firstChild(); // Opening Delim
                    node.nextSibling();
                    const rendValue = text(input, node); // GlyphWord
                    node.nextSibling(); // Closing filler delim ")"
                    node.nextSibling();

                    const isUnclear = node.name === 'QuestionMark';
                    if (isUnclear) {
                        xml.push('<unclear>');
                    }

                    xml.push(`<g rend="${rendValue}" type="filler"/>`);

                    if (isUnclear) {
                        xml.push('</unclear>');
                    }

                    return false;
                }
                case 'Figure':
                    node.firstChild(); // FigureDesc
                    xml.push(`<figure><figDesc>${text(input, node)}</figDesc></figure>`)
                    return false;
                case 'OmittedLanguage': {
                    node.firstChild(); // Language
                    const language = text(input, node);
                    node.nextSibling();

                    let quantityOrExtent = '';
                    let precisionAttr = '';

                    if (node.name === 'GapNumberCirca') {
                        quantityOrExtent = ` quantity="${text(input, node).substring(3)}"`;
                        precisionAttr = ' precision="low"';
                    } else if (node.name === 'Number') {
                        quantityOrExtent = ` quantity="${text(input, node)}"`;
                    } else if (node.name === 'QuestionMark') {
                        quantityOrExtent = ' extent="unknown"';
                    }

                    node.parent();
                    xml.push(`<gap reason="ellipsis"${quantityOrExtent} unit="${node.type.prop(unitProp)}"${precisionAttr}><desc>${language}</desc>`);

                    node.lastChild(); // check for CertLow
                    if (node.name === 'CertLow') {
                        xml.push('<certainty match=".." locus="name"/>');
                    }
                    xml.push('</gap>');
                    return false;
                }
                case 'Untranscribed': {
                    let quantityOrExtent = '';
                    let precisionAttr = '';

                    node.firstChild(); // number/range/question mark

                    if (node.name === 'GapNumberCirca') {
                        quantityOrExtent = ` quantity="${text(input, node).substring(3)}"`;
                        precisionAttr = ' precision="low"';
                    } else if (node.name === 'GapNumber') {
                        quantityOrExtent = ` quantity="${text(input, node)}"`;
                    } else if (node.name === 'GapNumberRange') {
                        const range = /(\d+)-(\d+)/.exec(text(input, node));
                        if (range) {
                            quantityOrExtent = ` atLeast="${range[1]}" atMost="${range[2]}"`;
                        }
                    } else if (node.name === 'QuestionMark') {
                        quantityOrExtent = ' extent="unknown"';
                    }

                    node.parent();
                    xml.push(`<gap reason="ellipsis"${quantityOrExtent} unit="${node.type.prop(unitProp)}"${precisionAttr}><desc>non transcribed</desc>`);

                    node.lastChild(); // Closing delim ")"
                    node.prevSibling();
                    if (node.name === 'CertLow') {
                        xml.push('<certainty match=".." locus="name"/>');
                    }

                    xml.push('</gap>');
                    return false;
                }
                case 'Inline':
                    break;

                case 'CertLow':
                    const parent = node.node.parent;
                    if (parent) {
                        if (['AbbrevUnresolved'
                        ].includes(parent.name)) {
                            xml.push('<certainty locus="name" match=".."/>');
                        } else if (['Illegible',
                            'Vestige', 'Gap', 'GapPrecLow', 'InsertionBelow', 'InsertionAbove', 'InsertionMargin',
                            'InsertionMarginUnderline', 'InsertionMarginSling', 'LostLines',
                            'Vacat'].includes(parent.name)) {
                            xml.push('<certainty match=".." locus="name"/>');
                        } else if (['EditorialCorrectionLemma', 'EditorialCorrectionReading', 'AlternateReadingLemma',
                            'AlternateReadingReading', 'ScribalCorrectionAdd', 'ScribalCorrectionDel', 'SpellingCorrectionSic',
                            'TextSubscript', 'Surplus', 'Deletion', 'OrthoRegOrig'
                        ].includes(parent.name)) {
                            xml.push('<certainty match=".." locus="value"/>');
                        } else if (['NumberSpecial', 'NumberSpecialTick'].includes(parent.name)) {
                            xml.push('<certainty match="../@value" locus="value"/>');
                        }
                    }
                    return false;

                case 'GlyphContent':
                case 'LanguageIdSpec':
                case 'Citation':
                case 'NumberSpecialValue':
                case 'NumberSpecialTickNoContent':
                case 'FracPart':
                case 'RangePart':
                case 'FracNoValue':
                case 'QuestionMark':
                    return false;

                case 'AbbrevInner':
                    // node.firstChild()
                    break;

                default:
                    if (node.type.is("Delims") || node.type.is("GapNums")) {
                        return false;
                    }
                    xml.push(`<${name}>`);
                    break;
            }
        },
        leave: (node) => {
            switch (node.name) {
                case 'Document':
                    break;
                case 'AbbrevUnresolved':
                    xml.push('</abbr>');
                    break;
                case 'Abbrev':
                    xml.push('</expan>');
                    break;
                case 'Ab':
                    if (!selfClosingNodeSet.has(node.node)) {
                        xml.push('</ab>');
                    }
                    break;
                case 'Div':
                case 'Recto':
                case 'Verso':
                case 'Fragment':
                case 'Part':
                case 'Column':
                case 'Folio':
                case 'Side':
                    xml.push('</div>');
                    break;
                case 'SuppliedOmitted':
                case 'SuppliedLost':
                case 'SuppliedParallel':
                case 'SuppliedParallelLost':
                case 'AbbrevInnerSuppliedLost':
                case 'AbbrevInnerSuppliedParallel':
                    if (!selfClosingNodeSet.has(node.node)) {
                        xml.push('</supplied>');
                    }
                    break;
                case 'Deletion':
                case 'ScribalCorrectionDel':
                    xml.push('</del>');
                    break;
                case 'InsertionAbove':
                case 'InsertionBelow':
                case 'InsertionMargin':
                case 'InsertionMarginSling':
                case 'InsertionMarginUnderline':
                case 'ScribalCorrectionAdd':
                    if (!selfClosingNodeSet.has(node.node)) {
                        xml.push('</add>');
                    }
                    break;
                case 'TextTall':
                case 'TextSuperscript':
                case 'TextSubscript':
                case 'Supraline':
                case 'SupralineUnderline':
                    xml.push('</hi>');
                    break;
                case 'Surplus':
                    xml.push('</surplus>');
                    break;
                case 'EditorialNote':
                    xml.push('</note>');
                    break;
                case 'Quotation':
                    xml.push('</q>');
                    break;
                case 'Foreign':
                    xml.push('</foreign>');
                    break;
                case 'OrthoRegReg':
                    xml.push('</reg>');
                    break;
                case 'OrthoRegOrig':
                    xml.push('</orig>');
                    break;
                case 'OrthoReg':
                case 'SpellingCorrection':
                    xml.push('</choice>')
                    break;
                case 'AlternateReading':
                case 'EditorialCorrection':
                    xml.push('</app>');
                    break;
                case 'AlternateReadingLemma':
                case 'EditorialCorrectionLemma':
                    if (!selfClosingNodeSet.has(node.node)) {
                        xml.push('</lem>');
                    }
                    break;
                case 'AlternateReadingReading':
                case 'EditorialCorrectionReading':
                    xml.push('</rdg>')
                    break;
                case 'ScribalCorrection':
                    xml.push('</subst>');
                    break;
                case 'SpellingCorrectionCorr':
                    xml.push('</corr>');
                    break;
                case 'SpellingCorrectionSic':
                    xml.push('</sic>')
                    break;
                case 'NumberSpecial':
                case 'NumberSpecialTick':
                    if (!selfClosingNodeSet.has(node.node)) {
                        xml.push('</num>');
                    }
                    break;
                case 'Vestige':
                case 'Gap':
                case 'GapPrecLow':
                case 'Illegible':
                case 'LostLines':
                    if (!selfClosingNodeSet.has(node.node)) {
                        xml.push(`</gap>`)
                    }
                    break;
                case 'Vacat':
                    if (!selfClosingNodeSet.has(node.node)) {
                        xml.push(`</space>`)
                    }
                    break;
                case 'Glyph':
                    if (!selfClosingNodeSet.has(node.node)) {
                        xml.push('</g>');

                        // need to close unclear?
                        if (node.node.getChild('QuestionMark')) {
                            xml.push('</unclear>');
                        }
                    }
                    break;
            }
        }
    });
    if (root.type.name === 'Inline') {
        xml.push('</ab>');
    }

    if (needsCloseEdition) {
        xml.push(`</div>`);
    }

    return xml.join('');
}
