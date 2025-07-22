import { SyntaxNode } from "@lezer/common";
import { LeidenDiagnostic } from "@leiden-js/common/linter";

// Error codes for CertLow linting
export const CERT_LOW_ERROR_CODES = {
    MISSING_TRAILING_SPACE: "CERT_LOW_MISSING_TRAILING_SPACE"
} as const;

export function lintCertLow(node: SyntaxNode, doc: string): LeidenDiagnostic[] | undefined {
    if (node.type.is("SpaceRequired")) {
        const parentNode = node.parent?.node;
        if (parentNode) {
            const ancestorText = doc.slice(parentNode.from, parentNode.to).trim();
            return [{
                from: node.from,
                to: node.to,
                severity: "error",
                message: `Missing required trailing space after low certainty marker (?) in ${ancestorText}`,
                code: CERT_LOW_ERROR_CODES.MISSING_TRAILING_SPACE,
                actions: [{
                    name: "Insert space",
                    apply(view) {
                        view.dispatch({ changes: { from: node.to, insert: " " } });
                    }
                }]
            }];
        }
    }
}