import { leidenPlusLanguage, LeidenPlusLanguageConfig } from "@leiden-js/codemirror-lang-leiden-plus";
import { Extension } from "@codemirror/state";
import { leidenPlusToolbar } from "@leiden-js/toolbar-leiden-plus";
import { drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from "@codemirror/view";
import { bracketMatching, foldGutter, foldKeymap, indentOnInput } from "@codemirror/language";
import { closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { lintGutter, lintKeymap } from "@codemirror/lint";
import { searchKeymap } from "@codemirror/search";
import { highlightActiveNode } from "@leiden-js/common/language";
import { LeidenConfig, leidenDefaultConfig } from "@leiden-js/common/codemirror-leiden";
import { leidenPlusLinter } from "@leiden-js/linter-leiden-plus";

export type LeidenPlusConfig = LeidenConfig<LeidenPlusLanguageConfig>;


export const leidenPlus = (config?: LeidenPlusConfig): Extension => {
    const mergedConfig = config ? { ...leidenDefaultConfig, ...config } : leidenDefaultConfig;
    return [
        leidenPlusLanguage(config?.languageConfig),
        leidenPlusToolbar,

        ...(mergedConfig?.lint ? [leidenPlusLinter(typeof mergedConfig.lint === "object" ? mergedConfig.lint : undefined)] : []),
        ...(mergedConfig?.highlightActiveNode ? [highlightActiveNode] : []),

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
