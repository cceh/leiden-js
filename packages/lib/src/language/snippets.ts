import {Completion, snippet} from "@codemirror/autocomplete"
import {CommandTarget} from "./editorOperations.js";

export type SnippetDef = {
    template: string,
    completion: Omit<Completion, "info"> & {info?: string}
}

export type Snippets = {
    [key: string]: SnippetDef
}

export const applySnippet = ({state, dispatch}: CommandTarget, {template}: {template: string}): void => {
    const {to, from} = state.selection.ranges[0]
    snippet(template)({state, dispatch}, null, from, to);
}