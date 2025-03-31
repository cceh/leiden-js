import { findClusterBreak, StateField } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";

interface SyntactialDiacritRange {
    name: string,
    from: number,
    to: number
}

export const syntactialDiacritRanges = StateField.define<SyntactialDiacritRange[]>({
    create() {
        return [];
    },
    update(ranges, tr) {
        if (tr.docChanged || tr.selection) {
            ranges.length = 0;
            const selection = tr.state.selection.main;
            if (selection.empty && selection.from === 0) {
                return ranges;
            }

            const from = selection.empty ? findClusterBreak(tr.state.doc.toString(), selection.from, false) : selection.from;
            const to = selection.to;

            const node = syntaxTree(tr.state).cursorAt(from, 1);
            do {
                const name = node.type.name;
                if (name === "Text") {
                    const pattern = /[\p{L}\p{N}]+/gu;
                    const testFrom = Math.max(from, node.from);
                    const testTo = Math.min(to, node.to);

                    let match;
                    while ((match = pattern.exec(tr.state.doc.sliceString(testFrom, testTo)))) {
                        ranges.push({
                            name,
                            from: testFrom + match.index,
                            to: testFrom + match.index + match[0].length,
                        });
                    }
                } else if (name === "Unclear" || name === "SupralineMacronContent" || name === "SupralineUnclear") {
                    ranges.push({
                        name,
                        from: Math.max(from, node.from),
                        to: Math.min(to, node.to)
                    });
                }

                if (node.to > to) {
                    break;
                }
            } while (node.next());
        }
        return ranges;
    }
});