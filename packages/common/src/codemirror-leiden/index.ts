import { LeidenLanguageConfig } from "../language/index.js";


export interface LeidenConfig<T extends LeidenLanguageConfig<string> = LeidenLanguageConfig<string>> {
    languageConfig?: T
    highlightActiveNode?: boolean
    lint?: boolean
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