import { wrappingRules } from "@leiden-js/codemirror-lang-leiden-plus";
import {
    leidenBaseLinter,
    leidenLinterExtension,
    NodeLinter,
    unclosedExpressionCheck,
    LeidenDiagnostic
} from "@leiden-js/common/linter";
import { Tree } from "@lezer/common";
import { Diagnostic } from "@codemirror/lint";
import { lintForeign } from "./foreign.js";
import { lintNumberSpecial, lintNumberSpecialNonParserErrors } from "./numberSpecial.js";
import { lintAbbrev } from "./abbrev.js";
import { lintCertLow } from "./certLow.js";
import { lintHandshift } from "./handshift.js";
import { lintFigure } from "./figure.js";

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

const DIACRITICAL_ERROR_CODES = {
    MISSING_LEADING_SPACE: "DIACRITICAL_MISSING_LEADING_SPACE",
    UNCLOSED: "DIACRITICAL_UNCLOSED"
} as const;


export const leidenPlusNodeLinter: NodeLinter = (doc, node) => {
    if (node.name === "NumberSpecial") {
        const result = lintNumberSpecialNonParserErrors(node.node, doc);
        if (result) {
            return result;
        }
    } else if (node.name === "AbbrevInvalid") {
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
                        code: DIACRITICAL_ERROR_CODES.MISSING_LEADING_SPACE,
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

        return lintAbbrev(node.node);
    }


    if (node.type.isError) {
        const errorNode = node.node;
        const errorParent = errorNode.parent!;

        // First: General check for unclosed expressions
        const unclosedCheckResult = checkUnclosedExpression(errorNode, errorParent);
        if (unclosedCheckResult) {
            if (errorParent.name === "AbbrevInvalid" || errorParent.name === "Abbrev") {
                // The parser currently recognizes an unclosed Diacritic as Abbrev
                const textStart = errorParent.from + 1;
                const text = doc.slice(textStart, textStart + 2);
                // Check if this is actually a Diacritic
                const diacritMatch = text.match(diacritPattern);
                if (diacritMatch) {
                    const diacritEnd = errorParent.from + 1 + diacritMatch[0].length;

                    return [{
                        from: errorParent.from,
                        to: diacritEnd,
                        severity: "error",
                        message: "Unclosed Diacritical",
                        code: DIACRITICAL_ERROR_CODES.UNCLOSED,
                        actions: [{
                            name: "Insert ')'",
                            apply(view) {
                                view.dispatch({ changes: { from: diacritEnd, insert: ")" } });
                            }
                        }]
                    }];
                }
            }

            // Convert Diagnostic[] to LeidenDiagnostic[] for compatibility
            return unclosedCheckResult.map(d => ({ ...d, code: "UNCLOSED_EXPRESSION" }));
        }

        if (errorNode.parent?.name === "NumberSpecial") {
            return lintNumberSpecial(errorParent, doc, errorNode);
        } else if (errorNode.matchContext(["NumberSpecial", "Text", "Number"])) {
            return lintNumberSpecial(errorParent.parent!.parent!, doc, errorNode);
        }

        // Then: Node specific checks
        switch (errorParent.name) {
            case "Handshift":
                return lintHandshift(errorParent, doc);
            case "Figure":
                return lintFigure(errorParent, doc);
            case "Foreign":
                return lintForeign(errorParent, doc);
            case "CertLow":
                return lintCertLow(errorParent, doc);
        }

    }
};

export const leidenPlusLinter = leidenLinterExtension(leidenPlusNodeLinter);
export const lintLeidenPlus = (doc: string, syntaxTree: Tree): LeidenDiagnostic[] =>
    leidenBaseLinter(doc, syntaxTree.cursor(), leidenPlusNodeLinter);