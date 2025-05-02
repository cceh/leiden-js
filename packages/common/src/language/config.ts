export type HighlightStyleMode = "none" | "light" | "dark";

export interface LeidenLanguageConfig<TopNode extends string> {
    topNode?: TopNode
    leidenHighlightStyle?: HighlightStyleMode
}
