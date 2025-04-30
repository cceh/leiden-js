import { Completion, snippet } from "@codemirror/autocomplete";
import { CommandTarget } from "./editorOperations.js";

export type SnippetDef = {
    template: string,
    completion: Omit<Completion, "info"> & { info?: string }
};

export type Snippets = Record<string, SnippetDef>;

export const applySnippet = (
    { state, dispatch }: CommandTarget,
    { template }: { template: string },
    { to, from }: { from: number, to: number } = state.selection.ranges[0]
): void => {
    snippet(template)({ state, dispatch }, null, from, to);
};