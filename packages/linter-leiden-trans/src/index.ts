import { leidenBaseLinter, leidenLinterExtension, NodeLinter } from "@leiden-js/common/linter";
import { NodeProp, SyntaxNodeRef, TreeCursor } from "@lezer/common";
import { Diagnostic } from "@codemirror/lint";
import { wrappingRules } from "@leiden-js/codemirror-lang-leiden-trans";

const nodeDescriptions: Record<string, string> = {
    P: "Paragraph",
    Div: "Division",
    Foreign: "Foreign Text",
    App: "Apparatus Entry"
};

const nodeDescription = (node: SyntaxNodeRef): string => {
    return nodeDescriptions[node.type.id] || node.type.name;
};

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
            if (parent && wrappingRules.includes(parent.name)) {
                const errorPos = node.node.from;
                const closedBy = parent?.firstChild?.type.prop(NodeProp.closedBy);
                if (parent && closedBy) {
                    return [unclosedExpression(parent, errorPos, closedBy[0])];
                }
            }
        }
    }
};

export const leidenTransLinter = leidenLinterExtension(leidenTransNodeLinter);
export const lintLeidenTrans = (doc: string, rootCursor: TreeCursor) =>
    leidenBaseLinter(doc, rootCursor, leidenTransNodeLinter);