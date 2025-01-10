import {LanguageSupport, LRLanguage, syntaxHighlighting} from "@codemirror/language";
import {parser} from "@leiden-plus/parser-leiden-trans";
import {leidenTransLinterExtension} from "@leiden-plus/linter-leiden-trans";
import {highlightActiveNode} from "@leiden-plus/lib/language";
import {leidenTranslationHighlighting, leidenTransHighlightStyle} from "./highlight.js";

export const leidenTranslationLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [leidenTranslationHighlighting],
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