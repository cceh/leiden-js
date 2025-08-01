import {
    DocumentFragment,
    DOMParserType,
    Element,
    getChildElements,
    getOuterHtml,
    Node,
    TransformationError,
    XMLSerializerType,
    xmlToLeiden
} from "@leiden-js/common/transformer";

function transformElem(elem: Element, output: string[], serializer?: XMLSerializerType) {
    for (let i = 0; i < elem.childNodes.length; i++) {
        transform(elem.childNodes[i], output, serializer);
    }
}

function transform(node: Node | null, output: string[], serializer?: XMLSerializerType) {
    if (!node) {
        return;
    }

    switch (node.nodeType) {
        case node.DOCUMENT_NODE:
        case node.DOCUMENT_FRAGMENT_NODE: {
            const firstChild = getChildElements(<DocumentFragment>node)[0];
            transform(firstChild, output, serializer);
            break;
        }
        case node.ELEMENT_NODE: {
            const elem = <Element>node;
            let n;
            switch (elem.localName) {
                case "ab":
                    output.push("<=");
                    transformElem(elem, output, serializer);
                    output.push("=>");
                    break;
                case "abbr":
                    output.push("(|");
                    transformElem(elem, output, serializer);
                    // Check for certainty
                    for (const child of getChildElements(elem, "certainty")) {
                        if (child.getAttribute("match") === ".." &&
                            child.getAttribute("locus") === "name") {
                            output.push("(?)");
                        }
                    }
                    output.push("|)");
                    break;
                case "del":
                    output.push("〚");
                    switch (elem.getAttribute("rend")) {
                        case "cross-strokes":
                            output.push("X");
                            break;
                        case "slashes":
                            output.push("/");
                            break;
                        case "erasure":
                            break;
                        default:
                            throw new TransformationError(`Unsupported del rend '${elem.getAttribute("rend")}'`, elem, serializer);
                    }
                    transformElem(elem, output, serializer);
                    for (const child of getChildElements(elem, "certainty")) {
                        if (child.getAttribute("match") === ".." &&
                            child.getAttribute("locus") === "value") {
                            output.push("(?)");
                        }
                    }
                    output.push("〛");
                    break;
                case "div": {
                    const type = elem.getAttribute("type");
                    switch (type) {
                        case "textpart": {
                            n = elem.getAttribute("n");
                            if (!n) {
                                throw new TransformationError("div needs an n attribute", elem, serializer);
                            }

                            const subtype = elem.getAttribute("subtype");
                            const corresp = elem.getAttribute("corresp");

                            output.push(`<D=.${n}`);
                            if (subtype) {
                                output.push(`.${subtype}`);
                            }
                            if (corresp) {
                                output.push(`.${corresp}`);
                            }

                            transformElem(elem, output, serializer);
                            output.push("=D>");
                            break;
                        }
                        case "edition": {
                            const lang = elem.getAttribute("xml:lang");
                            if (!lang) {
                                throw new TransformationError("div needs a xml:lang attribute", elem, serializer);
                            }
                            output.push(`<S=.${lang}`);
                            transformElem(elem, output, serializer);
                            break;
                        }
                        default:
                            throw new TransformationError(`Unsupported div type '${type}'`, elem, serializer);
                    }
                    break;
                }
                case "expan":
                case "ex": {
                    const cert = elem.getAttribute("cert");
                    output.push("(");
                    transformElem(elem, output, serializer);
                    if (cert === "low") {
                        output.push("?");
                    }
                    output.push(")");
                    break;
                }
                case "gap":
                    transformGap(elem, output, serializer);
                    break;
                case "space":
                    transformSpace(elem, output, serializer);
                    break;
                case "lb":
                    transformLb(elem, output, serializer);
                    break;
                case "supplied":
                    transformSupplied(elem, output, serializer);
                    break;
                case "unclear": {
                    const children = getChildElements(elem);
                    if (children.length > 0) {
                        if (children.length === 1 && children[0]?.localName === "g") {
                            transformGlyph(children[0], output);
                            break;
                        }
                        throw new TransformationError("unclear cannot contain non-character content", elem, serializer);
                    }
                    const text = elem.textContent || "";
                    addCombining(text, output, ["\u0323"]);
                    break;
                }
                case "foreign":
                    output.push("~|");
                    transformElem(elem, output, serializer);
                    output.push(`|~${elem.getAttribute("xml:lang")} `);
                    break;
                case "milestone":
                    transformMilestone(elem, output);
                    break;
                case "add":
                    transformAdd(elem, output, serializer);
                    break;
                case "hi":
                    transformHi(elem, output, serializer);
                    break;
                case "choice":
                    transformChoice(elem, output, serializer);
                    break;
                case "app":
                    transformApp(elem, output, serializer);
                    break;
                case "subst":
                    transformSubst(elem, output, serializer);
                    break;
                case "orig":
                    output.push("!");
                    transformElem(elem, output, serializer);
                    output.push("!");
                    break;
                case "handShift": {
                    output.push("$");
                    const newHand = elem.getAttribute("new");
                    if (!newHand) {
                        throw new TransformationError('handshift needs a "new" attribute', elem, serializer);
                    }
                    output.push(newHand);

                    if (elem.getAttribute("cert") === "low") {
                        output.push("(?)");
                    }

                    output.push(" ");
                    break;
                }
                case "figure": {
                    const children = getChildElements(elem);
                    if (elem.childNodes.length !== 1 || children[0]?.localName !== "figDesc") {
                        throw new TransformationError("figure needs exactly one figDesc child", elem, serializer);
                    }
                    const figDesc = children[0];
                    if (figDesc.childNodes.length !== 1 || getChildElements(figDesc).length > 0) {
                        throw new TransformationError("figDesc must only contain text and cannot be empty", elem, serializer);
                    }

                    output.push(`#${figDesc.textContent} `);
                    break;
                }
                case "g":
                    transformGlyph(elem, output);
                    break;
                case "num":
                    transformNum(elem, output, serializer);
                    break;
                case "note":
                    transformNote(elem, output, serializer);
                    break;
                case "surplus":
                    output.push("{");
                    transformElem(elem, output, serializer);

                    // Check for certainty
                    for (const child of getChildElements(elem, "certainty")) {
                        if (child.getAttribute("match") === ".." &&
                            child.getAttribute("locus") === "value") {
                            output.push("(?)");
                        }
                    }
                    output.push("}");
                    break;
                case "q":
                    output.push('"');
                    transformElem(elem, output, serializer);
                    output.push('"');
                    break;

                case "certainty":
                case "ref":
                    break;
                default:
                    throw new TransformationError(`Cannot transform element ${elem.localName} to Leiden`, elem, serializer);
            }
            break;
        }
        case node.TEXT_NODE:
            output.push(node.nodeValue || "");
            break;
    }
}

function getLength(input: string | null): number {
    if (!input) {
        return 0;
    }
    let length = 0;
    for (let i = 0; i < input.length; i++) {
        const codepoint = input.codePointAt(i)!;
        if (codepoint >= 0x10000 || /\p{M}/u.test(String.fromCodePoint(codepoint))) {
            continue;
        }
        length++;
    }

    return length;
}

function addCombining(textContent: string, output: string[], combiningCharacters: string[]) {
    for (let i = 0; i < textContent.length; i++) {
        const codepoint = textContent.codePointAt(i);

        if (codepoint) {
            // Handle surrogate pairs, move index appropriately
            const char = String.fromCodePoint(codepoint);
            output.push(char);

            if (codepoint >= 0x10000) {
                i++; // increment extra for surrogate pairs
            }

            // Output existing combining marks and increase the index
            while (i + 1 < textContent.length) {
                const nextCodepoint = textContent.codePointAt(i + 1);
                if (!nextCodepoint || !/\p{M}/u.test(String.fromCodePoint(nextCodepoint))) {
                    break;
                }
                i++;
                const mark = String.fromCodePoint(nextCodepoint);
                if (!combiningCharacters.includes(mark)) { // ignore existing
                    output.push(mark);
                }
            }

            output.push(...combiningCharacters);
        }
    }
}

function transformNote(elem: Element, output: string[], serializer?: XMLSerializerType) {
    output.push("/*");

    let ref: Element | null = null;
    const children = getChildElements(elem);
    for (const child of children) {
        if (child.localName === "ref") {
            if (!ref) {
                if (children[children.length - 1] !== child) {
                    throw new TransformationError("ref needs to be the last child of note", elem, serializer);
                }
                ref = <Element>child;
            } else {
                throw new TransformationError("note can only contain one ref", elem, serializer);
            }
        }
    }

    transformElem(elem, output, serializer);
    if (ref) {
        const n = ref.getAttribute("n");
        if (!n) {
            throw new TransformationError('ref must contain an "n" attribute', elem, serializer);
        }
        if (!ref.textContent) {
            throw new TransformationError("ref cannot be empty", elem, serializer);
        }

        output.push(`(ref=${n}=${ref.textContent})`);
    }
    output.push("*/");
}

function transformNum(elem: Element, output: string[], serializer?: XMLSerializerType) {
    const value = elem.getAttribute("value");
    const type = elem.getAttribute("type");
    const rend = elem.getAttribute("rend");
    const atLeast = elem.getAttribute("atLeast");
    const atMost = elem.getAttribute("atMost");

    output.push("<#");
    transformElem(elem, output, serializer);

    // Check for certainty
    let hasCertainty = false;
    for (const child of getChildElements(elem, "certainty")) {
        if (child.getAttribute("match") === "../@value" &&
            child.getAttribute("locus") === "value") {
            hasCertainty = true;
        }
    }

    switch (rend) {
        case "tick":
            output.push(" '=");
            break;
        case null:
            output.push("=");
            break;
        default:
            throw new TransformationError(`Incorrect rend attribute on num: ${rend}`, elem, serializer);
    }

    if (type === "fraction") {
        output.push("frac");
    } else if (value) {
        output.push(value);
        if (hasCertainty) output.push("(?)");
    } else if (atLeast) {
        if (atMost) {
            output.push(`${atLeast}-${atMost}`);
        } else {
            output.push(`${atLeast}-?`);
        }
    }

    output.push("#>");
}

function transformGlyph(elem: Element, output: string[]) {
    // Handle unclear wrapper
    const isUnclear = elem.parentElement?.tagName === "unclear";

    // Check if it's a filler
    const type = elem.getAttribute("type");
    const rend = elem.getAttribute("rend");
    if (type === "filler") {
        output.push("*filler");
        if (rend) {
            output.push(`(${rend})`);
        }
        if (isUnclear) output.push("?");
        output.push("*");
        return;
    }

    // Handle regular glyph
    output.push("*");
    output.push(type || "");

    // Handle content if present
    const content = elem.textContent;
    if (content && type !== content) {
        if (isUnclear) output.push("?,");
        else output.push(",");
        output.push(content);
    } else if (isUnclear) {
        output.push("?");
    }

    output.push("*");
}

function transformSubst(elem: Element, output: string[], serializer?: XMLSerializerType) {
    output.push("<:");

    const add = getChildElements(elem, "add")?.[0];
    const del = getChildElements(elem, "del")?.[0];

    if (add) {
        transformElem(add, output, serializer);

        // Check for certainty in add
        for (const child of getChildElements(add, "certainty")) {
            if (child.getAttribute("match") === ".." &&
                child.getAttribute("locus") === "value") {
                output.push("(?)");
            }
        }
    }

    output.push("|subst|");

    if (del) {
        transformElem(del, output, serializer);

        // Check for certainty in del
        for (const child of getChildElements(del, "certainty")) {
            if (child.getAttribute("match") === ".." &&
                child.getAttribute("locus") === "value") {
                output.push("(?)");
            }
        }
    }

    output.push(":>");
}

function transformChoice(elem: Element, output: string[], serializer?: XMLSerializerType) {
    output.push("<:");

    const children = Array.from(elem.childNodes).filter(node => node.nodeType === node.ELEMENT_NODE) as Element[];
    const firstChild = children[0];

    if (firstChild.tagName === "corr") {
        // Handle correction
        transformElem(firstChild, output, serializer);
        if (firstChild.getAttribute("cert") === "low") output.push("(?)");
        output.push("|corr|");

        const sic = children[1];
        transformElem(sic, output, serializer);
        // Check for certainty in sic
        for (const child of getChildElements(sic, "certainty")) {
            if (child.getAttribute("match") === ".." &&
                child.getAttribute("locus") === "value") {
                output.push("(?)");
            }
        }

    } else if (firstChild.tagName === "reg") {
        // Check if multiple reg tags
        if (children.length > 2) {
            // Handle multiple reg tags
            for (let i = 0; i < children.length - 1; i++) {
                const reg = children[i];
                transformElem(reg, output, serializer);
                if (reg.getAttribute("cert") === "low") output.push("(?)");

                const lang = reg.getAttribute("xml:lang");
                if (lang) output.push(`=${lang}`);

                output.push("|");
            }
            output.push("|reg||");
            const orig = children[children.length - 1];
            transformElem(orig, output, serializer);
            // Check for certainty in orig
            for (const child of getChildElements(orig, "certainty")) {
                if (child.getAttribute("match") === ".." &&
                    child.getAttribute("locus") === "value") {
                    output.push("(?)");
                }
            }
        } else {
            // Single reg
            transformElem(firstChild, output, serializer);
            if (firstChild.getAttribute("cert") === "low") output.push("(?)");

            const lang = firstChild.getAttribute("xml:lang");
            if (lang) output.push(`=${lang}`);

            output.push("|reg|");

            const orig = children[1];
            transformElem(orig, output, serializer);
            // Check for certainty in orig
            for (const child of getChildElements(orig, "certainty")) {
                if (child.getAttribute("match") === ".." &&
                    child.getAttribute("locus") === "value") {
                    output.push("(?)");
                }
            }
        }
    }

    output.push(":>");
}

function transformApp(elem: Element, output: string[], serializer?: XMLSerializerType) {
    output.push("<:");

    const type = elem.getAttribute("type");
    const lem = getChildElements(elem, "lem")?.[0];
    const readings = getChildElements(elem, "rdg");

    // Handle lem
    if (lem) {
        transformElem(lem, output, serializer);

        // Handle certainty in lem
        for (const child of getChildElements(lem, "certainty")) {
            if (child.getAttribute("match") === ".." &&
                child.getAttribute("locus") === "value") {
                output.push("(?)");
            }
        }

        // Handle resp attribute in lem
        const resp = lem.getAttribute("resp");
        if (resp) output.push(`=${resp}`);
    }

    // Type separator
    if (readings.length > 1) {
        output.push(type === "alternative" ? "||alt||" : "||ed||");
    } else {
        output.push(type === "alternative" ? "|alt|" : "|ed|");
    }

    // Handle readings
    Array.from(readings).forEach((rdg, idx) => {
        transformElem(rdg, output, serializer);

        // Handle certainty in rdg
        for (const child of getChildElements(rdg, "certainty")) {
            if (child.getAttribute("match") === ".." &&
                child.getAttribute("locus") === "value") {
                output.push("(?)");
            }
        }

        // Handle resp attribute in rdg
        const resp = rdg.getAttribute("resp");
        if (resp) output.push(`=${resp}`);

        // Add separator if not last reading
        if (idx < readings.length - 1) output.push("|");
    });

    output.push(":>");
}

function transformHi(elem: Element, output: string[], serializer?: XMLSerializerType) {
    const rend = elem.getAttribute("rend");
    let certLow = false;

    // Check for certainty
    for (const e of getChildElements(elem)) {
        if (e.tagName === "certainty" &&
            e.getAttribute("match") === ".." &&
            e.getAttribute("locus") === "value") {
            certLow = true;
        }
    }

    // Handle diacritical marks
    const diacriticalMap: { [key: string]: string } = {
        "diaeresis": "¨",
        "grave": "`",
        "asper": " ῾",
        "acute": "´",
        "circumflex": "^",
        "lenis": " ᾿"
    };

    if (rend && diacriticalMap[rend]) {
        const children = getChildElements(elem);

        const parentHi = elem.parentElement?.localName === "hi" ? elem.parentElement : null;
        const parentRend = parentHi?.getAttribute("rend");
        const parentDiacritical = parentRend && diacriticalMap[parentRend] ? parentHi : null;
        if (parentDiacritical) {
            const parentParentRend = parentDiacritical.parentElement?.getAttribute("rend");
            if (parentDiacritical.parentElement?.localName === "hi" && diacriticalMap[parentParentRend ?? ""]) {
                throw new TransformationError(`Cannot handle diacritical mark in ${getOuterHtml(elem, serializer)}`, elem, serializer);
            }

            if (children.length > 0 || getLength(elem.textContent) !== 1) {
                throw new TransformationError(`Cannot handle diacritical mark in ${getOuterHtml(elem, serializer)}`, elem, serializer);
            }
        } else {
            if (children.length === 0) {
                if (getLength(elem.textContent) !== 1) {
                    throw new TransformationError(`Cannot handle diacritical mark in ${getOuterHtml(elem, serializer)}`, elem, serializer);
                }
            } else if (children.length > 0) {
                const child = children[0];
                if (child && children.length > 2 || !["unclear", "gap", "hi", "certainty"].includes(child.nodeName)) {
                    // TODO guard attributes
                    throw new TransformationError(`Cannot handle diacritical mark in ${getOuterHtml(elem, serializer)}`, elem, serializer);
                } else if (child?.localName === "unclear") {
                    if (getLength(child.textContent) !== 1) {
                        throw new TransformationError(`Cannot handle diacritical mark in ${getOuterHtml(elem, serializer)}`, elem, serializer);
                    }
                }
            }
        }

        if (parentDiacritical) {
            output.push(` ${elem.textContent}(${(parentRend && diacriticalMap[parentRend]) ?? ""}${diacriticalMap[rend]})`);
        } else {
            const isParentHi = children[0]?.localName !== "hi";
            if (isParentHi) {
                output.push(" ");
            }
            transformElem(elem, output, serializer);
            if (isParentHi) {
                output.push(`(${diacriticalMap[rend]})`);
            }
        }
        if (certLow) output.push("(?)");
        return;
    }

    // Handle other renderings
    switch (rend) {
        case "subscript":
            output.push("\\|");
            transformElem(elem, output, serializer);
            if (certLow) output.push("(?)");
            output.push("|/");
            break;

        case "tall":
            output.push("~||");
            transformElem(elem, output, serializer);
            output.push("||~tall");
            break;

        case "superscript":
            output.push("|^");
            transformElem(elem, output, serializer);
            output.push("^|");
            break;

        case "supraline-underline":
            output.push("¯_");
            transformElem(elem, output, serializer);
            output.push("_¯");
            break;

        case "supraline": {
            // Check if using combining macron or non-combining
            let hasNonUnclearElementChildren = false;

            for (const child of getChildElements(elem)) {
                if (child.localName !== "unclear") {
                    hasNonUnclearElementChildren = true;
                    break;
                }
            }

            if (hasNonUnclearElementChildren) {
                output.push("¯");
                transformElem(elem, output, serializer);
                output.push("¯");
            } else { // only unclear children or no element children
                for (const child of elem.childNodes) {
                    if (child.nodeType === child.TEXT_NODE) {
                        addCombining(child.textContent ?? "", output, ["\u0304"]);
                    } else if (child.nodeName === "unclear") {
                        addCombining(child.textContent ?? "", output, ["\u0304", "\u0323"]);
                    }
                }
            }
        }
    }
}

function transformAdd(elem: Element, output: string[], serializer?: XMLSerializerType) {
    const place = elem.getAttribute("place");
    const rend = elem.getAttribute("rend");
    let certLow = false;

    const children = getChildElements(elem);
    const lastChild = children[children.length - 1];
    const certElem = lastChild?.nodeName === "certainty" ? lastChild : null;

    if (certElem?.tagName === "certainty" &&
        certElem.getAttribute("match") === ".." &&
        certElem.getAttribute("locus") === "name") {
        certLow = true;
    }

    // Handle special renderings first
    if (rend === "sling" && place === "margin") {
        output.push("<|");
        transformElem(elem, output, serializer);
        if (certLow) output.push("(?)");
        output.push("|>");
        return;
    }

    if (rend === "underline" && place === "margin") {
        output.push("<_");
        transformElem(elem, output, serializer);
        if (certLow) output.push("(?)");
        output.push("_>");
        return;
    }

    // Handle places
    switch (place) {
        case "above":
            output.push("\\");
            transformElem(elem, output, serializer);
            if (certLow) output.push("(?)");
            output.push("/");
            break;

        case "below":
            output.push("//");
            transformElem(elem, output, serializer);
            if (certLow) output.push("(?)");
            output.push("\\\\");
            break;

        case "bottom":
        case "left":
        case "right":
        case "top":
        case "margin":
        case "interlinear":
            output.push(`||${place === "interlinear" ? "interlin" : place}:`);
            transformElem(elem, output, serializer);
            if (certLow) output.push("(?)");
            output.push("||");
            break;
    }
}

function transformMilestone(elem: Element, output: string[]) {
    switch (elem.getAttribute("rend")) {
        case "horizontal-rule":
            output.push("--------");
            break;
        case "wavy-line":
            output.push("~~~~~~~~");
            break;
        case "paragraphos":
            output.push("----");
            break;
        case "diple-obelismene":
            output.push(">---");
            break;
        case "box":
            output.push("###");
            break;
        case "coronis":
            output.push("-$$-");
            break;
    }
}

function transformLb(elem: Element, output: string[], serializer?: XMLSerializerType) {
    const n = elem.getAttribute("n");
    const breakAttr = elem.getAttribute("break");
    const rend = elem.getAttribute("rend");
    if (!n) {
        throw new TransformationError(`Missing n attribute in lb element: ${getOuterHtml(elem, serializer)}`, elem, serializer);
    }


    // Handle special rendering (e.g., "(23, perp)")
    if (rend) {
        output.push("(");
        output.push(n);

        // Handle word break in special rendering
        if (breakAttr === "no") {
            output.push(".-, ");
        } else {
            output.push(", ");
        }

        output.push(rend);
        output.push(")");
        return;
    }

    // Regular line number handling
    output.push(n);
    output.push(".");

    // Handle word break
    if (breakAttr === "no") {
        output.push("- ");
    } else {
        output.push(" ");
    }
}

function transformGap(elem: Element, output: string[], serializer?: XMLSerializerType) {
    const unit = elem.getAttribute("unit");
    const quantity = elem.getAttribute("quantity");
    const reason = elem.getAttribute("reason");
    let isLangEllipsis = false;
    let certLow = false;
    let vestiges = false;
    const extent = elem.getAttribute("extent");

    const children = getChildElements(elem);

    const certElem = children.find(e => e.localName === "certainty");

    if (certElem && certElem.getAttribute("match") === ".." && certElem.getAttribute("locus") === "name") {
        certLow = true;
    }

    if (reason === "lost") {
        if (unit === "character") {
            output.push("[");
        } else if (unit === "line") {
            output.push("lost");
        }
    } else if (reason === "omitted") {
        if (unit === "character") {
            output.push("<");
        }
    } else if (reason === "ellipsis" || reason === "illegible") {
        if (children.length === 1 || children.length === 2) {
            const descEl = children[0];
            if (descEl.tagName === "desc") {
                if (reason === "ellipsis") {
                    if (descEl.textContent === "non transcribed") {
                        let unitOutput = "";
                        switch (unit) {
                            case "character":
                                unitOutput = "Chars";
                                break;
                            case "line":
                                unitOutput = "Lines";
                                break;
                            case "column":
                                unitOutput = "Column";
                                break;
                        }
                        output.push(`(${unitOutput}: `);
                    } else {
                        output.push(`(Lang: ${descEl.textContent} `);
                        isLangEllipsis = true;
                    }
                } else if (reason === "illegible" && descEl.textContent === "vestiges") {
                    vestiges = true;
                    output.push("vestig");
                }
            }
        }

        if (reason === "illegible" && unit === "line" && extent === "unknown") {
            vestiges = true;
            output.push("vestig");
        }
    }

    if (elem.getAttribute("precision") === "low") {
        if ((reason === "lost" && unit === "line") || vestiges && (unit === "line" || quantity !== null)) {
            output.push(".");
        }
        output.push("ca");
    }

    if (!(reason === "ellipsis" && elem.getAttribute("precision") !== "low") && !(vestiges && unit === "character" && extent === "unknown")) {
        output.push(".");
    }

    let quantityOutput: string = "";
    if (quantity) {
        quantityOutput = quantity;
    } else {
        if (extent === "unknown") {
            if (vestiges && unit === "character") {
                if (!certLow) {
                    quantityOutput = " ";
                }
            } else {
                quantityOutput = "?";
            }
        } else {
            const atLeast = elem.getAttribute("atLeast"),
                atMost = elem.getAttribute("atMost");
            if (atLeast !== null && atMost !== null) {
                quantityOutput = `${atLeast}-${atMost}`;
            } else {
                throw new TransformationError(`Invalid gap element: ${getOuterHtml(elem, serializer)}`, elem, serializer);
            }
        }
    }
    output.push(quantityOutput);

    if ((reason === "illegible" || reason === "lost") && unit === "line") {
        output.push("lin");
    } else if (vestiges) {
        if (unit === "line") {
            output.push("lin");
        } else if (unit === "character" && extent !== "unknown") {
            output.push("char");
        }
    } else if (reason === "lost" && unit === "character") {
        if (certLow) {
            output.push("(?)");
        }
        output.push("]");
    } else if (reason === "omitted" && unit === "character") {
        if (certLow) {
            output.push("(?)");
        }
        output.push(">");
    } else if (reason === "ellipsis") {
        if (isLangEllipsis) {
            output.push(` ${unit === "character" ? "char" : "lines"}`);
        } else {
            output.push(" non transcribed");
        }
    }

    if (reason === "illegible" || reason === "ellipsis" || (reason === "lost" && unit === "line")) {
        if (certLow) {
            output.push("(?)");
            if (reason !== "ellipsis") {
                output.push(" ");
            }
        }
    }

    if (reason === "ellipsis") {
        output.push(")");
    }
}

function transformSpace(elem: Element, output: string[], serializer?: XMLSerializerType) {
    const unit = elem.getAttribute("unit");
    const quantity = elem.getAttribute("quantity");
    let certLow = false;

    const children: Element[] = [];
    for (const e of elem.childNodes) {
        if (e.nodeType === e.ELEMENT_NODE) {
            children.push(e as Element);
        }
    }

    const certElem = children.find(e => e.nodeName === "certainty");

    if (certElem && certElem.getAttribute("match") === ".." && certElem.getAttribute("locus") === "name") {
        certLow = true;
    }

    // Start with 'vac'
    output.push("vac");

    // Add dot
    output.push(".");

    // Handle precision="low" (ca.)
    if (elem.getAttribute("precision") === "low") {
        output.push("ca.");
    }

    // Handle quantity/extent/range
    let quantityOutput;
    if (quantity) {
        quantityOutput = quantity;
    } else {
        const extent = elem.getAttribute("extent");
        if (extent === "unknown") {
            quantityOutput = "?";
        } else {
            const atLeast = elem.getAttribute("atLeast"),
                atMost = elem.getAttribute("atMost");
            if (atLeast !== null && atMost !== null) {
                quantityOutput = `${atLeast}-${atMost}`;
            } else {
                throw new TransformationError(`Invalid space element: ${getOuterHtml(elem, serializer)}`, elem, serializer);
            }
        }
    }
    output.push(quantityOutput);

    // Add 'lin' if unit is line
    if (unit === "line") {
        output.push("lin");
    }

    // Add uncertainty marker if present
    if (certLow) {
        output.push("(?) ");
    }
}


function transformSupplied(elem: Element, output: string[], serializer?: XMLSerializerType) {
    const reason = elem.getAttribute("reason");
    const evidence = elem.getAttribute("evidence");
    if (reason) {
        const cert = elem.getAttribute("cert");
        switch (reason) {
            case "omitted":
                output.push("<");
                transformElem(elem, output, serializer);
                if (cert && cert === "low") {
                    output.push("(?)");
                }
                output.push(">");
                break;
            case "undefined":
                if (evidence === "parallel") {
                    output.push("|_");
                    transformElem(elem, output, serializer);
                    if (cert && cert === "low") {
                        output.push("(?)");
                    }
                    output.push("_|");
                }
                break;
            case "lost":
            default:
                if (evidence === "parallel") {
                    output.push("_[");
                    transformElem(elem, output, serializer);
                    if (cert && cert === "low") {
                        output.push("(?)");
                    }
                    output.push("]_");
                    break;
                } else {
                    output.push("[");
                    transformElem(elem, output, serializer);
                    if (cert && cert === "low") {
                        output.push("(?)");
                    }
                    output.push("]");
                    break;
                }
        }
    }
}

export function xmlToLeidenPlus(xml: Node | string, domParser?: DOMParserType, xmlSerializer?: XMLSerializerType): string {
    return xmlToLeiden(xml, domParser, xmlSerializer, transform);
    // let columnBreaks = Array.from((root as Element).getElementsByTagName?.("cb"));
    // if (columnBreaks.length > 0) {
    //     root = root.cloneNode(true) as Element;
    //     columnBreaks = Array.from((root as Element).getElementsByTagName?.("cb"));
    //     for (let i = 0; i <= columnBreaks.length; i++) {
    //         const range = root.ownerDocument!.createRange();
    //         if (i === 0) {
    //             range.setStart(root, 0);
    //         } else {
    //             range.setStartAfter(columnBreaks[i - 1]);
    //         }
    //         if (i === columnBreaks.length) {
    //             if (root.lastChild) {
    //                 range.setEndAfter(root.lastChild);
    //             }
    //         } else {
    //             range.setEndBefore(columnBreaks[i]);
    //         }
    //         const columnDiv = root.ownerDocument!.createElement("div");
    //         columnDiv.setAttribute("type", "textpart");
    //         columnDiv.setAttribute("subtype", "column");
    //         columnDiv.setAttribute("n", (i + 1).toString());
    //         const ab = root.ownerDocument!.createElement("ab");
    //         columnDiv.appendChild(ab);
    //         ab.appendChild(range.extractContents());
    //         transform(columnDiv, output, serializer);
    //     }
    // } else {
    //     transform(root, output, serializer);
    // }
}
