import { SyntaxNode } from "@lezer/common";
import { EditorView } from "@codemirror/view";

export type CommandTarget = Pick<EditorView, "state" | "dispatch">;

export const insertAt = ({ dispatch }: CommandTarget, pos: number, content: string)  => {
    dispatch({
        changes: { from: pos, insert: content }
    });

    return true;
};

export const appendContent = (target: CommandTarget, wrappingNode: SyntaxNode, content: string): boolean => {
    const isDiacritical = wrappingNode.type.name === "Diacritical";
    const endBracket = !isDiacritical && wrappingNode.getChildren("Delims").pop();
    return insertAt(target, endBracket ? endBracket.from : wrappingNode.to, content);
};

export const deleteRange = ({ dispatch }: CommandTarget, { from, to }: {
    from: number,
    to: number
}): boolean => {
    if (to <= from) {
        console.error(`Invalid range: ${from}, ${to}`);
        return false;
    }

    dispatch({ changes: { from, to, insert: "" } });

    return true;
};