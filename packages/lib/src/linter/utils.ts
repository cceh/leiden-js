import {SyntaxNodeRef} from "@lezer/common";

export function findDescendant(node: SyntaxNodeRef, name: string): SyntaxNodeRef | null {
    let cursor = node.node.cursor();
    let foundNode = null;
    do {
        if (cursor.name === name) {
            foundNode = cursor.node;
            break;
        }
    } while (cursor.next())

    return foundNode
}