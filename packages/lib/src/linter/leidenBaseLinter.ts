import {Diagnostic, linter} from "@codemirror/lint";
import {syntaxTree} from "@codemirror/language";
import {SyntaxNodeRef} from "@lezer/common";

export type NodeLinter = (node: SyntaxNodeRef) => Diagnostic[] | undefined | null | void;

export const leidenBaseLinter = (nodeLinter?: NodeLinter) =>
    linter(view => {
        const diagnostics: Diagnostic[] = []
        let skip = false
        syntaxTree(view.state).cursor().iterate(node => {
            if (skip) {
                return
            }
            const nodeDiagnostics: Diagnostic[] = []

            if (nodeLinter) {
                const result = nodeLinter(node)
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
    })