import { Facet, StateEffect, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, PluginValue, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { SyntaxNode } from "@lezer/common";
import { syntaxTree } from "@codemirror/language";

interface NodeHighlightConfig {
    nodeNames: string[];
}

const nodeHighlightConfig = Facet.define<NodeHighlightConfig, NodeHighlightConfig>({
    combine(configs) {
        return configs.length ? configs[configs.length - 1] : {
            nodeNames: []
        };
    }
});

// State field for tracking hover position
const setHoverPos = StateEffect.define<number>();
const hoverState = StateField.define<number>({
    create() {
        return -1;
    },
    update(value, tr) {
        for (const e of tr.effects) {
            if (e.is(setHoverPos)) return e.value;
        }
        return value;
    }
});

const highlightMark = Decoration.mark({
    class: "cm-leiden-active-syntax-node"
});

// ViewPlugin that tracks the cursor and caret position and updates decorations
const activeNodeHighlightViewPlugin = ViewPlugin.fromClass(class implements PluginValue {
    decorations: DecorationSet;

    constructor(view: EditorView) {
        this.decorations = this.getSyntaxNodeDecoration(view);
    }

    update(update: ViewUpdate) {
        if (update.docChanged || update.selectionSet || // auch ViewPort changed?
            update.transactions.some(tr => tr.effects.some(e => e.is(setHoverPos)))) {
            this.decorations = this.getSyntaxNodeDecoration(update.view);
        }
    }

    getSyntaxNodeDecoration(view: EditorView) {
        const decorations = [];
        const selection = view.state.selection.main;
        const config = view.state.facet(nodeHighlightConfig);

        const findHighlightableNode = (pos: number): SyntaxNode | null => {
            const tree = syntaxTree(view.state);
            let node: SyntaxNode | null = tree.resolveInner(pos, 1);

            while (node) {
                if (node && node.to - node.from > 0) {
                    if (config.nodeNames.includes(node.name) || node.type.is("topLevel")) {
                        // Don't highlight if the last child is an error node
                        if (node.lastChild && node.lastChild.type.isError) {
                            node = node.parent;
                            continue;
                        }
                        return node;
                    }
                }
                node = node.parent;
            }
            return null;
        };

        let selectionHighlighted: SyntaxNode | null = null;
        if (selection.empty) {
            selectionHighlighted = findHighlightableNode(selection.from);
            if (selectionHighlighted) {
                decorations.push(highlightMark.range(selectionHighlighted.from, selectionHighlighted.to));
            }
        }

        const hoverPos = view.state.field(hoverState);
        if (hoverPos >= 0) {
            const hoverNode = findHighlightableNode(hoverPos);
            if (hoverNode && hoverNode !== selectionHighlighted) {
                decorations.push(highlightMark.range(hoverNode.from, hoverNode.to));
            }
        }

        return Decoration.set(decorations.sort((a, b) => a.from - b.from),);
    }
}, {
    decorations: v => v.decorations,
    eventHandlers: {
        mousemove(event: MouseEvent, view: EditorView) {
            const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });
            if (pos !== null) {
                view.dispatch({ effects: setHoverPos.of(pos) });
            }
        },

        mouseleave(_event: MouseEvent, view: EditorView) {
            view.dispatch({ effects: setHoverPos.of(-1) });
        }
    }
});

const activeNodeHighlightTheme = EditorView.baseTheme({
    ".cm-leiden-active-syntax-node": {
        backgroundColor: "rgba(148,148,195,0.16)",
        borderBottom: "1px dotted rgba(148,148,195)"
    }
});

export const highlightActiveNode = [
    activeNodeHighlightViewPlugin,
    activeNodeHighlightTheme,
    hoverState
];