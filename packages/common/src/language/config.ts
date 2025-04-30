export type HighlightStyleMode = "none" | "light" | "dark";

export interface LeidenConfig<TopNode extends string = "Document"> {
    topNode?: TopNode
    highlightActiveNode?: boolean
    leidenHighlightStyle?: HighlightStyleMode
    lint?: boolean
}

export const leidenDefaultConfig: LeidenConfig = {
    topNode: "Document",
    highlightActiveNode: true,
    leidenHighlightStyle: "light",
    lint: true
};