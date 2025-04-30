import { styleTags, tags as t } from "@lezer/highlight";
import { NodePropSource } from "@lezer/common";
import { leidenTags as leiden } from "@leiden-js/common/language";

export const leidenPlusHighlighting: NodePropSource = styleTags({

    "Unclear Supraline/SupralineUnclear": [leiden.unclear],

    "Vacat!": [leiden.keyword, leiden.vacat],
    "Vestige!":[leiden.keyword, leiden.vestiges],
    "Illegible!": [leiden.keyword, leiden.illegible],
    "LostLines!": [leiden.keyword, leiden.lostLines],

    "GapOmitted/< Gap/[": [leiden.bracketedKeywordStart, leiden.gap],
    "GapOmitted GapOmitted/GapNums! Gap Gap/GapNums!": [leiden.bracketedKeywordContent, leiden.gap],
    "GapOmitted/CertLow Gap/CertLow": [leiden.bracketedKeywordContent, leiden.lowCertaintyMarker],
    "GapOmitted/> Gap/]": [leiden.bracketedKeywordEnd, leiden.gap],

    "OmittedLanguage/UntranscribedStart": [leiden.bracketedKeywordStart, leiden.omittedLanguage],
    "OmittedLanguage": [leiden.bracketedKeywordContent, leiden.omittedLanguage],
    "OmittedLanguage/GapNums! OmittedLanguage/QuestionMark": [leiden.bracketedKeywordContent, leiden.omittedLanguage, leiden.omittedLanguageQuantity],
    "OmittedLanguage/Language": [leiden.bracketedKeywordContent, leiden.omittedLanguage, leiden.omittedLanguageLanguage],
    "OmittedLanguage/UntranscribedEnd": [leiden.bracketedKeywordEnd, leiden.omittedLanguage],

    "Untranscribed/UntranscribedStart": [leiden.bracketedKeywordStart, leiden.untranscribed],
    "Untranscribed": [leiden.bracketedKeywordContent, leiden.untranscribed],
    "Untranscribed/GapNums! Untranscribed/QuestionMark": [leiden.bracketedKeywordContent, leiden.untranscribed, leiden.untranscribedQuantity],
    "Untranscribed/UntranscribedEnd": [leiden.bracketedKeywordEnd, leiden.untranscribed],

    // block elements
    "EditionStart": leiden.blockLevel1,
    "EditionStart/LanguageId": [leiden.blockLevel1Attr, leiden.id],
    "Div/Num Div/Ref Div/Subtype": [leiden.blockLevel2Attr, leiden.id],
    "Div Div/Delims": leiden.blockLevel2,
    "Ab/Delims": leiden.blockLevel3,

    // wrapping elements
    "Foreign/Text! Foreign/*/SupralineMacronContent": leiden.foreign,
    "Foreign/Delims": [leiden.foreign, leiden.bracket],
    "Foreign/LanguageId": [leiden.foreignLanguageId, leiden.id], // TODO: make visible in grammar
    "Foreign/Unclear Foreign/Supraline/SupralineUnclear": [leiden.foreign, leiden.unclear],

    "Abbrev Abbrev/Text! Abbrev/*/SupralineMacronContent": [leiden.abbrev],
    "Abbrev/Delims": [leiden.bracket, leiden.abbrev],
    "Abbrev/Unclear Abbrev/Supraline/SupralineUnclear": [leiden.abbrev, leiden.unclear],
    "AbbrevInnerEx/*/Expansion": leiden.expansion,
    "AbbrevInnerExContent/QuestionMark": leiden.lowCertaintyMarker,
    "AbbrevInnerEx/Delims": [leiden.bracket, leiden.expansion],
    "AbbrevInnerSuppliedLost/Delims AbbrevInnerSuppliedLost/Text!": [leiden.suppliedLost],

    "SuppliedLost/Text! SuppliedLost/*/SupralineMacronContent": leiden.suppliedLost,
    "SuppliedLost/[ SuppliedLost/]": [leiden.suppliedLost, leiden.bracket],
    "SuppliedLost/Unclear SuppliedLost/Supraline/SupralineUnclear": [leiden.suppliedLost, leiden.unclear],
    "AbbrevInnerSuppliedLost/Text! AbbrevInnerSuppliedLost/*/SupralineMacronContent": leiden.suppliedLost,
    "AbbrevInnerSuppliedLost/[ AbbrevInnerSuppliedLost/]": [leiden.suppliedLost, leiden.bracket],
    "AbbrevInnerSuppliedLost/Unclear AbbrevInnerSuppliedLost/Supraline/SupralineUnclear": [leiden.suppliedLost, leiden.unclear],
    "SuppliedOmitted SuppliedOmitted/Text! SuppliedOmitted/*/SupralineMacronContent": leiden.suppliedOmitted,
    "SuppliedOmitted/< SuppliedOmitted/>": [leiden.suppliedOmitted, leiden.bracket],
    "SuppliedOmitted/Unclear SuppliedOmitted/Supraline/SupralineUnclear": [leiden.suppliedOmitted, leiden.unclear],
    "SuppliedParallel AbbrevInnerSuppliedParallel SuppliedParallel/Text! AbbrevInnerSuppliedParallel/Text! SuppliedParallel/*/SupralineMacronContent AbbrevInnerSuppliedParallel/*/SupralineMacronContent": leiden.suppliedParallel,
    "SuppliedParallel/Delims! AbbrevInnerSuppliedParallel/Delims!": [leiden.suppliedParallel, leiden.bracket],
    "SuppliedParallel/Unclear AbbrevInnerSuppliedParallel/Unclear AbbrevInnerSuppliedParallel/Supraline/SupralineUnclear AbbrevInnerSuppliedParallel/Supraline/SupralineUnclear": [leiden.suppliedParallel, leiden.unclear],
    "SuppliedParallelLost SuppliedParallelLost/Text! SuppliedParallelLost/*/SupralineMacronContent": leiden.suppliedParallelLost,
    "SuppliedParallelLost/Delims!": [leiden.suppliedParallelLost, leiden.bracket],
    "SuppliedParallelLost/Unclear SuppliedParallelLost/Supraline/SupralineUnclear": [leiden.suppliedParallelLost, leiden.unclear],

    "NumberSpecial NumberSpecialTick NumberSpecial/Delims NumberSpecialTick/Delims NumberSpecial/*/SupralineMacronContent NumberSpecialTick/*/SupralineMacronContent": [leiden.number, leiden.bracket],
    "NumberSpecial/Text! NumberSpecialTick/Text!": [leiden.numberSymbol],
    "NumberSpecialValue! FracPart! FracNoValue! RangePart!": [leiden.numberValue],
    "NumberSpecial/Unclear NumberSpecialTick/Unclear NumberSpecial/Supraline/SupralineUnclear NumberSpecialTick/Supraline/SupralineUnclear": [leiden.number, leiden.unclear],


    "Glyph!": [leiden.glyph],
    "Filler!": [leiden.glyph],

    "AbbrevUnresolved AbbrevUnresolved/Text! AbbrevUnresolved/*/SupralineMacronContent": [leiden.abbrevUnresolved],
    "AbbrevUnresolved/Delims!": [leiden.abbrevUnresolved, leiden.bracket],
    "AbbrevUnresolved/Unclear AbbrevUnresolved/Supraline/SupralineUnclear": [leiden.abbrevUnresolved, leiden.unclear],

    // wrapping elements - apparatus
    "OrthoReg": [leiden.app1],
    "OrthoReg/Delims": [leiden.app1, leiden.bracket],
    "OrthoReg/Infix OrthoReg/MultiInfix": [leiden.app1Infix, leiden.app1],
    "OrthoRegReg/Text! OrthoRegReg/*/SupralineMacronContent": [leiden.app1Left],
    "OrthoRegReg/Unclear OrthoRegReg/Supraline/SupralineUnclear": [leiden.app1Left, leiden.unclear],
    "OrthoRegReg/LanguageIdSpec!": [leiden.app1LeftSpec, t.emphasis],
    "OrthoRegOrig/Text! OrthoRegOrig/*/SupralineMacronContent": [leiden.app1Right],
    "OrthoRegOrig/Unclear OrthoRegOrig/Supraline/SupralineUnclear": [leiden.app1Right, leiden.unclear],

    "ScribalCorrection": [leiden.app2],
    "ScribalCorrection/Delims": [leiden.app2, leiden.bracket],
    "ScribalCorrection/Infix": [leiden.app2Infix, leiden.app2],
    "ScribalCorrectionAdd/Text! ScribalCorrectionAdd/*/SupralineMacronContent": [leiden.app2Left],
    "ScribalCorrectionAdd/Unclear ScribalCorrectionAdd/Supraline/SupralineUnclear": [leiden.app2Left, leiden.unclear],
    "ScribalCorrectionDel/Text! ScribalCorrectionDel/*/SupralineMacronContent": [leiden.app2Right],
    "ScribalCorrectionDel/Unclear ScribalCorrectionDel/Supraline/SupralineUnclear": [leiden.app2Right, leiden.unclear],


    "AlternateReading": [leiden.app3],
    "AlternateReading/Delims": [leiden.app3, leiden.bracket],
    "AlternateReading/Infix AlternateReading/MultiInfix": [leiden.app3Infix, leiden.app3],
    "AlternateReadingLemma/Text! AlternateReadingLemma/*/SupralineMacronContent": [leiden.app3Left],
    "AlternateReadingLemma/Unclear AlternateReadingLemma/Supraline/SupralineUnclear": [leiden.app3Left, leiden.unclear],
    "AlternateReadingReading/Text! AlternateReadingReading/*/SupralineMacronContent": [leiden.app3Right],
    "AlternateReadingReading/Unclear AlternateReadingReading/Supraline/SupralineUnclear": [leiden.app3Right, leiden.unclear],

    "SpellingCorrection": [leiden.app4],
    "SpellingCorrection/Delims": [leiden.app4, leiden.bracket],
    "SpellingCorrection/Infix": [leiden.app4Infix, leiden.app4],
    "SpellingCorrectionCorr/Text! SpellingCorrectionCorr/*/SupralineMacronContent": [leiden.app4Left],
    "SpellingCorrectionCorr/Unclear SpellingCorrectionCorr/Supraline/SupralineUnclear": [leiden.app4Left, leiden.unclear],
    "SpellingCorrectionSic/Text! SpellingCorrectionSic/*/SupralineMacronContent": [leiden.app4Right],
    "SpellingCorrectionSic/Unclear SpellingCorrectionSic/Supraline/SupralineUnclear": [leiden.app4Right, leiden.unclear],

    "EditorialCorrection": [leiden.app5],
    "EditorialCorrection/Delims": [leiden.app5, leiden.bracket],
    "EditorialCorrection/Infix EditorialCorrection/MultiInfix": [leiden.app5Infix, leiden.app5],
    "EditorialCorrectionLemma/Text! EditorialCorrectionLemma/*/SupralineMacronContent": [leiden.app5Left],
    "EditorialCorrectionLemma/Citation!": [leiden.app5LeftSpec, t.emphasis],
    "EditorialCorrectionLemma/Unclear EditorialCorrectionLemma/Supraline/SupralineUnclear": [leiden.app5Left, leiden.unclear],

    "EditorialCorrectionReading/Text! EditorialCorrectionReading/*/SupralineMacronContent": [leiden.app5Right],
    "EditorialCorrectionReading/Citation!": [leiden.app5RightSpec, t.emphasis],
    "EditorialCorrectionReading/Unclear EditorialCorrectionReading/Supraline/SupralineUnclear": [leiden.app5Right, leiden.unclear],


    "Surplus Surplus/Text! Surplus/*/SupralineMacronContent": leiden.surplus,
    "Surplus/Delims!": [leiden.surplus, leiden.bracket],
    "Surplus/Unclear Surplus/Supraline/SupralineUnclear": [leiden.surplus, leiden.unclear],


    "Deletion Deletion/Content/Text! Deletion/Content/*/SupralineMacronContent": leiden.erasureContent,
    "Deletion/Delims!": [leiden.erasure, leiden.bracket],
    "Deletion/Content/Unclear Deletion/Content/*/SupralineUnclear": [leiden.erasure, leiden.unclear],


    "InsertionAbove InsertionAbove/Text! InsertionAbove/*/SupralineMacronContent": [leiden.insertionAbove],
    "InsertionAbove/Delims!": [leiden.insertionAbove, leiden.bracket],
    "InsertionAbove/Unclear InsertionAbove/Supraline/SupralineUnclear": [leiden.insertionAbove, leiden.unclear],
    "InsertionBelow InsertionBelow/Text! InsertionBelow/*/SupralineMacronContent": [leiden.insertionBelow],
    "InsertionBelow/Delims!": [leiden.insertionBelow, leiden.bracket],
    "InsertionBelow/Unclear InsertionBelow/Supraline/SupralineUnclear": [leiden.insertionBelow, leiden.unclear],
    "InsertionMargin InsertionMargin/Text! InsertionMargin/*/SupralineMacronContent": [leiden.insertionMargin],
    "InsertionMargin/Delims!": [leiden.insertionMargin, leiden.bracket],
    "InsertionMargin/Unclear InsertionMargin/Supraline/SupralineUnclear": [leiden.insertionMargin, leiden.unclear],
    "InsertionMarginSling InsertionMarginSling/Text! InsertionMarginSling/*/SupralineMacronContent": [leiden.insertionMarginSling],
    "InsertionMarginSling/Delims!": [leiden.insertionMarginSling, leiden.bracket],
    "InsertionMarginSling/Unclear InsertionMarginSling/Supraline/SupralineUnclear": [leiden.insertionMarginSling, leiden.unclear],
    "InsertionMarginUnderline InsertionMarginUnderline/Text! InsertionMarginUnderline/*/SupralineMacronContent": [leiden.insertionMarginUnderline],
    "InsertionMarginUnderline/Delims!": [leiden.insertionMarginUnderline, leiden.bracket],
    "InsertionMarginUnderline/Unclear InsertionMarginUnderline/Supraline/SupralineUnclear": [leiden.insertionMarginUnderline, leiden.unclear],

    "TextSuperscript TextSuperscript/Text! TextSuperscript/*/SupralineMacronContent": [leiden.superscript],
    "TextSuperscript/Delims!": [leiden.superscript, leiden.bracket],
    "TextSuperscript/Unclear TextSuperscript/Supraline/SupralineUnclear": [leiden.superscript, leiden.unclear],
    "TextSubscript TextSubscript/Text! TextSubscript/*/SupralineMacronContent": [leiden.subscript],
    "TextSubscript/Delims!": [leiden.subscript, leiden.bracket],
    "TextSubscript/Unclear TextSubscript/Supraline/SupralineUnclear": [leiden.subscript, leiden.unclear],
    "Supraline Supraline/Text! Supraline/*/SupralineMacronContent": [leiden.supraline],
    "Supraline/Delims!": [leiden.supraline, leiden.bracket],
    "Supraline/Unclear Supraline/Supraline/SupralineUnclear": [leiden.supraline, leiden.unclear],
    "SupralineUnderline SupralineUnderline/Text! SupralineUnderline/*/SupralineMacronContent": [leiden.supralineUnderline],
    "SupralineUnderline/Delims!": [leiden.supralineUnderline, leiden.bracket],
    "SupralineUnderline/Unclear SupralineUnderline/Supraline/SupralineUnclear": [leiden.supralineUnderline, leiden.unclear],
    "TextTall TextTall/Text! TextTall/*/SupralineMacronContent": [leiden.tall],
    "TextTall/Delims!": [leiden.tall, leiden.bracket],
    "TextTall/Unclear TextTall/Supraline/SupralineUnclear": [leiden.tall, leiden.unclear],

    "EditorialNote EditorialNote/Text! EditorialNote/*/SupralineMacronContent": leiden.editorialNote,
    "EditorialNote/Delims!": [leiden.editorialNote, leiden.bracket],
    "EditorialNote/Unclear EditorialNote/Supraline/SupralineUnclear": [leiden.editorialNote, leiden.unclear],
    "Quotation Quotation/Text! Quotation/*/SupralineMacronContent": leiden.quotation,
    "Quotation/Delims!": [leiden.quotation, leiden.bracket],
    "Quotation/Unclear Quotation/Supraline/SupralineUnclear": [leiden.quotation, leiden.unclear],


    "LineBreak! LineBreakSpecial!": leiden.lineNumber,
    "LineBreakWrapped!  LineBreakSpecialWrapped!": [leiden.lineNumberWrap],

    "Milestone": leiden.milestone,

    "Diacritical": [leiden.diacritical],
    "DiacriticSymbol": [leiden.diacritSymbol],
    "DiacritChar": [leiden.diacritChar],
    "Diacritical/Delims": [leiden.diacritParens, leiden.bracket],

    "Figure!": leiden.figure,
    "Handshift!": leiden.handshift,

    "CertLow": leiden.lowCertaintyMarker,

    "Orig Orig/OrigContent!": leiden.orig,
    "Orig/Delims!": [leiden.orig, leiden.bracket]
});
