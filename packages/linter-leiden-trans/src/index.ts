import {findDescendant, leidenLinterExtension} from "@leiden-plus/lib/linter";
import {NodeProp, SyntaxNodeRef, TreeCursor} from "@lezer/common";
import {Diagnostic} from "@codemirror/lint";
import {
    Abbrev,
    AbbrevInnerEx,
    AbbrevInnerSuppliedLost,
    AbbrevInnerSuppliedLostEx,
    AbbrevInnerSuppliedParallel,
    AbbrevInvalid,
    AbbrevUnresolved,
    AlternateReading,
    EditorialCorrection,
    EditorialNote,
    Filler,
    Foreign,
    Gap,
    GapOmitted,
    Glyph,
    InsertionAbove,
    InsertionBelow,
    InsertionMargin,
    InsertionMarginSling,
    InsertionMarginUnderline,
    LineBreakSpecial,
    LineBreakSpecialWrapped,
    NumberSpecial,
    Orig,
    OrthoReg,
    Quotation,
    ScribalCorrection,
    SuppliedLost,
    SuppliedOmitted,
    SuppliedParallel,
    SuppliedParallelLost,
    SupralineSpan,
    SupralineUnderline,
    Surplus,
    TextSubscript,
    TextSuperscript,
    TextTall
} from "@leiden-plus/parser-leiden-plus";
import {NodeLinter, leidenBaseLinter} from "@leiden-plus/lib/linter";

const nodeDescriptions: Record<number, string> = {
    [Abbrev]: "Abbreviation",
    [AbbrevInvalid]: "Abbreviation",
    [AbbrevInnerEx]: "Abbreviation expansion",
    [SuppliedLost]: "Lost text",
    [Gap]: "Lost text",
    [SuppliedParallel]: "Supplied (parallel)",
    [LineBreakSpecial]: "Special line break",
    [LineBreakSpecialWrapped]: "Special line break (wrapped)",
    [SuppliedOmitted]: "Omitted text",
    [GapOmitted]: "Omitted text",
    [Surplus]: "Surplus text"
}

const nodeDescription = (node: SyntaxNodeRef): string => {
    return nodeDescriptions[node.type.id] || node.type.name;
}

// TODO: Deletion, Ab, Div
const wrappingRules: number[] = [
    Abbrev, AbbrevInnerEx, AbbrevInnerSuppliedLost, AbbrevInnerSuppliedLostEx, AbbrevInnerSuppliedParallel, AbbrevInvalid,
    AbbrevUnresolved, AlternateReading, EditorialCorrection, EditorialNote, Filler, Foreign, Gap, GapOmitted, Glyph,
    InsertionAbove, InsertionBelow, InsertionMargin, InsertionMarginSling, InsertionMarginUnderline, NumberSpecial,
    Orig, OrthoReg, Quotation, ScribalCorrection, SuppliedLost, SuppliedOmitted, SuppliedParallel, SuppliedParallelLost,
    Surplus, SupralineSpan, SupralineUnderline, TextSubscript, TextSuperscript, TextTall
]

const unclosedExpression = (node: SyntaxNodeRef, errPos: number, close: string): Diagnostic => {
    return ({
        from: node.from,
        to: node.to,
        severity: "error",
        message: `Unclosed ${nodeDescription(node)}.`,
        actions: [{
            name: `Insert '${close}'`,
            apply(view) {
                view.dispatch({changes: {from: errPos, insert: close}})
            }
        }]
    });
}

export const leidenPlusNodeLinter: NodeLinter = (doc, node) => {
    if (node.type.isError) {
        const parent = node.node.parent;

        if (!node.node.nextSibling) { // error node is last sibling
            if (parent && wrappingRules.includes(parent.type.id)) {
                const errorPos = node.node.from;
                const closedBy = parent?.firstChild?.type.prop(NodeProp.closedBy)
                if (parent && closedBy) {
                    return [unclosedExpression(parent, errorPos, closedBy[0])]
                }
            }
        }

        if (parent?.type.id === NumberSpecial) {
            const nextSibling = node.node.nextSibling;
            if (nextSibling?.name === "#>") {
                const prevSibling = node.node.prevSibling;
                if (prevSibling) {
                    const numberSpecialText = doc.slice(parent.from, parent.to)
                    const eqIndex = numberSpecialText.indexOf("=")
                    if (eqIndex === -1) {
                        return [{
                            from: prevSibling.from,
                            to: prevSibling.to,
                            severity: "error",
                            message: `Number value missing, expected '='.`,
                            actions: [{
                                name: `Insert '='`,
                                apply(view) {
                                    view.dispatch({changes: {from: prevSibling.to, insert: "="}})
                                }
                            }]
                        }]
                    } else {
                        const closingDelim = parent.lastChild
                        if (closingDelim) {
                            const valueText = doc.slice(eqIndex + 1, closingDelim.from)
                            return [{
                                from: prevSibling.from,
                                to: prevSibling.to,
                                severity: "error",
                                message: `Invalid number value: ${valueText}. Expected a numeric value.`
                            }]
                        }
                    }
                }

            }
        }
    }


    if (node.type.name === "AbbrevInvalid") {
        // Only report error if the Abbreviation has been closed
        if (node.node.lastChild?.type.name !== ")") return

        const inner = node.node.getChild("AbbrevInner")
        if (!inner) {
            const name = "SuppliedLost";
            let suppliedLost = findDescendant(node, name);

            if (suppliedLost) {
                return [{
                    from: suppliedLost.from,
                    to: suppliedLost.to,
                    severity: "error",
                    message: `A single supplied (lost) inside an abbreviation can only have pure character content inside 
                    the square brackets, e.g.: (a[bc]), or an inner expansion such as (ā[ε̄(f)]d).`
                }]
            }

            let suppliedParallel = findDescendant(node, "SuppliedParallel");
            if (suppliedParallel) {
                return [{
                    from: suppliedParallel.from,
                    to: suppliedParallel.to,
                    severity: "error",
                    message: `A single supplied (parallel) inside an abbreviation needs an inner expansion, e.g.: (exp|_an(si)_|on).`
                }]
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
            }]

        }
    }
}

export const leidenPlusLinterExtension = leidenLinterExtension(leidenPlusNodeLinter)
export const lintLeidenPlus = (doc: string, rootCursor: TreeCursor) =>
    leidenBaseLinter(doc, rootCursor, leidenPlusNodeLinter)