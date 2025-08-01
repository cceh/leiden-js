import { NodeProp, SyntaxNode, SyntaxNodeRef } from "@lezer/common";
import { Diagnostic } from "@codemirror/lint";
import { nodeDescription } from "./utils.js";

export const unclosedExpressionError = (nodeDescriptions: Record<string, string>) =>
    (node: SyntaxNodeRef, errPos: number, close: string): Diagnostic => {
        return ({
            from: node.from,
            to: node.to,
            severity: "error",
            message: `Unclosed ${nodeDescription(nodeDescriptions, node)}.`,
            actions: [{
                name: `Insert '${close}'`,
                apply(view) {
                    view.dispatch({ changes: { from: errPos, insert: close } });
                }
            }]
        });
    };
export const unclosedExpressionCheck = (wrappingRules: string[], nodeDescriptions: Record<string, string>) => {
    const unclosedExpression = unclosedExpressionError(nodeDescriptions);
    return (node: SyntaxNodeRef, parent: SyntaxNode | null) => {
        if (!node.node.nextSibling) { // error node is last sibling
            if (parent && wrappingRules.includes(parent.name)) {
                const errorPos = node.node.from;
                const closedBy = parent?.firstChild?.type.prop(NodeProp.closedBy);

                if (parent && closedBy) {
                    // search for the closing delimiter between the opening and the error node
                    let hasClosingDelimiter = false;
                    let currentChild = parent.firstChild?.nextSibling;
                    
                    while (currentChild && currentChild !== node.node) {
                        if (closedBy.includes(currentChild.name)) {
                            hasClosingDelimiter = true;
                            break;
                        }
                        currentChild = currentChild.nextSibling;
                    }

                    if (!hasClosingDelimiter) {
                        return [unclosedExpression(parent, errorPos, closedBy[0])];
                    }
                }
            }
        }
    };
};