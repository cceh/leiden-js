import {RangeSet, StateEffect, StateField} from "@codemirror/state";
import {Decoration, EditorView} from "@codemirror/view";


export const setPreviewHighlights = StateEffect.define<{from: number, to: number}[]>()

const previewHighlightMark = Decoration.mark({
    class: "cm-ljs-toolbar-preview-highlight"
})

export const previewHighlightField = StateField.define({
    create() { return RangeSet.empty },
    update(highlights, tr) {
        highlights = highlights.map(tr.changes)
        for (const effect of tr.effects) {
            if (effect.is(setPreviewHighlights)) {
                return RangeSet.of(
                    effect.value.map(({from, to}) =>
                        previewHighlightMark.range(from, to))
                )
            }
        }

        return highlights
    },
    provide: f => EditorView.decorations.from(f)
})

export const previewHighlightTheme = EditorView.baseTheme({
    ".cm-ljs-toolbar-preview-highlight": {
        backgroundColor: "var(--cm-ljs-toolbar-color-preview-highlight, rgba(255, 255, 0, 0.4))"
    }
})


