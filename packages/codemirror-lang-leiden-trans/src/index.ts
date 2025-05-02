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
    leidenHighlightStyle,
    leidenHighlightStyleDark,
    LeidenLanguageConfig
} from "@leiden-js/common/language";
import { leidenTranslationHighlighting } from "./syntaxHighlight.js";

export type LeidenTransTopNode =
    "Document"
    | "SingleTranslation"
    | "SingleDiv"
    | "SingleP"
    | "BlockContent"
    | "InlineContent";

export type LeidenTransLanguageConfig = LeidenLanguageConfig<LeidenTransTopNode>;

export const leidenTranslationLanguage = (config?: LeidenTransLanguageConfig) =>
    new LanguageSupport(LRLanguage.define({
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
        ...(!config || config.leidenHighlightStyle !== "none" ? [
            syntaxHighlighting(config?.leidenHighlightStyle === "dark" ? leidenHighlightStyleDark : leidenHighlightStyle),
        ] : []),

    ]);

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