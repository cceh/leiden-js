import {
    CodemirrorLintConfig,
    leidenBaseLinter,
    leidenLinterExtension,
    NodeLinter,
    unclosedExpressionCheck
} from "@leiden-js/common/linter";
import { Tree } from "@lezer/common";
import { wrappingRules } from "@leiden-js/codemirror-lang-leiden-trans";
import { Diagnostic } from "@codemirror/lint";

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

        const unclosedCheckResult = checkUnclosedExpression(node, parent);
        if (unclosedCheckResult) {
            return unclosedCheckResult.map(d => ({ ...d, code: "UNCLOSED_EXPRESSION" }));
        }
    }
};

export const leidenTransLinter = (config?: CodemirrorLintConfig) => leidenLinterExtension(leidenTransNodeLinter, config);
export const lintLeidenTrans = (doc: string, syntaxTree: Tree): Diagnostic[] =>
    leidenBaseLinter(doc, syntaxTree.cursor(), leidenTransNodeLinter);