import { NodeIterator } from "@lezer/common";
import { EditorState } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";

export const atomicRules = [
    "NumberSpecialValue", "FracPart", "RangePart", "CertLow", "Vestige", "Diacritical", "Glyph", "Filler", "Handshift",
    "Figure", "OmittedLanguage", "Untranscribed", "LineBreakSpecial", "LineBreakSpecialWrapped", "LineBreak",
    "LineBreakWrapped", "Illegible", "IllegibleInvalid", "VestigeInvalid", "LostLines", "LostLinesInvalid", "Vacat",
    "Citation", "EditorialNoteRef", "Gap", "GapOmitted", "AbbrevInnerEx", "AbbrevInnerSuppliedLost"
];

export function inlineContentAllowed(state: EditorState) {
    const tree = syntaxTree(state);
    let iter: NodeIterator | null  = tree.resolveStack(state.selection.ranges[0].from);
    if (iter.node.type.is("Delims")) {
        return false;
    }

    while (iter) {
        if (atomicRules.some(name => iter?.node.type.name === name)) {
            return false;
        }
        iter = iter.next;
    }

    return true;
}

