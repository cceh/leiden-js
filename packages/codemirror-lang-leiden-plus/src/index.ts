import {LanguageSupport, LRLanguage} from "@codemirror/language";
import { Extension } from "@codemirror/state"
import {parser} from "@leiden-plus/parser-leiden-plus";
import {leidenPlusHighlighting} from "./highlight.js";
import {leidenPlusLinter} from "./lint.js";

export const leidenPlusLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [leidenPlusHighlighting],
    })
})

export function leidenPlus(): Extension[] {
    return [new LanguageSupport(leidenPlusLanguage), leidenPlusLinter]
}