import {styleTags, tags as t} from "@lezer/highlight";
import {NodePropSource} from "@lezer/common";
import {leidenTags as leiden} from "@leiden-plus/lib/language";
import {leidenTags} from "@leiden-plus/lib/language";

export const leidenPlusHighlighting: NodePropSource = styleTags({
    "GapNums!": [leidenTags.gapNumber],

    "Illegible/...": [leidenTags.illegible, leidenTags.keyword],
    "Vestige/... VestigStandalone": [leidenTags.vestiges, leidenTags.keyword],
    "LostLines/...": [leidenTags.lostLines, leidenTags.keyword],
    "Vacat/...": [leidenTags.vacat, leidenTags.keyword],


    // block elements
    "EditionStart": leiden.blockLevel1,
    "EditionStart/LanguageId": [leiden.blockLevel1Attr, leiden.keyword],
    "Div/Num Div/Ref Div/Subtype": [leiden.blockLevel2Attr, leiden.keyword],
    "Div Div/Delims": leiden.blockLevel2,
    "Ab/Delims": leiden.blockLevel3,

    // wrapping elements
    "Foreign/Text!": leiden.foreign,
    "Foreign/Delims": [leiden.foreign, leiden.bracket],
    "Foreign/LanguageId": [leiden.foreignLanguageId, t.keyword], // TODO: make visible in grammar

    "Abbrev Abbrev/Text!": [leidenTags.abbrev],
    "Unclear!": [leidenTags.gapNumber],
    "Abbrev/Unclear!": [leidenTags.abbrev, leidenTags.gapNumber],
    "Abbrev/Delims": [leidenTags.bracket, leidenTags.abbrev],
    "AbbrevInnerEx/...": leidenTags.expansion,
    "AbbrevInnerEx/Delims": [leidenTags.bracket, leidenTags.expansion],

    "SuppliedLost/Text!": leidenTags.lost,
    "SuppliedLost/Delims": [leidenTags.lost, leidenTags.bracket],

    "Gap/...": leidenTags.gap,
    "Gap/Delims": [leidenTags.gap, leidenTags.bracket],

    "NumberSpecial/Delims": [leidenTags.number, leidenTags.bracket],
    "NumberSpecial/Text/...": [leidenTags.numberSymbol],
    "NumberSpecialValue! FracPart! FracNoValue!": [leidenTags.numberValue],

    "Glyph! Filler!": [leidenTags.glyph, t.emphasis],

    "AbbrevUnresolved/Delims!": [leidenTags.abbrevUnresolved, leidenTags.bracket],
    "AbbrevUnresolved/Text!": [leidenTags.abbrevUnresolved],


    // wrapping elements - apparatus
    "OrthoReg OrthoReg/Delims": [leiden.app1],
    "OrthoReg/Infix OrthoReg/MultiInfix": [leiden.app1, leiden.keyword],
    "OrthoRegReg/Text!": [leiden.app1Left],
    "OrthoRegOrig/Text!": [leiden.app1Right],
    "OrthoRegReg/LanguageIdSpec!": [leiden.app1LeftSpec, t.emphasis],

    "ScribalCorrection ScribalCorrection/Delims": [leiden.app2],
    "ScribalCorrection/Infix": [leiden.app2, t.emphasis, leiden.keyword],
    "ScribalCorrectionAdd/Text!": [leiden.app2Left],
    "ScribalCorrectionDel/Text!": [leiden.app2Right],

    "AlternateReading AlternateReading/Delims": [leiden.app3],
    "AlternateReading/Infix AlternateReading/MultiInfix": [leiden.app3, leiden.keyword],
    "AlternateReadingLemma/Text!": [leiden.app3Left],
    "AlternateReadingReading/Text!": [leiden.app3Right],

    "SpellingCorrection SpellingCorrection/Delims": [leiden.app4],
    "SpellingCorrection/Infix": [leiden.app4, leiden.keyword],
    "SpellingCorrectionCorr/Text!": [leiden.app4Left],
    "SpellingCorrectionSic/Text!": [leiden.app4Right],

    "EditorialCorrection EditorialCorrection/Delims": [leiden.app5],
    "EditorialCorrection/Infix EditorialCorrection/MultiInfix": [leiden.app5, leiden.keyword],
    "EditorialCorrectionLemma/Text!": [leiden.app5Left],
    "EditorialCorrectionLemma/Citation!": [leiden.app5LeftSpec, t.emphasis],
    "EditorialCorrectionReading/Text!": [leiden.app5Right],
    "EditorialCorrectionReading/Citation!": [leiden.app5RightSpec, t.emphasis],

    "Diacritical": [t.emphasis, t.regexp],
    "DiacriticSymbol": [t.strong, t.emphasis, t.regexp],
    "DiacritChar": [t.emphasis],
    "LineBreak! LineBreakSpecial! LineBreakSpecialWrapped!": t.string,
    "LineBreakWrapped!": [t.string, t.emphasis],
    "Milestone": [t.string, t.strong],
    "Surplus Surplus/Text!": t.regexp,
    "AbbrevUnresolved AbbrevUnresolved/Text!": t.typeName,
    "Deletion/Delims Deletion/Content/Text!": t.regexp,
    // "( ) [ ]": t.paren,
    "Supplied Supplied/Text": t.meta,
    "SuppliedOmitted SuppliedOmitted/Text": t.annotation,
    // "Unclear!": t.bool,
    // "*/Unclear": leiden.gapNumber,
    "NumberSpecial NumberSpecialValue Number": t.number,
    "CertLow AbbrevInnerExContent/QuestionMark": t.attributeValue,
    "EditorialNote EditorialNote/Text!": t.annotation,
    "Citation!": t.emphasis, // TODO doesn't work
    "Handshift!": t.strong,
    "Figure!": t.emphasis,
    "InsertionAbove InsertionAbove/Text!": t.annotation,
    "InsertionBelow InsertionBelow/Text!": t.annotation,
    "InsertionMargin InsertionMargin/Text!": t.annotation,
    "MarginSling MarginSling/Text!": t.annotation,
    "MarginUnderline MarginUnderline/Text!": t.annotation,
    "TextTall TextTall/Text!": t.annotation,
    "TextSuperscript TextSuperscript/Text!": t.annotation,
    "TextSubscript TextSubscript/Text!": t.annotation,
    "Supraline Supraline/Text!": t.annotation,
    "Supraline Underline/Text!": t.annotation,
    "Orig Orig/Text!": t.annotation,
    "Quotation Quotation/Text!": t.local(t.variableName),
    "Untranscribed!": t.annotation,
    "OmittedLanguage!": t.annotation,
    "IncompletePattern": t.invalid,
})