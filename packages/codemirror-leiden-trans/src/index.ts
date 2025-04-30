import { Extension } from "@codemirror/state";
import { drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from "@codemirror/view";
import { bracketMatching, foldGutter, foldKeymap, indentOnInput } from "@codemirror/language";
import { closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { lintGutter, lintKeymap } from "@codemirror/lint";
import { searchKeymap } from "@codemirror/search";
import { LeidenTransConfig, leidenTranslationLanguage } from "@leiden-js/codemirror-lang-leiden-trans";
import { leidenTranslationToolbar } from "@leiden-js/toolbar-leiden-trans";


export const leidenTranslation = (config?: LeidenTransConfig): Extension => {
    return [
        leidenTranslationLanguage(config),
        leidenTranslationToolbar,

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
