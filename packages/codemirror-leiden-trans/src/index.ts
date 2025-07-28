import { Extension } from "@codemirror/state";
import { drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from "@codemirror/view";
import { bracketMatching, foldGutter, foldKeymap, indentOnInput } from "@codemirror/language";
import { closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { lintGutter, lintKeymap } from "@codemirror/lint";
import { searchKeymap } from "@codemirror/search";
import { LeidenTransLanguageConfig, leidenTranslationLanguage } from "@leiden-js/codemirror-lang-leiden-trans";
import { leidenTranslationToolbar } from "@leiden-js/toolbar-leiden-trans";
import { LeidenConfig, leidenDefaultConfig } from "@leiden-js/common/codemirror-leiden";
import { leidenTransLinter } from "@leiden-js/linter-leiden-trans";
import { highlightActiveNode } from "@leiden-js/common/language";

export type LeidenTransConfig = LeidenConfig<LeidenTransLanguageConfig>;

const defaultConfig = leidenDefaultConfig as LeidenTransConfig;

export const leidenTranslation = (config?: LeidenTransConfig): Extension => {
    const mergedConfig = config ? { ...defaultConfig, ...config } : defaultConfig;
    return [
        leidenTranslationLanguage(mergedConfig.languageConfig),
        leidenTranslationToolbar,

        ...(mergedConfig?.lint ? [leidenTransLinter(typeof mergedConfig.lint === "object" ? mergedConfig.lint : undefined)] : []),
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
