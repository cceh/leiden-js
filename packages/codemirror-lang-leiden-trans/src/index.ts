import {
    foldInside,
    foldNodeProp,
    HighlightStyle,
    indentNodeProp,
    LanguageSupport,
    LRLanguage,
    syntaxHighlighting
} from "@codemirror/language";
import { parser } from "@leiden-plus/parser-leiden-trans";
import { leidenTransLinterExtension } from "@leiden-plus/linter-leiden-trans";
import {
    blockIndent,
    highlightActiveNode,
    leidenHighlightStyle as leidenTransHighlightStyle,
    leidenHighlightStyleDark as leidenTransHighlightStyleDark
} from "@leiden-plus/lib/language";
import { leidenTranslationHighlighting } from "./syntaxHighlight.js";

export {
    leidenTranslationHighlighting,
    leidenTransHighlightStyle,
    leidenTransHighlightStyleDark,
};

export type TopNode = "Document" | "SingleTranslation" | "SingleDiv" | "SingleP" | "BlockContent" | "InlineContent";

export const leidenTranslationLanguage = (topNode: TopNode = "Document") => LRLanguage.define({
    parser: parser.configure({
        top: topNode ?? "Document",
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
});

export interface LeidenTransConfig {
    topNode: TopNode
    highlightStyle: HighlightStyle
}

const defaultConfig: LeidenTransConfig = {
    topNode: "Document",
    highlightStyle: leidenTransHighlightStyle,
};

export function leidenTranslation(options: Partial<LeidenTransConfig> = {}) {
    const config = { ...defaultConfig, ...options };
    return [
        new LanguageSupport(leidenTranslationLanguage(config.topNode)),
        syntaxHighlighting(config.highlightStyle),
        leidenTransLinterExtension,
        highlightActiveNode
    ];
}

export { snippets } from "./snippets.js";
export { inlineContentAllowed, addTranslation, TranslationSnippetKey, canAddDivision, addDivision, DivisionSnippetKey } from "./syntax.js";