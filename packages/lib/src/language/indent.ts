import {TreeIndentContext} from "@codemirror/language";

// An indentation strategy for leiden blocks
export function blockIndent(close?: RegExp) {
    return (context: TreeIndentContext) => {
        const closed = close?.test(context.textAfter)
        const nodeStartLine = context.lineAt(context.node.from)
        if (closed) {
            return context.lineIndent(nodeStartLine.from)
        }

        // Find the previous non-blank line
        let previousLine = null
        let lineOffset = 1

        if (context.simulatedBreak) {
            previousLine = context.lineAt(context.pos, -1)
            // Check if previous line is blank, and if so, keep looking back
            while (previousLine && previousLine.text.trim() === "") {
                lineOffset++;
                if (context.pos - lineOffset < 0) break;
                previousLine = context.lineAt(context.pos, -1)
            }
        } else {
            const currentLine = context.state.doc.lineAt(context.pos)
            if (currentLine.number > 1) {
                previousLine = context.state.doc.lineAt(context.pos - 1)
                // Check if previous line is blank, and if so, keep looking back
                while (previousLine && previousLine.text.trim() === "") {
                    if (currentLine.number - lineOffset < 1) break;
                    const prevPosition = currentLine.from - (lineOffset * context.state.lineBreak.length) - 1
                    if (prevPosition < 0) break;
                    previousLine = context.state.doc.lineAt(prevPosition)
                    lineOffset++;
                }
            }
        }

        const currentLine = context.lineAt(context.pos, -1)
        const currentIndent = previousLine ? context.lineIndent(previousLine.from) : context.lineIndent(currentLine.from)
        const minIndent = previousLine && previousLine.from === nodeStartLine.from
            ? currentIndent + context.unit
            : currentIndent

        return nodeStartLine.from === context.lineAt(context.pos, -1).from && currentIndent < minIndent
            ? minIndent
            : currentIndent
    }
}