import {Facet, StateEffect, StateField} from "@codemirror/state";
import {Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate} from "@codemirror/view";
import {syntaxTree} from "@codemirror/language";
import {SyntaxNode} from "@lezer/common";

interface NodeHighlightConfig {
    nodeNames: string[];
    activeClass?: string;
    activeBackgroundColor?: string;
    hoverClass?: string;
    hoverBackgroundColor?: string;
}

// Create a facet for the configuration
const nodeHighlightConfig = Facet.define<NodeHighlightConfig, NodeHighlightConfig>({
    combine(configs) {
        // Combine multiple configurations if present
        // Last config takes precedence
        return configs.length ? configs[configs.length - 1] : {
            nodeNames: [],
            activeClass: "cm-active-syntax-node",
            activeBackgroundColor: "rgba(128, 128, 255, 0.2)",
            hoverClass: "cm-hover-syntax-node",
            hoverBackgroundColor: "rgba(128, 128, 255, 0.1)"
        }
    }
})

// Effect for updating hover position
const setHoverPos = StateEffect.define<number>()

// State field for tracking hover position
const hoverState = StateField.define<number>({
    create() {
        return -1
    },
    update(value, tr) {
        for (let e of tr.effects) {
            if (e.is(setHoverPos)) return e.value
        }
        return value
    }
})


// Create a mark decoration for highlighting
const highlightMark = Decoration.mark({
    class: "cm-active-syntax-node"
})

// Create a ViewPlugin that tracks the cursor position and updates decorations
const activeNodeHighlightViewPlugin = ViewPlugin.fromClass(class {
    decorations: DecorationSet

    constructor(view: EditorView, nodeNames: string[] = []) {
        this.decorations = this.getSyntaxNodeDecoration(view);
    }

    update(update: ViewUpdate) {
        if (update.docChanged || update.selectionSet || // auch ViewPort changed?
            update.transactions.some(tr => tr.effects.some(e => e.is(setHoverPos)))) {
            this.decorations = this.getSyntaxNodeDecoration(update.view)
        }
    }

    getSyntaxNodeDecoration(view: EditorView) {
        const decorations = []
        const selection = view.state.selection.main
        const config = view.state.facet(nodeHighlightConfig);


        // Only proceed if we have a valid cursor position
        if (selection.empty) {
            const pos = selection.from
            const tree = syntaxTree(view.state)
            let node: SyntaxNode | null = tree.resolveInner(pos, 1)

            // Check if we found a valid node
            while (node) {
                // console.log(config.nodeNames, node.name);
                if (node && node.to - node.from > 0) {
                    if (config.nodeNames.includes(node.name) || node.type.is("topLevel")) {
                        decorations.push(highlightMark.range(node.from, node.to))
                        break;
                    }
                }
                node = node.parent;
            }
        }

        const hoverPos = view.state.field(hoverState)
        if (hoverPos >= 0) {
            const tree = syntaxTree(view.state)
            let node: SyntaxNode | null = tree.resolveInner(hoverPos, 1)

            while (node) {
                if (config.nodeNames.includes(node.type.name) || node.type.is("topLevel")) {
                    decorations.push(highlightMark.range(node.from, node.to))
                }
                node = node.parent
            }
        }

        return Decoration.set(decorations.sort((a, b) => a.from - b.from),)
    }
}, {
    decorations: v => v.decorations,
    eventHandlers: {
        mousemove(event: MouseEvent, view: EditorView) {
            const pos = view.posAtCoords({x: event.clientX, y: event.clientY})
            if (pos !== null) {
                view.dispatch({effects: setHoverPos.of(pos)})
            }
        },

        mouseleave(_event: MouseEvent, view: EditorView) {
            view.dispatch({effects: setHoverPos.of(-1)})
        }
    }
})

// CSS styles for the highlight
const activeNodeHighlightStyles = EditorView.baseTheme({
    ".cm-active-syntax-node": {
        backgroundColor: "rgba(148,148,195,0.16)",
        borderBottom: "1px dotted rgba(148,148,195)"
    }
})

// Extension that combines the plugin and styles
export const highlightActiveNode = [
    // nodeHighlightConfig.of({nodeNames: ["Deletion", "Gap", "Abbrev", "OrthoReg", "EditorialCorrection"]}),
    activeNodeHighlightViewPlugin,
    activeNodeHighlightStyles,
    hoverState
]