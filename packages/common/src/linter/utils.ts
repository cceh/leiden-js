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

export const nodeDescription = (nodeDescriptions: Record<string, string>, node: SyntaxNodeRef): string => {
    return nodeDescriptions[node.type.id] || node.type.name;
};