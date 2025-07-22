import { SyntaxNode } from "@lezer/common";
import { LeidenDiagnostic } from "@leiden-js/common/linter";

// Error codes for Figure linting
export const FIGURE_ERROR_CODES = {
    MISSING_TRAILING_SPACE: "FIGURE_MISSING_TRAILING_SPACE"
} as const;

export function lintFigure(node: SyntaxNode, doc: string): LeidenDiagnostic[] | undefined {
    if (node.node.lastChild?.name !== "RequiredSpace") {
        return [{
            from: node.from,
            to: node.to,
            severity: "error",
            message: `Missing required trailing space after Figure ${doc.slice(node.from, node.to).trim()}`,
            code: FIGURE_ERROR_CODES.MISSING_TRAILING_SPACE,
            actions: [{
                name: "Insert space",
                apply(view) {
                    view.dispatch({ changes: { from: node.to, insert: " " } });
                }
            }]
        }];
    }
}