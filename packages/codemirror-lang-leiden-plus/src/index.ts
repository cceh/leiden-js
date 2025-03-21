import {
    bracketMatchingHandle, foldInside, foldNodeProp,
    HighlightStyle, indentNodeProp,
    LanguageSupport,
    LRLanguage,
    syntaxHighlighting
} from "@codemirror/language";
import {Extension} from "@codemirror/state"
import {parser} from "@leiden-plus/parser-leiden-plus";
import {leidenPlusHighlighting} from "./syntaxHighlight.js";
import {leidenPlusLinterExtension} from "@leiden-plus/linter-leiden-plus";
import {highlightActiveNode, leidenHighlightStyle, blockIndent} from "@leiden-plus/lib/language";
import {completeFromList, CompletionContext, snippetCompletion} from "@codemirror/autocomplete";
import {snippets} from "./snippets.js";

export type TopNode = "Document" | "InlineContent" | "SingleDiv" | "SingleAb" | "BlockContent"

export const leidenPlusLanguage = (topNode: TopNode = "Document") => LRLanguage.define({
    parser: parser.configure({
        top: topNode,
        props: [
            leidenPlusHighlighting,
            indentNodeProp.add({
                "Document SingleTranslation SingleP": blockIndent(),
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
            )(context)
        },
        matchBrackets: bracketMatchingHandle,
        languageData: {
            indentOnInput: /^\s*=[TD]?>|^.$/
        }
    }
})

export interface LeidenPlusConfig {
    topNode: TopNode,
    highlightStyle: HighlightStyle,
}

const defaultConfig: LeidenPlusConfig = {
    topNode: "Document",
    highlightStyle: leidenHighlightStyle,
}

export function leidenPlus(options: Partial<LeidenPlusConfig> = {}): Extension[] {
    const config = {...defaultConfig, ...options}
    return [
        new LanguageSupport(leidenPlusLanguage(config.topNode)),
        syntaxHighlighting(config.highlightStyle),
        leidenPlusLinterExtension,
        highlightActiveNode
    ]
}

export { snippets } from "./snippets.js"
export {leidenHighlightStyle, leidenHighlightStyleDark} from "@leiden-plus/lib/language";
export { inlineContentAllowed, atomicRules } from "./syntax.js"
export {acceptsCertLow, hasCertLow, getCertLow, addCertLowAtCursorPosition, removeCertLow, findClosestCertLowAncestor, addCertLow} from './certLow.js'