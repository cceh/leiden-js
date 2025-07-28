import { linter } from "@codemirror/lint";
import { syntaxTree } from "@codemirror/language";
import { SyntaxNodeRef, TreeCursor } from "@lezer/common";
import { CodemirrorLintConfig, LeidenDiagnostic } from "./types.js";

export type NodeLinter = (doc: string, node: SyntaxNodeRef) => LeidenDiagnostic[] | undefined | null | void;
export type LeidenLinter = (doc: string, rootCursor: TreeCursor, nodeLinter?: NodeLinter) => LeidenDiagnostic[];

export const leidenBaseLinter: LeidenLinter = (doc: string, rootCursor: TreeCursor, nodeLinter?: NodeLinter): LeidenDiagnostic[] => {
    const diagnostics: LeidenDiagnostic[] = [];
    let skip = false;
    rootCursor.iterate(node => {
        if (skip) {
            return false;
        }
        const nodeDiagnostics: LeidenDiagnostic[] = [];

        if (nodeLinter) {
            const result = nodeLinter(doc, node);
            if (result) {
                nodeDiagnostics.push(...result);
            }
        }

        if (nodeDiagnostics.length === 0 && node.type.isError) {
            nodeDiagnostics.push({
                from: node.from,
                to: node.to,
                severity: "error",
                message: "Syntax error",
                code: "SYNTAX_ERROR"
            });
        }

        diagnostics.push(...nodeDiagnostics);
        if (diagnostics.length > 0) {
            skip = true;
            return false;
        }
    });
    return diagnostics;
};


export const leidenLinterExtension = (nodeLinter?: NodeLinter, config?: CodemirrorLintConfig) =>
    linter(view => leidenBaseLinter(view.state.doc.toString(), syntaxTree(view.state).cursor(), nodeLinter), config);