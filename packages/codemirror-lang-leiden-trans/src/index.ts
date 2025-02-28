import {
    continuedIndent,
    delimitedIndent, foldInside, foldNodeProp,
    indentNodeProp,
    LanguageSupport,
    LRLanguage,
    syntaxHighlighting,
    TreeIndentContext
} from "@codemirror/language";
import {parser} from "@leiden-plus/parser-leiden-trans";
import {leidenTransLinterExtension} from "@leiden-plus/linter-leiden-trans";
import {
    highlightActiveNode,
    leidenHighlightStyle as leidenTransHighlightStyle,
    leidenHighlightStyleDark as leidenTransHighlightStyleDark,
} from "@leiden-plus/lib/language";
import { leidenTranslationHighlighting } from "./syntaxHighlight.js";

export {
    leidenTranslationHighlighting,
    leidenTransHighlightStyle,
    leidenTransHighlightStyleDark,
}

export const leidenTranslationLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [
            leidenTranslationHighlighting,
            indentNodeProp.add({
                // "P": continuedIndent({units: 2})
                "Document": continuedIndent(),
                Translation(context) {
                    let closed = /^\s*=T>/.test(context.textAfter)
                    return context.lineIndent(context.node.from) + (closed ? 0 : context.unit)
                },
                P(context) {
                    let closed = /^\s*=>/.test(context.textAfter)
                    return context.lineIndent(context.node.from) + (closed ? 0 : context.unit)
                }
            }),
            foldNodeProp.add({
                "Translation Div P": foldInside
            })
        ],
    })
})

export function leidenTranslation() {
    return [
        new LanguageSupport(leidenTranslationLanguage),
        syntaxHighlighting(leidenTransHighlightStyle),
        leidenTransLinterExtension,
        highlightActiveNode
    ]
}

export {snippets} from './snippets.js'
export {inlineContentAllowed, addTranslation, TranslationSnippetKey, canAddDivision, addDivision, DivisionSnippetKey} from './syntax.js'