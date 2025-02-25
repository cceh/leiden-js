import {styleTags, tags as t} from "@lezer/highlight";
import {NodePropSource} from "@lezer/common";
import {leidenTags as leiden} from "@leiden-plus/lib/language";
import {leidenTags} from "@leiden-plus/lib/language";

export const leidenPlusHighlighting: NodePropSource = styleTags({

    "Unclear Supraline/SupralineUnclear": [leidenTags.unclear],

    "Vacat!": [leidenTags.keyword, leidenTags.vacat],
    "Vestige!":[leidenTags.keyword, leidenTags.vestiges],
    "Illegible!": [leidenTags.keyword, leidenTags.illegible],
    "LostLines!": [leidenTags.keyword, leidenTags.lostLines],

    "GapOmitted/< Gap/[": [leidenTags.bracketedKeywordStart, leidenTags.gap],
    "GapOmitted GapOmitted/GapNums! Gap Gap/GapNums!": [leidenTags.bracketedKeywordContent, leidenTags.gap],
    "GapOmitted/CertLow Gap/CertLow": [leidenTags.bracketedKeywordContent, leidenTags.lowCertaintyMarker],
    "GapOmitted/> Gap/]": [leidenTags.bracketedKeywordEnd, leidenTags.gap],

    "OmittedLanguage/UntranscribedStart": [leidenTags.bracketedKeywordStart, leidenTags.omittedLanguage],
    "OmittedLanguage": [leidenTags.bracketedKeywordContent, leidenTags.omittedLanguage],
    "OmittedLanguage/GapNums! OmittedLanguage/QuestionMark": [leidenTags.bracketedKeywordContent, leidenTags.omittedLanguage, leidenTags.omittedLanguageQuantity],
    "OmittedLanguage/Language": [leidenTags.bracketedKeywordContent, leidenTags.omittedLanguage, leidenTags.omittedLanguageLanguage],
    "OmittedLanguage/UntranscribedEnd": [leidenTags.bracketedKeywordEnd, leidenTags.omittedLanguage],

    "Untranscribed/UntranscribedStart": [leidenTags.bracketedKeywordStart, leidenTags.untranscribed],
    "Untranscribed": [leidenTags.bracketedKeywordContent, leidenTags.untranscribed],
    "Untranscribed/GapNums! Untranscribed/QuestionMark": [leidenTags.bracketedKeywordContent, leidenTags.untranscribed, leiden.untranscribedQuantity],
    "Untranscribed/UntranscribedEnd": [leidenTags.bracketedKeywordEnd, leidenTags.untranscribed],

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

    "Abbrev Abbrev/Text! Abbrev/*/SupralineMacronContent": [leidenTags.abbrev],
    "Abbrev/Delims": [leidenTags.bracket, leidenTags.abbrev],
    "Abbrev/Unclear Abbrev/Supraline/SupralineUnclear": [leiden.abbrev, leiden.unclear],
    "AbbrevInnerEx/*/Expansion": leidenTags.expansion,
    "AbbrevInnerExContent/QuestionMark": leidenTags.lowCertaintyMarker,
    "AbbrevInnerEx/Delims": [leidenTags.bracket, leidenTags.expansion],
    "AbbrevInnerSuppliedLost/Delims AbbrevInnerSuppliedLost/Text!": [leidenTags.suppliedLost],

    "SuppliedLost/Text! SuppliedLost/*/SupralineMacronContent": leidenTags.suppliedLost,
    "SuppliedLost/[ SuppliedLost/]": [leidenTags.suppliedLost, leidenTags.bracket],
    "SuppliedLost/Unclear SuppliedLost/Supraline/SupralineUnclear": [leiden.suppliedLost, leiden.unclear],
    "AbbrevInnerSuppliedLost/Text! AbbrevInnerSuppliedLost/*/SupralineMacronContent": leidenTags.suppliedLost,
    "AbbrevInnerSuppliedLost/[ AbbrevInnerSuppliedLost/]": [leidenTags.suppliedLost, leidenTags.bracket],
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

    "NumberSpecial NumberSpecialTick NumberSpecial/Delims NumberSpecialTick/Delims NumberSpecial/*/SupralineMacronContent NumberSpecialTick/*/SupralineMacronContent": [leidenTags.number, leidenTags.bracket],
    "NumberSpecial/Text! NumberSpecialTick/Text!": [leidenTags.numberSymbol],
    "NumberSpecialValue! FracPart! FracNoValue! RangePart!": [leidenTags.numberValue],
    "NumberSpecial/Unclear NumberSpecialTick/Unclear NumberSpecial/Supraline/SupralineUnclear NumberSpecialTick/Supraline/SupralineUnclear": [leiden.number, leiden.unclear],


    "Glyph!": [leidenTags.glyph],
    "Filler!": [leidenTags.glyph],

    "AbbrevUnresolved AbbrevUnresolved/Text! AbbrevUnresolved/*/SupralineMacronContent": [leidenTags.abbrevUnresolved],
    "AbbrevUnresolved/Delims!": [leidenTags.abbrevUnresolved, leidenTags.bracket],
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


    "Surplus Surplus/Text! Surplus/*/SupralineMacronContent": leidenTags.surplus,
    "Surplus/Delims!": [leidenTags.surplus, leiden.bracket],
    "Surplus/Unclear Surplus/Supraline/SupralineUnclear": [leiden.surplus, leiden.unclear],


    "Deletion Deletion/Content/Text! Deletion/Content/*/SupralineMacronContent": leidenTags.erasureContent,
    "Deletion/Delims!": [leidenTags.erasure, leiden.bracket],
    "Deletion/Content/Unclear Deletion/Content/*/SupralineUnclear": [leiden.erasure, leiden.unclear],


    "InsertionAbove InsertionAbove/Text! InsertionAbove/*/SupralineMacronContent": [leidenTags.insertionAbove],
    "InsertionAbove/Delims!": [leidenTags.insertionAbove, leiden.bracket],
    "InsertionAbove/Unclear InsertionAbove/Supraline/SupralineUnclear": [leidenTags.insertionAbove, leiden.unclear],
    "InsertionBelow InsertionBelow/Text! InsertionBelow/*/SupralineMacronContent": [leidenTags.insertionBelow],
    "InsertionBelow/Delims!": [leidenTags.insertionBelow, leiden.bracket],
    "InsertionBelow/Unclear InsertionBelow/Supraline/SupralineUnclear": [leidenTags.insertionBelow, leiden.unclear],
    "InsertionMargin InsertionMargin/Text! InsertionMargin/*/SupralineMacronContent": [leidenTags.insertionMargin],
    "InsertionMargin/Delims!": [leidenTags.insertionMargin, leiden.bracket],
    "InsertionMargin/Unclear InsertionMargin/Supraline/SupralineUnclear": [leidenTags.insertionMargin, leiden.unclear],
    "InsertionMarginSling InsertionMarginSling/Text! InsertionMarginSling/*/SupralineMacronContent": [leidenTags.insertionMarginSling],
    "InsertionMarginSling/Delims!": [leidenTags.insertionMarginSling, leiden.bracket],
    "InsertionMarginSling/Unclear InsertionMarginSling/Supraline/SupralineUnclear": [leidenTags.insertionMarginSling, leiden.unclear],
    "InsertionMarginUnderline InsertionMarginUnderline/Text! InsertionMarginUnderline/*/SupralineMacronContent": [leidenTags.insertionMarginUnderline],
    "InsertionMarginUnderline/Delims!": [leidenTags.insertionMarginUnderline, leiden.bracket],
    "InsertionMarginUnderline/Unclear InsertionMarginUnderline/Supraline/SupralineUnclear": [leidenTags.insertionMarginUnderline, leiden.unclear],

    "TextSuperscript TextSuperscript/Text! TextSuperscript/*/SupralineMacronContent": [leidenTags.superscript],
    "TextSuperscript/Delims!": [leidenTags.superscript, leiden.bracket],
    "TextSuperscript/Unclear TextSuperscript/Supraline/SupralineUnclear": [leidenTags.superscript, leiden.unclear],
    "TextSubscript TextSubscript/Text! TextSubscript/*/SupralineMacronContent": [leidenTags.subscript],
    "TextSubscript/Delims!": [leidenTags.subscript, leidenTags.bracket],
    "TextSubscript/Unclear TextSubscript/Supraline/SupralineUnclear": [leidenTags.subscript, leiden.unclear],
    "Supraline Supraline/Text! Supraline/*/SupralineMacronContent": [leidenTags.supraline],
    "Supraline/Delims!": [leidenTags.supraline, leiden.bracket],
    "Supraline/Unclear Supraline/Supraline/SupralineUnclear": [leidenTags.supraline, leiden.unclear],
    "SupralineUnderline SupralineUnderline/Text! SupralineUnderline/*/SupralineMacronContent": [leidenTags.supralineUnderline],
    "SupralineUnderline/Delims!": [leidenTags.supralineUnderline, leidenTags.bracket],
    "SupralineUnderline/Unclear SupralineUnderline/Supraline/SupralineUnclear": [leidenTags.supralineUnderline, leiden.unclear],
    "TextTall TextTall/Text! TextTall/*/SupralineMacronContent": [leidenTags.tall],
    "TextTall/Delims!": [leidenTags.tall, leidenTags.bracket],
    "TextTall/Unclear TextTall/Supraline/SupralineUnclear": [leidenTags.tall, leiden.unclear],

    "EditorialNote EditorialNote/Text! EditorialNote/*/SupralineMacronContent": leidenTags.editorialNote,
    "EditorialNote/Delims!": [leidenTags.editorialNote, leidenTags.bracket],
    "EditorialNote/Unclear EditorialNote/Supraline/SupralineUnclear": [leidenTags.editorialNote, leiden.unclear],
    "Quotation Quotation/Text! Quotation/*/SupralineMacronContent": leiden.quotation,
    "Quotation/Delims!": [leiden.quotation, leiden.bracket],
    "Quotation/Unclear Quotation/Supraline/SupralineUnclear": [leiden.quotation, leiden.unclear],


    "LineBreak! LineBreakSpecial!": leidenTags.lineNumber,
    "LineBreakWrapped!  LineBreakSpecialWrapped!": [leidenTags.lineNumberWrap],

    "Milestone": leidenTags.milestone,

    "Diacritical": [leidenTags.diacritical],
    "DiacriticSymbol": [leidenTags.diacritSymbol],
    "DiacritChar": [leidenTags.diacritChar],
    "Diacritical/Delims": [leidenTags.diacritParens, leidenTags.bracket],

    "Figure!": leidenTags.figure,
    "Handshift!": leidenTags.handshift,

    "CertLow": leidenTags.lowCertaintyMarker,

    "Orig Orig/OrigContent!": leiden.orig,
    "Orig/Delims!": [leiden.orig, leiden.bracket]
})
