import {
    bracketMatchingHandle,
    foldInside,
    foldNodeProp,
    indentNodeProp,
    LanguageSupport,
    LRLanguage,
    syntaxHighlighting
} from "@codemirror/language";
import { parser } from "@leiden-js/parser-leiden-plus";
import { leidenPlusHighlighting } from "./syntaxHighlight.js";
import {
    blockIndent,
    leidenHighlightStyle,
    leidenHighlightStyleDark, LeidenLanguageConfig
} from "@leiden-js/common/language";
import { completeFromList, CompletionContext, snippetCompletion } from "@codemirror/autocomplete";
import { snippets } from "./snippets.js";

export type LeidenPlusTopNode = "Document" | "InlineContent" | "SingleDiv" | "SingleAb" | "BlockContent";
export type LeidenPlusLanguageConfig = LeidenLanguageConfig<LeidenPlusTopNode>;

// A language provider for Leiden+ with highlighting, indentation and folding information.
export const leidenPlusLanguage = (config?: LeidenPlusLanguageConfig) =>
    new LanguageSupport(LRLanguage.define({
        parser: parser.configure({
            top: config?.topNode ?? "Document",
            props: [
                leidenPlusHighlighting,
                indentNodeProp.add({
                    "Document DingleDiv SingleAb": blockIndent(),
                    "Div": blockIndent(/^\s*=D>/),
                    "Ab": blockIndent(/^\s*=>/),
                    "topLevel": () => null
                }),
                foldNodeProp.add({
                    "Div Ab Foreign OrthoReg AlternateReading ScribalCorrection SpellingCorrection EditorialCorrection EditorialNote": foldInside
                })
            ]
        }),
        languageData: {
            autocomplete: (context: CompletionContext) => {
                return completeFromList(
                    Object.values(snippets).map(
                        snippetDef =>
                            snippetCompletion(snippetDef.template, snippetDef.completion)
                    )
                )(context);
            },
            matchBrackets: bracketMatchingHandle,
            languageData: {
                indentOnInput: /^\s*=[TD]?>|^.$/
            }
        }
    }), [
        ...(!config || config?.leidenHighlightStyle !== "none" ? [
            syntaxHighlighting(config?.leidenHighlightStyle === "dark" ? leidenHighlightStyleDark : leidenHighlightStyle),
        ] : [])
    ]);

export { snippets } from "./snippets.js";
export { inlineContentAllowed, atomicRules, wrappingRules } from "./syntax.js";
export {
    acceptsCertLow,
    hasCertLow,
    getCertLow,
    addCertLowAtCursorPosition,
    removeCertLow,
    findClosestCertLowAncestor,
    addCertLow
} from "./certLow.js";
