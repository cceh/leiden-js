import { wrappingRules } from "@leiden-js/codemirror-lang-leiden-plus";
import {
    findDescendant,
    leidenBaseLinter,
    leidenLinterExtension,
    NodeLinter,
    unclosedExpressionCheck
} from "@leiden-js/common/linter";
import { Tree } from "@lezer/common";
import { Diagnostic } from "@codemirror/lint";

const nodeDescriptions: Record<string, string> = {
    Abbrev: "Abbreviation",
    AbbrevInnerEx: "Abbreviation expansion",
    AbbrevInvalid: "Abbreviation",
    AbbrevUnresolved: "Unresolved Abbreviation",
    AlternateReading: "Alternate Reading",
    Foreign: "Foreign Text",
    Gap: "Lost Text (Lacuna)",
    GapOmitted: "Omitted Text",
    LineBreakSpecial: "Special Line Break",
    LineBreakSpecialWrapped: "Special Line Break (Wrapped)",
    OrthoReg: "Orthographic Regularization",
    ScribalCorrection: "Scribal Correction",
    SpellingCorrection: "Spelling Correction",
    SuppliedLost: "Supplied (Lost) Text",
    SuppliedOmitted: "Supplied (Omitted) Text",
    SuppliedParallel: "Supplied Parallel Evidence Text",
    Surplus: "Surplus Text",
    InsertionAbove: "Insertion Above Line",
    InsertionBelow: "Insertion Below Line",
    InsertionMargin: "Marginal Insertion",
    InsertionMarginSling: "Marginal Insertion With Sling",
    InsertionMarginUnderline: "Marginal Insertion With Underline",
    TextTall: "Tall Text",
    TextSuperscript: "Superscript Text",
    TextSubscript: "Subscript Text",
    Supraline: "Supralined Text",
    SupralineUnderline: "Supralined And Underlined Text",
    EditorialNote: "Editorial Note",
    Quotation: "Quotation",
    Orig: "Original Text",
    NumberSpecial: "Number",
    Diacritical: "Diacritical Character",

};

const checkUnclosedExpression = unclosedExpressionCheck(wrappingRules, nodeDescriptions);

const diacritPattern = /[´`^¨]| [῾᾿]/;

function getPrecedingContext(text: string, index: number, contextLength: number = 10): string {
    const start = Math.max(0, index - contextLength);
    const prefix = start > 0 ? "…" : "";
    return `${prefix}${text.slice(start, index)}`;
}

export const leidenPlusNodeLinter: NodeLinter = (doc, node) => {
    if (node.name === "NumberSpecial") {
        const numberValue = findDescendant(node, "NumberSpecialValue");
        const prevSibling = numberValue?.node?.prevSibling;
        if (prevSibling?.name === "Text") {
            const prevChar = doc.slice(prevSibling.to - 1, prevSibling.to);
            if (prevChar === "'") {
                return [{
                    from: prevSibling.from,
                    to: prevSibling.to,
                    severity: "error",
                    message: `Missing required space before tick ${doc.slice(node.from, node.to).trim()}`,
                    actions: [{
                        name: "Insert space",
                        apply(view) {
                            view.dispatch({ changes: { from: prevSibling.to - 1, insert: " " } });
                        }
                    }]
                }];
            }
        }
    }

    if (node.type.isError) {
        const parent = node.node.parent!;
        const unclosedCheckResult = checkUnclosedExpression(node, parent);
        if (unclosedCheckResult) {
            if (parent.name === "AbbrevInvalid" || parent.name === "Abbrev") {
                // The parser currently recognizes an unclosed Diacritic as Abbrev
                const textStart = parent.from + 1;
                const text = doc.slice(textStart, textStart + 2);
                // Check if this is actually a Diacritic
                const diacritMatch = text.match(diacritPattern);
                if (diacritMatch) {
                    const diacritEnd = parent.from + 1 + diacritMatch[0].length;

                    return [{
                        from: parent.from,
                        to: diacritEnd,
                        severity: "error",
                        message: "Unclosed Diacritical",
                        actions: [{
                            name: "Insert ')'",
                            apply(view) {
                                view.dispatch({ changes: { from: diacritEnd, insert: ")" } });
                            }
                        }]
                    }];
                }
            }

            return unclosedCheckResult;
        }

        if (parent?.name === "NumberSpecial") {
            const nextSibling = node.node.nextSibling;
            if (nextSibling?.name === "#>") {
                const prevSibling = node.node.prevSibling;
                if (prevSibling) {
                    const numberSpecialText = doc.slice(parent.from, parent.to);
                    const eqIndex = numberSpecialText.indexOf("=");
                    if (eqIndex === -1) {
                        return [{
                            from: prevSibling.from,
                            to: prevSibling.to,
                            severity: "error",
                            message: "Number value missing, expected '='.",
                            actions: [{
                                name: "Insert '='",
                                apply(view) {
                                    view.dispatch({ changes: { from: prevSibling.to, insert: "=" } });
                                }
                            }]
                        }];
                    } else {
                        const closingDelim = parent.lastChild;
                        if (closingDelim) {
                            const valueText = doc.slice(eqIndex + 1, closingDelim.from);
                            return [{
                                from: prevSibling.from,
                                to: prevSibling.to,
                                severity: "error",
                                message: `Invalid number value: ${valueText}. Expected a numeric value.`
                            }];
                        }
                    }
                }

            }
        } else if (parent.name === "Handshift") {
            if (parent.node.lastChild?.name !== "RequiredSpace") {
                return [{
                    from: parent.from,
                    to: parent.to,
                    severity: "error",
                    message: `Missing required trailing space after Handshift ${doc.slice(parent.from, parent.to).trim()}`,
                    actions: [{
                        name: "Insert space",
                        apply(view) {
                            view.dispatch({ changes: { from: parent.to, insert: " " } });
                        }
                    }]
                }];
            }
        } else if (parent.name === "Figure") {
            if (parent.node.lastChild?.name !== "RequiredSpace") {
                return [{
                    from: parent.from,
                    to: parent.to,
                    severity: "error",
                    message: `Missing required trailing space after Figure ${doc.slice(parent.from, parent.to).trim()}`,
                    actions: [{
                        name: "Insert space",
                        apply(view) {
                            view.dispatch({ changes: { from: parent.to, insert: " " } });
                        }
                    }]
                }];
            }
        } else if (parent.name === "Foreign") {
            if (parent.node.lastChild?.name !== "RequiredSpace") {
                const nodeValue = doc.slice(parent.from, parent.to).trim();
                const incompleteForeignEnd = nodeValue.match(/(\|~)[^a-zA-Z-]/);
                const foreignEndMatchIndex = incompleteForeignEnd?.index; // Start index of the match
                if (foreignEndMatchIndex) {
                    const precedingChars = getPrecedingContext(nodeValue, foreignEndMatchIndex);
                    const matchWithContext = `${precedingChars}${incompleteForeignEnd[1]}`;
                    const incompleteForeignEndStart = parent.from + foreignEndMatchIndex;
                    const requiredLangPosition = incompleteForeignEndStart + incompleteForeignEnd[1].length;
                    const spaceIfRequired = doc.at(requiredLangPosition) === " " ? "" : " ";
                    return [{
                        from: incompleteForeignEndStart,
                        to: requiredLangPosition,
                        severity: "error",
                        message: `Missing alphanumeric language ID after Foreign Text ${matchWithContext}`,
                        actions: [{
                            name: `Insert 'la${spaceIfRequired}'`,
                            apply(view) {
                                view.dispatch({ changes: { from: requiredLangPosition, insert: `la${spaceIfRequired}` } });
                            }
                        }, {
                            name: `Insert 'grc${spaceIfRequired}'`,
                            apply(view) {
                                view.dispatch({ changes: { from: requiredLangPosition, insert: `grc${spaceIfRequired}` } });
                            }
                        }]
                    }];
                } else {
                    const foreignEnd = parent.node.lastChild?.prevSibling;
                    if (foreignEnd) {
                        const precedingChars = getPrecedingContext(doc, foreignEnd.from);
                        const foreignEndValue = doc.slice(foreignEnd.from, foreignEnd.to).trim();
                        return [{
                            from: foreignEnd.from,
                            to: foreignEnd.to,
                            severity: "error",
                            message: `Missing required trailing space after foreign language id in ${precedingChars}${foreignEndValue}`,
                            actions: [{
                                name: "Insert space",
                                apply(view) {
                                    view.dispatch({ changes: { from: foreignEnd.to, insert: " " } });
                                }
                            }]
                        }];
                    }
                }
            }
        } else if (parent.name === "CertLow") {
            if (parent.node.type.is("SpaceRequired")) {
                const ancestorNode = parent.parent?.node;
                if (ancestorNode) {
                    const ancestorText = doc.slice(ancestorNode.from, ancestorNode.to).trim();
                    return [{
                        from: parent.from,
                        to: parent.to,
                        severity: "error",
                        message: `Missing required trailing space after low certainty marker (?) in ${ancestorText}`,
                        actions: [{
                            name: "Insert space",
                            apply(view) {
                                view.dispatch({ changes: { from: parent.to, insert: " " } });
                            }
                        }]
                    }];
                }

            }
        }
    } else if (node.type.name === "AbbrevInvalid") {
        // Check if this is actually a Diacritical with missing leading space
        const textStart = node.from + 1;
        const text = doc.slice(textStart, textStart + 2);
        const diacritMatch = text.match(diacritPattern);
        if (diacritMatch) {
            const prevSibling = node.node.prevSibling;
            if (prevSibling && ["Text", "Illegible", "Unclear", "Gap"].includes(prevSibling.name)) {
                let validDiacritPrefixPos: { from: number, to: number } | null  = null;
                if (prevSibling.name === "Text") {
                    const prevSiblingText = doc.slice(prevSibling.from, prevSibling.to);
                    const prevSiblingMatch = prevSiblingText.match(/[\p{L}\p{N} ]$/u);
                    if (prevSiblingMatch) {
                        const from = prevSibling.from + prevSiblingMatch.index!;
                        validDiacritPrefixPos = { from, to: from + prevSiblingMatch[0].length };
                    }
                } else {
                    validDiacritPrefixPos = node;
                }

                if (validDiacritPrefixPos) {
                    return [{
                        from: validDiacritPrefixPos.from,
                        to: validDiacritPrefixPos.to,
                        severity: "error",
                        message: "Missing required leading space before Diacritical",
                        actions: [{
                            name: "Insert space",
                            apply(view) {
                                view.dispatch({ changes: { from: validDiacritPrefixPos.from, insert: " " } });
                            }
                        }]
                    }];
                }
            }
        }


        // Only report error if the Abbreviation has been closed
        if (node.node.lastChild?.type.name !== ")") return;

        const inner = node.node.getChild("AbbrevInner");
        if (!inner) {
            const suppliedLost = findDescendant(node, "SuppliedLost");

            if (suppliedLost) {
                return [{
                    from: suppliedLost.from,
                    to: suppliedLost.to,
                    severity: "error",
                    message: "A single supplied (lost) inside an abbreviation can only have pure character content inside the square brackets, e.g.: (a[bc]), or needs an inner expansion such as (ā[ε̄(f)]d)."
                }];
            }

            const suppliedParallel = findDescendant(node, "SuppliedParallel");
            if (suppliedParallel) {
                return [{
                    from: suppliedParallel.from,
                    to: suppliedParallel.to,
                    severity: "error",
                    message: "A single supplied (parallel) inside an abbreviation needs an inner expansion, e.g.: (exp|_an(si)_|on)."
                }];
            }

            return [{
                from: node.from,
                to: node.to,
                severity: "error",
                message: `Incomplete abbreviation. 
Abbreviation needs at least one 
- inner expansion: (exp(ansi)on)
- supplied (lost): (exp[ansi]on) or (exp[an(si)]on)
- supplied (parallel): (exp|_an(si)_|on)`
            }];

        }
    }
};

export const leidenPlusLinter = leidenLinterExtension(leidenPlusNodeLinter);
export const lintLeidenPlus = (doc: string, syntaxTree: Tree): Diagnostic[] =>
    leidenBaseLinter(doc, syntaxTree.cursor(), leidenPlusNodeLinter);