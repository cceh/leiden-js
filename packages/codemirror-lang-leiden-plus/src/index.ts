import {LanguageSupport, LRLanguage} from "@codemirror/language";
import { Extension } from "@codemirror/state"
import {parser} from "@leiden-plus/parser-leiden-plus";
import {leidenPlusHighlighting} from "./highlight.js";
import {leidenPlusLinterExtension} from "@leiden-plus/linter-leiden-plus";
import {highlightActiveNode} from "@leiden-plus/lib/language";

export const leidenPlusLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [leidenPlusHighlighting],
    })
})

export function leidenPlus(): Extension[] {
    return [
        new LanguageSupport(leidenPlusLanguage),
        leidenPlusLinterExtension,
        highlightActiveNode
    ]
}