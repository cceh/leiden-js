import { LeidenPlusConfig, leidenPlusLanguage } from "@leiden-js/codemirror-lang-leiden-plus";
import { Extension } from "@codemirror/state";
import { leidenPlusToolbar } from "@leiden-js/toolbar-leiden-plus";
import { drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from "@codemirror/view";
import { bracketMatching, foldGutter, foldKeymap, indentOnInput } from "@codemirror/language";
import { closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { lintGutter, lintKeymap } from "@codemirror/lint";
import { searchKeymap } from "@codemirror/search";


export const leidenPlus = (config?: LeidenPlusConfig): Extension => {
    return [
        leidenPlusLanguage(config),
        leidenPlusToolbar,

        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        foldGutter(),
        drawSelection(),
        indentOnInput(),
        bracketMatching(),
        highlightActiveLine(),
        lintGutter(),
        keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
            ...lintKeymap
        ]),
    ];
};
