import { leidenBaseLinter, leidenLinterExtension, NodeLinter, unclosedExpressionCheck } from "@leiden-js/common/linter";
import { TreeCursor } from "@lezer/common";
import { wrappingRules } from "@leiden-js/codemirror-lang-leiden-trans";

const nodeDescriptions: Record<string, string> = {
    P: "Paragraph",
    Div: "Division",
    Foreign: "Foreign Text",
    App: "Apparatus Entry"
};

const checkUnclosedExpression = unclosedExpressionCheck(wrappingRules, nodeDescriptions);

export const leidenTransNodeLinter: NodeLinter = (doc, node) => {
    if (node.type.isError) {
        const parent = node.node.parent;

        return checkUnclosedExpression(node, parent);
    }
};

export const leidenTransLinter = leidenLinterExtension(leidenTransNodeLinter);
export const lintLeidenTrans = (doc: string, rootCursor: TreeCursor) =>
    leidenBaseLinter(doc, rootCursor, leidenTransNodeLinter);