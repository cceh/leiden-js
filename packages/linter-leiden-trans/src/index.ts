import { leidenBaseLinter, leidenLinterExtension, NodeLinter } from "@leiden-js/lib/linter";
import { NodeProp, SyntaxNodeRef, TreeCursor } from "@lezer/common";
import { Diagnostic } from "@codemirror/lint";

const nodeDescriptions: Record<number, string> = {

};

const nodeDescription = (node: SyntaxNodeRef): string => {
    return nodeDescriptions[node.type.id] || node.type.name;
};

// TODO: Deletion, Ab, Div
const wrappingRules: number[] = [

];

const unclosedExpression = (node: SyntaxNodeRef, errPos: number, close: string): Diagnostic => {
    return ({
        from: node.from,
        to: node.to,
        severity: "error",
        message: `Unclosed ${nodeDescription(node)}.`,
        actions: [{
            name: `Insert '${close}'`,
            apply(view) {
                view.dispatch({ changes: { from: errPos, insert: close } });
            }
        }]
    });
};

export const leidenTransNodeLinter: NodeLinter = (doc, node) => {
    if (node.type.isError) {
        const parent = node.node.parent;

        if (!node.node.nextSibling) { // error node is last sibling
            if (parent && wrappingRules.includes(parent.type.id)) {
                const errorPos = node.node.from;
                const closedBy = parent?.firstChild?.type.prop(NodeProp.closedBy);
                if (parent && closedBy) {
                    return [unclosedExpression(parent, errorPos, closedBy[0])];
                }
            }
        }
    }
};

export const leidenTransLinterExtension = leidenLinterExtension(leidenTransNodeLinter);
export const lintLeidenTrans = (doc: string, rootCursor: TreeCursor) =>
    leidenBaseLinter(doc, rootCursor, leidenTransNodeLinter);