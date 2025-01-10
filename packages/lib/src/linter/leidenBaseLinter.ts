import {Diagnostic, linter, LintSource} from "@codemirror/lint";
import {syntaxTree} from "@codemirror/language";
import {SyntaxNodeRef, TreeCursor} from "@lezer/common";

export type NodeLinter = (doc: string, node: SyntaxNodeRef) => Diagnostic[] | undefined | null | void;
export type LeidenLinter = (doc: string, rootCursor: TreeCursor, nodeLinter?: NodeLinter) => Diagnostic[]

export const leidenBaseLinter: LeidenLinter = (doc: string, rootCursor: TreeCursor, nodeLinter?: NodeLinter): Diagnostic[] => {
    const diagnostics: Diagnostic[] = []
    let skip = false
    rootCursor.iterate(node => {
        if (skip) {
            return
        }
        const nodeDiagnostics: Diagnostic[] = []

        if (nodeLinter) {
            const result = nodeLinter(doc, node)
            result && nodeDiagnostics.push(...result)
        }

        if (nodeDiagnostics.length === 0 && node.type.isError) {
            nodeDiagnostics.push({
                from: node.from,
                to: node.to,
                severity: "error",
                message: "Syntax error",
            })
        }

        diagnostics.push(...nodeDiagnostics)
        if (diagnostics.length > 0) {
            skip = true
            return false
        }
    })
    return diagnostics
}

export const leidenLinterExtension = (nodeLinter?: NodeLinter) =>
    linter(view => leidenBaseLinter(view.state.doc.toString(), syntaxTree(view.state).cursor(), nodeLinter))