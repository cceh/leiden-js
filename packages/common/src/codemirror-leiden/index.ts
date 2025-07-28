import { LeidenLanguageConfig } from "../language";
import { CodemirrorLintConfig } from "../linter";


export interface LeidenConfig<T extends LeidenLanguageConfig<string> = LeidenLanguageConfig<string>> {
    languageConfig?: T
    highlightActiveNode?: boolean
    lint?: boolean | true | CodemirrorLintConfig
    toolbar?: boolean
}

export const leidenDefaultConfig: LeidenConfig = {
    languageConfig: {
        topNode: "Document",
        leidenHighlightStyle: "light"
    },
    highlightActiveNode: true,
    lint: true,
    toolbar: true
};