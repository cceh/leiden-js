import {LanguageSupport, LRLanguage} from "@codemirror/language";
import { Extension } from "@codemirror/state"
import {parser} from "@leiden-plus/parser-leiden-plus";
import {leidenPlusHighlighting} from "./highlight";
import {leidenPlusLinter} from "./lint";

export const leidenPlusLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [leidenPlusHighlighting],
    })
})

export function leidenPlus(): Extension[] {
    return [new LanguageSupport(leidenPlusLanguage), leidenPlusLinter]
}