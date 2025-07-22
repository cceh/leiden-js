import { SyntaxNodeRef } from "@lezer/common";

export function findDescendant(node: SyntaxNodeRef, name: string): SyntaxNodeRef | null {
    const cursor = node.node.cursor();
    let foundNode = null;
    do {
        if (cursor.name === name) {
            foundNode = cursor.node;
            break;
        }
    } while (cursor.next() && cursor.node.parent === node.node);

    return foundNode;
}

export function getPrecedingContext(text: string, index: number, contextLength: number = 10): string {
    const start = Math.max(0, index - contextLength);
    const prefix = start > 0 ? "…" : "";
    return `${prefix}${text.slice(start, index)}`;
}

export const nodeDescription = (nodeDescriptions: Record<string, string>, node: SyntaxNodeRef): string => {
    return nodeDescriptions[node.type.name] || node.type.name;
};