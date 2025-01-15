import {LanguageSupport, LRLanguage, syntaxHighlighting} from "@codemirror/language";
import {parser} from "@leiden-plus/parser-leiden-trans";
import {leidenTransLinterExtension} from "@leiden-plus/linter-leiden-trans";
import {
    highlightActiveNode,
    leidenHighlightStyle as leidenTransHighlightStyle,
    leidenHighlightStyleDark as leidenTransHighlightStyleDark,
    leidenHighlightStyleAccessible as leidenTransHighlightStyleAccessible,
    leidenHighlightStyleAccessibleDark as leidenTransHighlightStyleAccessibleDark,
} from "@leiden-plus/lib/language";
import { leidenTranslationHighlighting } from "./syntaxHighlight.js";

export {
    leidenTranslationHighlighting,
    leidenTransHighlightStyle,
    leidenTransHighlightStyleDark,
    leidenTransHighlightStyleAccessible,
    leidenTransHighlightStyleAccessibleDark
}

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