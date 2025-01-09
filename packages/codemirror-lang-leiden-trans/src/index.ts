import {LanguageSupport, LRLanguage} from "@codemirror/language";
import {parser} from "@leiden-plus/parser-leiden-trans";
import {leidenTranslationHighlighting} from "./highlight.js";

export const leidenTranslationLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [leidenTranslationHighlighting],
    })
})

export function leidenTranslation() {
    return new LanguageSupport(leidenTranslationLanguage)
}