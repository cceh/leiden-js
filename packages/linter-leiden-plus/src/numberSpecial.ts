import { findDescendant, LeidenDiagnostic } from "@leiden-js/common/linter";
import { SyntaxNode } from "@lezer/common";

// Error codes for NumberSpecial linting
export const NUMBER_SPECIAL_ERROR_CODES = {
    MISSING_SPACE_BEFORE_TICK: "NUMBER_MISSING_SPACE_BEFORE_TICK",
    MISSING_EQUALS: "NUMBER_MISSING_EQUALS", 
    INVALID_VALUE: "NUMBER_INVALID_VALUE"
} as const;

export function lintNumberSpecialNonParserErrors(node: SyntaxNode, doc: string): LeidenDiagnostic[] | undefined {
    const numberValue = findDescendant(node, "NumberSpecialValue");
    const prevSibling = numberValue?.node?.prevSibling;
    if (prevSibling?.name === "Text") {
        const prevChar = doc.slice(prevSibling.to - 1, prevSibling.to);
        if (prevChar === "'") {
            return [{
                from: prevSibling.from,
                to: prevSibling.to,
                severity: "error",
                message: `Missing required space before tick in: ${doc.slice(node.from, node.to).trim()}`,
                code: NUMBER_SPECIAL_ERROR_CODES.MISSING_SPACE_BEFORE_TICK,
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

export function lintNumberSpecial(node: SyntaxNode, doc: string, errorNode: SyntaxNode): LeidenDiagnostic[] | undefined {
    const closingDelim = errorNode.nextSibling?.name === "#>"
        ? errorNode.nextSibling
        : errorNode.firstChild?.name === "#>" ? errorNode.firstChild : null;

    if (closingDelim) {
        // check no = found
        const numberSpecialText = doc.slice(node.from, closingDelim.to);
        const eqIndex = numberSpecialText.indexOf("=");
        if (eqIndex === -1) {
            return [{
                from: closingDelim.from,
                to: closingDelim.to,
                severity: "error",
                message: `Number value missing, expected '=' after ${doc.slice(node.from, closingDelim.from).slice(0, 10)}.`,
                code: NUMBER_SPECIAL_ERROR_CODES.MISSING_EQUALS,
                actions: [{
                    name: "Insert '='",
                    apply(view) {
                        view.dispatch({ changes: { from: closingDelim.from, insert: "=" } });
                    }
                }]
            }];
        } else {
            // check value is not numeric
            const eqPos = node.from + eqIndex;
            if (closingDelim) {
                const valueText = doc.slice(eqPos + 1, closingDelim.from);
                return [{
                    from: eqPos + 1,
                    to: closingDelim.from,
                    severity: "error",
                    message: `Invalid number value: ${valueText.slice(0, 10)}. Expected a numeric value (1), a fraction (1/2), or "frac".`,
                    code: NUMBER_SPECIAL_ERROR_CODES.INVALID_VALUE
                }];
            }
        }    }
}