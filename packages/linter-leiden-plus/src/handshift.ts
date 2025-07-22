import { SyntaxNode } from "@lezer/common";
import { LeidenDiagnostic } from "@leiden-js/common/linter";

export const HANDSHIFT_ERROR_CODES = {
    MISSING_TRAILING_SPACE: "HANDSHIFT_MISSING_TRAILING_SPACE"
} as const;

export function lintHandshift(node: SyntaxNode, doc: string): LeidenDiagnostic[] | undefined {
    if (node.lastChild?.name !== "RequiredSpace") {
        return [{
            from: node.from,
            to: node.to,
            severity: "error",
            message: `Missing required trailing space after Handshift ${doc.slice(node.from, node.to).trim()}`,
            code: HANDSHIFT_ERROR_CODES.MISSING_TRAILING_SPACE,
            actions: [{
                name: "Insert space",
                apply(view) {
                    view.dispatch({ changes: { from: node.to, insert: " " } });
                }
            }]
        }];
    }
}