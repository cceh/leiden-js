import {
    bracketMatchingHandle,
    defaultHighlightStyle,
    HighlightStyle,
    LanguageSupport,
    LRLanguage,
    syntaxHighlighting
} from "@codemirror/language";
import {Extension} from "@codemirror/state"
import {parser} from "@leiden-plus/parser-leiden-plus";
import {leidenPlusHighlighting} from "./syntaxHighlight.js";
import {leidenPlusLinterExtension} from "@leiden-plus/linter-leiden-plus";
import {highlightActiveNode} from "@leiden-plus/lib/language";
import {completeFromList, CompletionContext, snippetCompletion} from "@codemirror/autocomplete";
import {snippets} from "./snippets.js";


export const leidenPlusLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [leidenPlusHighlighting]
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
    }
})

export function leidenPlus(highlightStyle: HighlightStyle = defaultHighlightStyle): Extension[] {
    return [
        new LanguageSupport(leidenPlusLanguage),
        syntaxHighlighting(highlightStyle),
        leidenPlusLinterExtension,
        highlightActiveNode,
        // bracketMatching({brackets: ""})
    ]
}

export { snippets } from "./snippets.js"
export {leidenHighlightStyle, leidenHighlightStyleDark} from "@leiden-plus/lib/language";
export { inlineContentAllowed, atomicRules } from "./syntax.js"