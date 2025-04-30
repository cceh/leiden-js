import { findDescendant, leidenBaseLinter, leidenLinterExtension, NodeLinter } from "@leiden-js/common/linter";
import { NodeProp, SyntaxNodeRef, TreeCursor } from "@lezer/common";
import { Diagnostic } from "@codemirror/lint";
import { wrappingRules } from "@leiden-js/codemirror-lang-leiden-plus";

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

const nodeDescription = (node: SyntaxNodeRef): string => {
    return nodeDescriptions[node.name] || node.type.name;
};

const unclosedExpression = (node: SyntaxNodeRef, errPos: number, close: string): Diagnostic => {
    return ({
        from: node.from,
        to: node.to,
        severity: "error",
        message: `Unclosed ${nodeDescription(node)}.`,
        actions: [{
            name: `Insert '${close}'`,
            apply(view) {
                view.dispatch({ changes: { from: errPos, insert: close } });
            }
        }]
    });
};

export const leidenPlusNodeLinter: NodeLinter = (doc, node) => {
    if (node.type.isError) {
        const parent = node.node.parent;

        if (!node.node.nextSibling) { // error node is last sibling
            if (parent && wrappingRules.includes(parent.name)) {
                const errorPos = node.node.from;
                const closedBy = parent?.firstChild?.type.prop(NodeProp.closedBy);
                if (parent && closedBy) {
                    return [unclosedExpression(parent, errorPos, closedBy[0])];
                }
            }
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
        }
    }


    if (node.type.name === "AbbrevInvalid") {
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
                    message: `A single supplied (lost) inside an abbreviation can only have pure character content inside 
                    the square brackets, e.g.: (a[bc]), or an inner expansion such as (ā[ε̄(f)]d).`
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
export const lintLeidenPlus = (doc: string, rootCursor: TreeCursor) =>
    leidenBaseLinter(doc, rootCursor, leidenPlusNodeLinter);