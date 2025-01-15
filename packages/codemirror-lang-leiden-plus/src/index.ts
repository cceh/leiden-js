import {LanguageSupport, LRLanguage, syntaxHighlighting} from "@codemirror/language";
import { Extension } from "@codemirror/state"
import {parser} from "@leiden-plus/parser-leiden-plus";
import {leidenPlusHighlighting} from "./syntaxHighlight.js";
import {leidenPlusLinterExtension} from "@leiden-plus/linter-leiden-plus";
import {highlightActiveNode, leidenHighlightStyle} from "@leiden-plus/lib/language";
import {
    completeFromList,
    CompletionContext,
    CompletionResult,
    ifNotIn,
    snippetCompletion
} from "@codemirror/autocomplete";
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
        }
    }
})

export function leidenPlus(): Extension[] {
    return [
        new LanguageSupport(leidenPlusLanguage),
        syntaxHighlighting(leidenHighlightStyle),
        leidenPlusLinterExtension,
        highlightActiveNode
    ]
}

export { snippets } from "./snippets.js"