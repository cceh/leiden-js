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
    highlightActiveNode,
    LeidenConfig,
    leidenDefaultConfig,
    leidenHighlightStyle,
    leidenHighlightStyleDark
} from "@leiden-js/common/language";
import { completeFromList, CompletionContext, snippetCompletion } from "@codemirror/autocomplete";
import { snippets } from "./snippets.js";
import { leidenPlusLinter } from "@leiden-js/linter-leiden-plus";

export type LeidenPlusTopNode = "Document" | "InlineContent" | "SingleDiv" | "SingleAb" | "BlockContent";
export type LeidenPlusConfig = LeidenConfig<LeidenPlusTopNode>;

// A language provider for Leiden+ with highlighting, indentation and folding information.
export const leidenPlusLanguage = (config?: LeidenPlusConfig) => {
    const mergedConfig = { ...leidenDefaultConfig, ...config };
    return new LanguageSupport(LRLanguage.define({
        parser: parser.configure({
            top: mergedConfig?.topNode ?? "Document",
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
        ...(mergedConfig?.lint ? [leidenPlusLinter] : []),
        ...(mergedConfig?.highlightActiveNode ? [highlightActiveNode] : []),
        ...(mergedConfig.leidenHighlightStyle !== "none" ? [
            syntaxHighlighting(mergedConfig?.leidenHighlightStyle === "dark" ? leidenHighlightStyleDark : leidenHighlightStyle),
        ] : [])
    ]);
};

export { snippets } from "./snippets.js";
export { inlineContentAllowed, atomicRules, wrappingRules } from "./syntax.js";
export { acceptsCertLow, hasCertLow, getCertLow, addCertLowAtCursorPosition, removeCertLow, findClosestCertLowAncestor, addCertLow } from "./certLow.js";
