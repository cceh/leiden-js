import { NodeIterator } from "@lezer/common";
import { EditorState } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";

export const atomicRules = [
    "NumberSpecialValue", "FracPart", "RangePart", "CertLow", "Vestige", "Diacritical", "Glyph", "Filler", "Handshift",
    "Figure", "OmittedLanguage", "Untranscribed", "LineBreakSpecial", "LineBreakSpecialWrapped", "LineBreak",
    "LineBreakWrapped", "Illegible", "IllegibleInvalid", "VestigeInvalid", "LostLines", "LostLinesInvalid", "Vacat",
    "Citation", "EditorialNoteRef", "Gap", "GapOmitted", "AbbrevInnerEx", "AbbrevInnerSuppliedLost"
];

export const wrappingRules: string[] = [
    "Abbrev", "AbbrevInnerEx", "AbbrevInnerSuppliedLost", "AbbrevInnerSuppliedLostEx", "AbbrevInnerSuppliedParallel", "AbbrevInvalid",
    "AbbrevUnresolved", "AlternateReading", "EditorialCorrection", "EditorialNote", "Filler", "Foreign", "Gap", "GapOmitted", "Glyph",
    "InsertionAbove", "InsertionBelow", "InsertionMargin", "InsertionMarginSling", "InsertionMarginUnderline", "NumberSpecial",
    "Orig", "OrthoReg", "Quotation", "ScribalCorrection", "SuppliedLost", "SuppliedOmitted", "SuppliedParallel", "SuppliedParallelLost",
    "Surplus", "SupralineSpan", "SupralineUnderline", "TextSubscript", "TextSuperscript", "TextTall", "Deletion", "Ab", "Div"
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