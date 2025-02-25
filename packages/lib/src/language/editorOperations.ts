import {SyntaxNode} from "@lezer/common";
import {EditorView} from "@codemirror/view";

export type CommandTarget = Pick<EditorView, 'state' | 'dispatch'>

export const insertBeforeEndBracket = ({dispatch} : CommandTarget, wrappingNode: SyntaxNode, content: string): boolean => {
    const endBracket = wrappingNode.getChildren("Delims").pop()
    if (!endBracket) {
        console.error("End bracket not found")
        return false
    }

    dispatch({
        changes: { from: endBracket.from, insert: content }
    })

    return true
}

export const deleteRange = ({dispatch}: CommandTarget, {from, to}: {
    from: number,
    to: number
}): boolean => {
    if (to <= from) {
        console.error(`Invalid range: ${from}, ${to}`)
        return false
    }

    dispatch({ changes: {from, to, insert: ""}});

    return true
}