import {
    foldInside,
    foldNodeProp,
    indentNodeProp,
    LanguageSupport,
    LRLanguage,
    syntaxHighlighting,
} from "@codemirror/language";
import { parser } from "@leiden-js/parser-leiden-trans";
import {
    blockIndent,
    highlightActiveNode,
    LeidenConfig,
    leidenDefaultConfig,
    leidenHighlightStyle,
    leidenHighlightStyleDark
} from "@leiden-js/common/language";
import { leidenTranslationHighlighting } from "./syntaxHighlight.js";
import { leidenTransLinter } from "@leiden-js/linter-leiden-trans";

export type LeidenTransTopNode =
    "Document"
    | "SingleTranslation"
    | "SingleDiv"
    | "SingleP"
    | "BlockContent"
    | "InlineContent";
export type LeidenTransConfig = LeidenConfig<LeidenTransTopNode>;

export const leidenTranslationLanguage = (config?: LeidenTransConfig) => {
    const mergedConfig = { ...leidenDefaultConfig, ...config };
    return new LanguageSupport(LRLanguage.define({
        parser: parser.configure({
            top: config?.topNode ?? "Document",
            props: [
                leidenTranslationHighlighting,
                indentNodeProp.add({
                    "Document SingleTranslation SingleP": blockIndent(),
                    "P": blockIndent(/^\s*=>/),
                    "Translation": blockIndent(/^\s*=T>/),
                    "Div": blockIndent(/^\s*=D>/),
                    "topLevel": () => null
                }),
                foldNodeProp.add({
                    "Translation Div P": foldInside
                })
            ],
        }),
        languageData: {
            indentOnInput: /^\s*=[TD]?>|^.$/
        }
    }), [
        ...(mergedConfig?.lint ? [leidenTransLinter] : []),
        ...(mergedConfig?.highlightActiveNode ? [highlightActiveNode] : []),
        ...(mergedConfig.leidenHighlightStyle !== "none" ? [
            syntaxHighlighting(mergedConfig?.leidenHighlightStyle === "dark" ? leidenHighlightStyleDark : leidenHighlightStyle),
        ] : [])

    ]);
};

export { snippets } from "./snippets.js";
export {
    inlineContentAllowed,
    addTranslation,
    TranslationSnippetKey,
    canAddDivision,
    addDivision,
    DivisionSnippetKey,
    wrappingRules
} from "./syntax.js";