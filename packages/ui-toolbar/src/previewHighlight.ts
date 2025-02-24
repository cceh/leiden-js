import {RangeSet, StateEffect, StateField} from "@codemirror/state";
import {Decoration, EditorView} from "@codemirror/view";


const setPreviewHighlights = StateEffect.define<{from: number, to: number}[]>()
const clearPreviewHighlights = StateEffect.define<never>()

const previewHighlightMark = Decoration.mark({
    class: "cm-ljs-toolbar-action-highlight"
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
            } else if (effect.is(clearPreviewHighlights)) {
                return RangeSet.empty
            }
        }

        return highlights
    },
    provide: f => EditorView.decorations.from(f)
})

export const previewHighlightTheme = EditorView.baseTheme({
    ".cm-ljs-toolbar-preview-highlight": {
        backgroundColor: "var(--cm-ljs-toolbar-color-preview-highlight)"
    }
})


