import { SyntaxNode } from "@lezer/common";
import { getPrecedingContext, LeidenDiagnostic } from "@leiden-js/common/linter";

// Error codes for Foreign linting
export const FOREIGN_ERROR_CODES = {
    MISSING_LANGUAGE_ID: "FOREIGN_MISSING_LANGUAGE_ID",
    MISSING_TRAILING_SPACE: "FOREIGN_MISSING_TRAILING_SPACE"
} as const;

export function lintForeign(parent: SyntaxNode, doc: string): LeidenDiagnostic[] | undefined {
    if (parent.node.lastChild?.name !== "RequiredSpace") {
        const possibleForeignEnd = parent.node.lastChild?.prevSibling;
        const foreignEnd = possibleForeignEnd?.name === "|~" ? possibleForeignEnd : null;
        if (foreignEnd) {
            const precedingChars = getPrecedingContext(doc, foreignEnd.from);
            const matchWithContext = `${precedingChars}${doc.slice(foreignEnd.from, foreignEnd.to)}`;
            const spaceIfRequired = doc[foreignEnd.to] === " " ? "" : " ";
            return [{
                from: foreignEnd.from,
                to: foreignEnd.to,
                severity: "error",
                message: `Missing alphanumeric language ID after Foreign Text ${matchWithContext}`,
                code: FOREIGN_ERROR_CODES.MISSING_LANGUAGE_ID,
                actions: [{
                    name: `Insert 'la${spaceIfRequired}'`,
                    apply(view) {
                        view.dispatch({ changes: { from: foreignEnd.to, insert: `la${spaceIfRequired}` } });
                    }
                }, {
                    name: `Insert 'grc${spaceIfRequired}'`,
                    apply(view) {
                        view.dispatch({ changes: { from: foreignEnd.to, insert: `grc${spaceIfRequired}` } });
                    }
                }]
            }];
        } else {
            const foreignEnd = parent.node.lastChild?.prevSibling;
            if (foreignEnd) {
                const precedingChars = getPrecedingContext(doc, foreignEnd.from);
                const foreignEndValue = doc.slice(foreignEnd.from, foreignEnd.to).trim();
                return [{
                    from: foreignEnd.from,
                    to: foreignEnd.to,
                    severity: "error",
                    message: `Missing required trailing space after foreign language id in ${precedingChars}${foreignEndValue}`,
                    code: FOREIGN_ERROR_CODES.MISSING_TRAILING_SPACE,
                    actions: [{
                        name: "Insert space",
                        apply(view) {
                            view.dispatch({ changes: { from: foreignEnd.to, insert: " " } });
                        }
                    }]
                }];
            }
        }
    }
}