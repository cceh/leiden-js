import { Snippets } from "@leiden-js/common/language";

export const snippets = {
    vestigChars: {
        template: "vestig.${num}char",
		completion: {
            label: "vestig.${num}char",
            displayLabel: "Vestiges",
            detail: "no. of chars",
            type: "keyword",
            info: "vestig.5char"
        }
    },
    vestigCharsRange: {
        template: "vestig.${from}-${to}char",
		completion: {
			label: "vestig.${from}-${to}char",
            displayLabel: "Vestiges",
            detail: "range of chars",
            type: "keyword",
            info: "vestig.5-10char"
        }
    },
    vestigCharsCa: {
        template: "vestig.ca.${num}char",
		completion: {
			label: "vestig.ca.${num}char",
            displayLabel: "Vestiges",
            detail: "approx. no. of chars",
            type: "keyword",
            info: "vestig.ca.5char"
        }
    },
    vestigLines: {
        template: "vestig.${num}lin",
		completion: {
			label: "vestig.${num}lin",
            displayLabel: "Vestiges",
            detail: "no. of lines",
            type: "keyword",
            info: "vestig.3lin"
        }
    },
    vestigLinesRange: {
        template: "vestig.${from}-${to}lin",
		completion: {
			label: "vestig.${from}-${to}lin",
            displayLabel: "Vestiges",
            detail: "range of lines",
            type: "keyword",
            info: "vestig.2-3lin"
        }
    },
    vestigLinesCa: {
        template: "vestig.ca.${num}lin",
		completion: {
			label: "vestig.ca.${num}lin",
            displayLabel: "Vestiges",
            detail: "approx. no. of lines",
            type: "keyword",
            info: "vestig.ca.3lin"
        }
    },
    vestigLinesUnknown: {
        template: "vestig.?lin",
		completion: {
			label: "vestig.?lin",
            displayLabel: "Vestiges",
            detail: "unknown no. of lines",
            type: "keyword",
            info: "vestig.?lin"
        }
    },

    abbreviation: {
        template: "((${expansion}))",
		completion: {
			label: "((${expansion}))",
            displayLabel: "Abbreviation",
            detail: "with expansion",
            type: "keyword",
            info: "(a(bc))"
        }
    },

    abbreviationUnresolved: {
        template: "(|${abbreviation}|)",
		completion: {
			label: "(|${abbreviation}|)",
            displayLabel: "Abbreviation",
            detail: "not resolved",
            type: "keyword",
            info: "(|a(bc)|)"
        }
    },



    gapLostChars: {
        template: "[.${num}]",
		completion: {
			label: "[.${num}]",
            displayLabel: "Lacuna",
            detail: "no. of lost chars",
            type: "keyword",
            info: "[.3]"
        }
    },
    gapLostCharsRange: {
        template: "[.${from}-${to}]",
		completion: {
			label: "[.${from}-${to}]",
            displayLabel: "Lacuna",
            detail: "range of lost chars",
            type: "keyword",
            info: "[.2-4]"
        }
    },
    gapLostCharsCa: {
        template: "[ca.${num}]",
		completion: {
			label: "[ca.${num}]",
            displayLabel: "Lacuna",
            detail: "approx. no. of lost chars",
            type: "keyword",
            info: "[ca.3]"
        }
    },
    gapLostCharsUnknown: {
        template: "[.?]",
		completion: {
			label: "[.?]",
            displayLabel: "Lacuna",
            detail: "unknown no. of lost chars",
            type: "keyword",
            info: "[.?]"
        }
    },

    gapLostLines: {
        template: "lost.${num}lin",
		completion: {
			label: "lost.${num}lin",
            displayLabel: "Lacuna",
            detail: "no. of lost lines",
            type: "keyword",
            info: "lost.3lin"
        }
    },
    gapLostLinesRange: {
        template: "lost.${from}-${to}lin",
		completion: {
			label: "lost.${from}-${to}lin",
            displayLabel: "Lacuna",
            detail: "range of lost lines",
            type: "keyword",
            info: "lost.2-4lin"
        }
    },
    gapLostLinesCa: {
        template: "lost.ca.${num}lin",
		completion: {
			label: "lost.ca.${num}lin",
            displayLabel: "Lacuna",
            detail: "approx. no. of lost lines",
            type: "keyword",
            info: "lost.ca.3lin"
        }
    },
    gapLostLinesUnknown: {
        template: "lost.?lin",
		completion: {
			label: "lost.?lin",
            displayLabel: "Lacuna",
            detail: "unknown no. of lost lines",
            type: "keyword",
            info: "lost.?lin"
        }
    },

    gapOmittedChars: {
        template: "<.${num}>",
		completion: {
			label: "<.${num}>",
            displayLabel: "Omission",
            detail: "no. of omitted chars",
            info: "<.3>"
        }
    },
    gapOmittedCharsUnknown: {
        template: "<.?>",
		completion: {
			label: "<.?>",
            displayLabel: "Omission",
            detail: "unknown no. of omitted chars",
            info: "<.?>"
        }
    },

    vacatChars: {
        template: "vac.${num}",
		completion: {
			label: "vac.${num}",
            displayLabel: "Vacat",
            detail: "no. of lost chars",
            type: "keyword",
            info: "vac.3"
        }
    },
    vacatCharsRange: {
        template: "vac.${from}-${to}",
		completion: {
			label: "vac.${from}-${to}",
            displayLabel: "Vacat",
            detail: "range of lost chars",
            type: "keyword",
            info: "vac.2-4"
        }
    },
    vacatCharsCa: {
        template: "vac.ca.${num}",
		completion: {
			label: "vac.ca.${num}",
            displayLabel: "Vacat",
            detail: "approx. no. of lost chars",
            type: "keyword",
            info: "vac.ca.3"
        }
    },
    vacatCharsUnknown: {
        template: "vac.?",
		completion: {
			label: "vac.?",
            displayLabel: "Vacat",
            detail: "unknown no. of lost chars",
            type: "keyword",
            info: "vac.?"
        }
    },
    vacatLines: {
        template: "vac.${num}lin",
		completion: {
			label: "vac.${num}lin",
            displayLabel: "Vacat",
            detail: "no. of lost lines",
            type: "keyword",
            info: "vac.3lin"
        }
    },
    vacatLinesRange: {
        template: "vac.${from}-${to}lin",
		completion: {
			label: "vac.${from}-${to}lin",
            displayLabel: "Vacat",
            detail: "range of lost lines",
            type: "keyword",
            info: "vac.2-4lin"
        }
    },
    vacatLinesCa: {
        template: "vac.ca.${num}lin",
		completion: {
			label: "vac.ca.${num}lin",
            displayLabel: "Vacat",
            detail: "approx. no. of lost lines",
            type: "keyword",
            info: "vac.ca.3lin"
        }
    },
    vacatLinesUnknown: {
        template: "vac.?lin",
		completion: {
			label: "vac.?lin",
            displayLabel: "Vacat",
            detail: "unknown no. of lost lines",
            type: "keyword",
            info: "vac.?lin"
        }
    },

    illegibleChars: {
        template: ".${num}",
		completion: {
			label: ".${num}",
            displayLabel: "Illegible",
            detail: "no. of chars",
            type: "keyword",
            info: ".2"
        }
    },
    illegibleCharsRange: {
        template: ".${from}-${to}",
		completion: {
			label: ".${from}-${to}",
            displayLabel: "Illegible",
            detail: "range of chars",
            type: "keyword",
            info: ".2-4"
        }
    },
    illegibleCharsCa: {
        template: "ca.${num}",
		completion: {
			label: "ca.${num}",
            displayLabel: "Illegible",
            detail: "approx. no. of chars",
            type: "keyword",
            info: "ca.3"
        }
    },
    illegibleCharsUnknown: {
        template: ".?",
		completion: {
			label: ".?",
            displayLabel: "Illegible",
            detail: "unknown no. of chars",
            type: "keyword",
            info: ".?"
        }
    },
    illegibleLines: {
        template: ".${num}lin",
		completion: {
			label: ".${num}lin",
            displayLabel: "Illegible",
            detail: "no. of lines",
            type: "keyword",
            info: ".2lin"
        }
    },
    illegibleLinesRange: {
        template: ".${from}-${to}lin",
		completion: {
			label: ".${from}-${to}lin",
            displayLabel: "Illegible",
            detail: "range of lines",
            type: "keyword",
            info: ".2-4lin"
        }
    },
    illegibleLinesCa: {
        template: "ca.${num}lin",
		completion: {
			label: "ca.${num}lin",
            displayLabel: "Illegible",
            detail: "approx. no. of lines",
            type: "keyword",
            info: "ca.3lin"
        }
    },

    nonTranscribedLanguageChars: {
        template: "(Lang: ${Language} ${num} char)",
		completion: {
			label: "(Lang: ${Language} ${num} char)",
            displayLabel: "Non-transcribed language",
            detail: "no. of chars",
            info: "(Lang: Arabic 3 char)"
        }
    },
    nonTranscribedLanguageCharsUnknown: {
        template: "(Lang: ${Language} ? char)",
		completion: {
			label: "(Lang: ${Language} ? char)",
            displayLabel: "Non-transcribed language",
            detail: "unknown no. of chars",
            info: "(Lang: Arabic ? char)"
        }
    },
    nonTranscribedLanguageLines: {
        template: "(Lang: ${Language} ${num} lines)",
		completion: {
			label: "(Lang: ${Language} ${num} lines)",
            displayLabel: "Non-transcribed language",
            detail: "no. of lines",
            info: "(Lang: Arabic 3 lines)"
        }
    },
    nonTranscribedLanguageLinesCa: {
        template: "(Lang: ${Language} ca.${num} lines)",
		completion: {
			label: "(Lang: ${Language} ca.${num} lines)",
            displayLabel: "Non-transcribed language",
            detail: "approx. no. of lines",
            info: "(Lang: Arabic ca.3 lines)"
        }
    },
    nonTranscribedLanguageLinesUnknown: {
        template: "(Lang: ${Language} ? lines)",
		completion: {
			label: "(Lang: ${Language} ? lines)",
            displayLabel: "Non-transcribed language",
            detail: "unknown no. of lines",
            info: "(Lang: Arabic ? lines)"
        }
    },

    untranscribedChars: {
        template: "(Chars: ${num} non transcribed)",
		completion: {
			label: "(Chars: ${num} non transcribed)",
            displayLabel: "Untranscribed",
            detail: "no. of chars",
            info: "(Chars: 3 non transcribed)"
        }
    },
    untranscribedCharsRange: {
        template: "(Chars: ${from}-${to} non transcribed)",
		completion: {
			label: "(Chars: ${from}-${to} non transcribed)",
            displayLabel: "Untranscribed",
            detail: "range of chars",
            info: "(Chars: 2-4 non transcribed)"
        }
    },
    untranscribedCharsCa: {
        template: "(Chars: ca.${num} non transcribed)",
		completion: {
			label: "(Chars: ca.${num} non transcribed)",
            displayLabel: "Untranscribed",
            detail: "approx. no. of chars",
            info: "(Chars: ca.3 non transcribed)"
        }
    },
    untranscribedCharsUnknown: {
        template: "(Chars: ? non transcribed)",
		completion: {
			label: "(Chars: ? non transcribed)",
            displayLabel: "Untranscribed",
            detail: "unknown no. of chars",
            info: "(Chars: ? non transcribed)"
        }
    },
    untranscribedLines: {
        template: "(Lines: ${num} non transcribed)",
		completion: {
			label: "(Lines: ${num} non transcribed)",
            displayLabel: "Untranscribed",
            detail: "no. of lines",
            info: "(Lines: 3 non transcribed)"
        }
    },
    untranscribedLinesRange: {
        template: "(Lines: ${from}-${to} non transcribed)",
		completion: {
			label: "(Lines: ${from}-${to} non transcribed)",
            displayLabel: "Untranscribed",
            detail: "range of lines",
            info: "(Lines: 2-4 non transcribed)"
        }
    },
    untranscribedLinesCa: {
        template: "(Lines: ca.${num} non transcribed)",
		completion: {
			label: "(Lines: ca.${num} non transcribed)",
            displayLabel: "Untranscribed",
            detail: "approx. no. of lines",
            info: "(Lines: ca.3 non transcribed)"
        }
    },
    untranscribedLinesUnknown: {
        template: "(Lines: ? non transcribed)",
		completion: {
			label: "(Lines: ? non transcribed)",
            displayLabel: "Untranscribed",
            detail: "unknown no. of lines",
            info: "(Lines: ? non transcribed)"
        }
    },
    untranscribedColumns: {
        template: "(Column: ${num} non transcribed)",
		completion: {
			label: "(Column: ${num} non transcribed)",
            displayLabel: "Untranscribed",
            detail: "no. of columns",
            info: "(Column: 3 non transcribed)"
        }
    },
    untranscribedColumnsRange: {
        template: "(Column: ${from}-${to} non transcribed)",
		completion: {
			label: "(Column: ${from}-${to} non transcribed)",
            displayLabel: "Untranscribed",
            detail: "range of columns",
            info: "(Column: 2-4 non transcribed)"
        }
    },
    untranscribedColumnsCa: {
        template: "(Column: ca.${num} non transcribed)",
		completion: {
			label: "(Column: ca.${num} non transcribed)",
            displayLabel: "Untranscribed",
            detail: "approx. no. of columns",
            info: "(Column: ca.3 non transcribed)"
        }
    },
    untranscribedColumnsUnknown: {
        template: "(Column: ? non transcribed)",
		completion: {
			label: "(Column: ? non transcribed)",
            displayLabel: "Untranscribed",
            detail: "unknown no. of columns",
            info: "(Column: ? non transcribed)"
        }
    },

    glyph: {
        template: "*${glyph type}*",
		completion: {
			label: "*${glyph type}*",
            displayLabel: "Glyph",
            info: "*stauros*"
        }
    },
    filler: {
        template: "*filler(${extension})*",
		completion: {
			label: "*filler(${extension})*",
            displayLabel: "Filler",
            info: "*filler(extension)*"
        }
    },
    figure: {
        template: "#${figureDescription} ",
		completion: {
			label: "#${figureDescription} ",
            displayLabel: "Figure",
            info: "#seal*"
        }
    },

    textInBox: {
        template: "###",
		completion: {
			label: "###",
            displayLabel: "Text in box",
            info: "###"
        }
    },
    wavyLine: {
        template: "~~~~~~~~",
		completion: {
			label: "~~~~~~~~",
            displayLabel: "Wavy line",
            info: "~~~~~~~~"
        }
    },
    dipleObelismene: {
        template: ">---",
		completion: {
			label: ">---",
            displayLabel: "Diple obelismene",
            info: ">---"
        }
    },
    paragraphos: {
        template: "----",
		completion: {
			label: "----",
            displayLabel: "Paragraphos",
            info: "----"
        }
    },
    horizontalRule: {
        template: "--------",
		completion: {
			label: "--------",
            displayLabel: "Horizontal rule",
            info: "--------"
        }
    },
    coronis: {
        template: "-$$-",
		completion: {
			label: "-$$-",
            displayLabel: "Coronis",
            info: "-$$-"
        }
    },

    diacritical: {
        template: " ${char}(${symbol}})",
        completion: {
            label: " ${char}(${symbol}})",
            displayLabel: "Ancient diacritical",
            info: " ὑ(¨)"
        }
    },

    handShift: {
        template: "$m${num} ",
		completion: {
			label: "$m${num} ",
            displayLabel: "Hand shift",
            info: "$m2 "
        }
    },

    number: {
        template: "<#${symbol or text on papyrus}=${numeric value}#>",
		completion: {
			label: "<#${symbol or text on papyrus}=${numeric value}#>",
            displayLabel: "Number",
            detail: "number",
            info: "<#κε=25#>"
        }
    },
    numberFraction: {
        template: "<#${symbol or text on papyrus}=${numerator}/${denominator}#>",
		completion: {
			label: "<#${symbol or text on papyrus}=${numerator}/${denominator}#>",
            displayLabel: "Number",
            detail: "fraction",
            info: "<#𐅵=1/2#>"
        }
    },
    numberFractionUnknown: {
        template: "<#${symbol or text on papyrus}=frac#>",
		completion: {
			label: "<#${symbol or text on papyrus}=frac#>",
            displayLabel: "Number",
            detail: "fraction, unknown",
            info: "<#.1=frac#>"
        }
    },
    numberRange: {
        template: "<#${symbol or text on papyrus}=${from}-${to}#>",
		completion: {
			label: "<#${symbol or text on papyrus}=${from}-${to}#>",
            displayLabel: "Number",
            detail: "range",
            info: "<#[.1]=1-9#>"
        }
    },
    numberRangeUnknownEnd: {
        template: "<#${symbol or text on papyrus}=${from}-?#>",
		completion: {
			label: "<#${symbol or text on papyrus}=${from}-?#>",
            displayLabel: "Number",
            detail: "range, open end",
            info: "<#φβ=502-?#>"
        }
    },

    numberTick: {
        template: "<#${symbol or text on papyrus} '=${numeric value}#>",
		completion: {
			label: "<#${symbol or text on papyrus} '=${numeric value}#>",
            displayLabel: "Number",
            detail: "with tick",
            info: "<#α '=1#>"
        }
    },
    numberTickFraction: {
        template: "<#${symbol or text on papyrus} '=${numerator}/${denominator}#>",
		completion: {
			label: "<#${symbol or text on papyrus} '=${numerator}/${denominator}#>",
            displayLabel: "Number",
            detail: "with tick, fraction",
            info: " <#δ '=1/4#>"
        }
    },
    numberTickFractionUnknown: {
        template: "<#${symbol or text on papyrus} '=frac#>",
		completion: {
			label: "<#${symbol or text on papyrus} '=frac#>",
            displayLabel: "Number",
            detail: "with tick, fraction, unknown",
            info: "<#.1 '=frac#>"
        }
    },

    editorialNote: {
        template: "/*${note}*/",
		completion: {
			label: "/*${note}*/",
            displayLabel: "Editorial note",
            info: "/*note*/"
        }
    },
    editorialNoteRef: {
        template: "/*${note} (ref=${reference id}=${reference title})*/",
		completion: {
			label: "/*${note} (ref=${reference id}=${reference title})*/",
            displayLabel: "Editorial note",
            detail: "with reprint reference",
            info: "/*FrE (ref=sb;26;16691=SB 26 16691)*/"
        }
    },
    quotation: {
        template: "\"quoted text\"",
		completion: {
			label: "\"quoted text\"",
            displayLabel: "Quotation",
            info: "\"abc\""
        }
    },
    surplus: {
        template: "{${surplus text}}",
		completion: {
			label: "{${surplus text}}",
            displayLabel: "Surplus text",
            detail: "deleted by editor",
            info: "{abc}"
        }
    },

    textTall: {
        template: "~||${tall text}||~tall",
		completion: {
			label: "~||${tall text}||~tall",
            displayLabel: "Tall text",
            info: "~||abc||~tall"
        }
    },
    textSuperscript: {
        template: "|^${superscript text}^|",
		completion: {
			label: "|^${superscript text}^|",
            displayLabel: "Superscript text",
            info: "|^abc^|"
        }
    },
    textSubscript: {
        template: "\\|${subscript text}|/",
		completion: {
			label: "\\|${subscript text}|/",
            displayLabel: "Subscript text",
            info: "\\|abc|/"
        }
    },
    textSupraline: {
        template: "¯${supraline text}¯",
		completion: {
			label: "¯${supraline text}¯",
            displayLabel: "Supralined text",
            info: "¯abc¯"
        }
    },
    textSupralineUnderline: {
        template: "¯_${supralined and underlined text}_¯",
		completion: {
			label: "¯_${supralined and underlined text}_¯",
            displayLabel: "Supralined and underlined text",
            info: "¯_abc_¯"
        }
    },

    insertionAbove: {
        template: "\\${text inserted above}/",
		completion: {
			label: "\\${text inserted above}/",
            displayLabel: "Insertion",
            detail: "above",
            info: "\\abc/"
        }
    },
    insertionBelow: {
        template: "//${text inserted below}\\\\",
		completion: {
			label: "//${text inserted below}\\\\",
            displayLabel: "Insertion",
            detail: "below",
            info: "//abc\\\\"
        }
    },
    insertionMargin: {
        template: "||margin:${inserted text}||",
		completion: {
			label: "||margin:${inserted text}||",
            displayLabel: "Marginal insertion",
            detail: "other",
            info: "||margin:abc||"
        }
    },
    insertionMarginUnderline: {
        template: "<_${inserted text}_>",
		completion: {
			label: "<_${inserted text}_>",
            displayLabel: "Marginal insertion",
            detail: "with underline",
            info: "<_abc_>"
        }
    },
    insertionMarginLeft: {
        template: "||left:${inserted text}||",
		completion: {
			label: "||left:${inserted text}||",
            displayLabel: "Marginal insertion",
            detail: "left margin",
            info: "||left:abc||"
        }
    },
    insertionMarginRight: {
        template: "||right:${inserted text}||",
		completion: {
			label: "||right:${inserted text}||",
            displayLabel: "Marginal insertion",
            detail: "right margin",
            info: "||right:abc||"
        }
    },
    insertionMarginTop: {
        template: "||top:${inserted text}||",
		completion: {
			label: "||top:${inserted text}||",
            displayLabel: "Marginal insertion",
            detail: "top margin",
            info: "||top:abc||"
        }
    },
    insertionMarginBottom: {
        template: "||bottom:${inserted text}||",
		completion: {
			label: "||bottom:${inserted text}||",
            displayLabel: "Marginal insertion",
            detail: "bottom margin",
            info: "||bottom:abc||"
        }
    },
    insertionInterlinear: {
        template: "||interlin:${inserted text}||",
		completion: {
			label: "||interlin:${inserted text}||",
            displayLabel: "Interlinear insertion",
            info: "||interlin:abc||"
        }
    },
    insertionMarginSling: {
        template: "<|${inserted text}|>",
		completion: {
			label: "<|${inserted text}|>",
            displayLabel: "Marginal insertion",
            detail: "with sling",
            info: "<|abc|>"
        }
    },

    deletion: {
        template: "〚${deleted text}〛",
		completion: {
			label: "〚${deleted text}〛",
            displayLabel: "Deletion",
            detail: "",
            info: "〚abc〛"
        }
    },
    deletionSlashes: {
        template: "〚/${deleted text}〛",
		completion: {
			label: "〚/${deleted text}〛",
            displayLabel: "Deletion",
            detail: "by slashes (///)",
            info: "〚/abc〛"
        }
    },
    deletionCrossStrokes: {
        template: "〚X${deleted text}〛",
		completion: {
			label: "〚X${deleted text}〛",
            displayLabel: "Deletion",
            detail: "by cross strokes (XXX)",
            info: "〚Xabc〛"
        }
    },


    suppliedLost: {
        template: "[${supplied text lost in lacuna}]",
		completion: {
			label: "[${supplied text lost in lacuna}]",
            displayLabel: "Supplied",
            detail: "reason: lost in lacuna",
            info: "[abc]"
        }
    },
    suppliedLostParallel: {
        template: "_[${supplied text lost in lacuna}]_",
		completion: {
			label: "_[${supplied text lost in lacuna}]_",
            displayLabel: "Supplied",
            detail: "reason: lost in lacuna, parallel evidence",
            info: "_[abc]_"
        }
    },
    suppliedParallel: {
        template: "|_${supplied lost text}_|",
		completion: {
			label: "|_${supplied lost text}_|",
            displayLabel: "Supplied",
            detail: "reason: unknown, parallel evidence",
            info: "|_abc_|"
        }
    },
    suppliedOmitted: {
        template: "<${supplied text omitted by scribe}>",
		completion: {
			label: "<${supplied text omitted by scribe}>",
            displayLabel: "Supplied",
            detail: "reason: omitted by scribe",
            info: "<abc>"
        }
    },


    modernRegularization: {
        template: "<:${regularized form}|reg|${non-standard form}:>",
		completion: {
			label: "<:${regularized form}|reg|${non-standard form}:>",
            displayLabel: "Modern regularization", // of ancient reading,
            info: "<:abc|reg|orig:>"
        }
    },

    modernCorrection: {
        template: "<:${corrected form}|corr|${incorrect form}:>",
		completion: {
			label: "<:${corrected form}|corr|${incorrect form}:>",
            displayLabel: "Modern correction", // of ancient error,
            info: "<:abc|corr|orig:>"
        }
    },
    scribalCorrection: {
        // Correct form, e.g. κ̣λήρου (with diacriticals and full Leiden)
        // Original form, e.g. δ̣ληρου (with full Leiden, but without diacriticals)
        template: "<:${correct form}|subst|${original form}:>",
		completion: {
			label: "<:${correct form}|subst|${original form}:>",
            displayLabel: "Scribal correction/substitution", // of ancient error,
            info: "<:abc|subst|orig:>"
        }
    },
    alternateReading: {
        // Preferred reading: e.g. ἐᾶ̣
        // Other possible reading: e.g. ἐᾶ[ι]
        template: "<:${preferred reading}|alt|${other possible reading}:>",
		completion: {
			label: "<:${preferred reading}|alt|${other possible reading}:>",
            displayLabel: "Alternate reading", // Alternate readings,
            info: "<:pref|alt|rdg:>"
        }
    },
    editorialCorrection: {
        // citations?
        template: "<:${correct form}|ed|${original, previous, incorrect form}:>",
		completion: {
			label: "<:${correct form}|ed|${original, previous, incorrect form}:>",
            displayLabel: "Editorial Correction",
            info: "<:abc|ed|orig:>"
        }
    },


    foreign: {
        template: "~|${foreign text}|~${lang} ",
		completion: {
			label: "~|${foreign text}|~${lang} ",
            displayLabel: "Foreign text",
            detail: "other language",
            info: "~|ϣ|~cop"
        }
    },
    foreignLatin: {
        template: "~|${latin text}|~la ",
		completion: {
			label: "~|${latin text}|~la ",
            displayLabel: "Foreign text",
            detail: "Latin",
            info: "~|abc|~la"
        }
    },
    foreignGreek: {
        template: "~|${greek text}|~grc ",
		completion: {
			label: "~|${greek text}|~grc ",
            displayLabel: "Foreign text",
            detail: "Greek",
            info: "~|αβγ|~grc"
        }
    },


    divisionRecto: {
        template: "<D=.r<=${text of recto}=>=D>",
		completion: {
			label: "<D=.r<=${text of recto}=>=D>",
            displayLabel: "Recto",
            info: "<D=.r<= abc =>=D>"
        }
    },
    divisionVerso: {
        template: "<D=.v<=${text of verso}=>=D>",
		completion: {
			label: "<D=.v<=${text of verso}=>=D>",
            displayLabel: "Verso",
            info: "<D=.v<= abc =>=D>"
        }
    },
    divisionColumn: {
        template: "<D=.${i}.column<=${text of column}=>=D>",
		completion: {
			label: "<D=.${i}.column<=${text of column}=>=D>",
            displayLabel: "Column",
            info: "<D=.1.column<= abc =>=D>"
        }
    },
    divisionFolio: {
        template: "<D=.${a}.folio<=${text of folio}=>=D>",
		completion: {
			label: "<D=.${a}.folio<=${text of folio}=>=D>",
            displayLabel: "Folio",
            info: "<D=.a.folio<= abc =>=D>"
        }
    },
    divisionFragment: {
        template: "<D=.${a}.fragment<=${text of fragment}=>=D>",
		completion: {
			label: "<D=.${a}.fragment<=${text of fragment}=>=D>",
            displayLabel: "Fragment",
            info: "<D=.a.fragment<= abc =>=D>"
        }
    },
    divisionOther: {
        template: "<D=.${num}.${type}<=${text of division}=>=D>",
		completion: {
			label: "<D=.${num}.${type}<=${text of division}=>=D>",
            displayLabel: "Other",
            info: "<D=.1.column<= abc =>=D>"
        }
    },
    divisionOtherRef: {
        template: "<D=.${num}.${type}.#${ref}<=${text of division}=>=D>",
		completion: {
			label: "<D=.${num}.${type}.#${ref}<=${text of division}=>=D>",
            displayLabel: "Other",
            detail: "with reference",
            info: "<D=.1.column.1=1=1<= abc =>=D>"
        }
    },

    lineNumber: {
        template: "${num}. ",
		completion: {
			label: "${num}. ",
            displayLabel: "Line number",
            info: "1."
        }
    },
    lineNumberBreak: {
        template: "${num}.- ",
		completion: {
			label: "${num}.- ",
            displayLabel: "Line number",
            detail: "with word break",
            info: "1.-"
        }
    },

    lineNumberMarginLeft: {
        template: "${num},ms. ",
		completion: {
			label: "${num},ms. ",
            displayLabel: "Line number",
            detail: "line written in left margin",
            info: "3.,ms."
        }
    },
    lineNumberMarginRight: {
        template: "${num},md. ",
		completion: {
			label: "${num},md. ",
            displayLabel: "Line number",
            detail: "line written in right margin",
            info: "3.,md."
        }
    },
    lineNumberMarginUpper: {
        template: "${num},msup. ",
		completion: {
			label: "${num},msup. ",
            displayLabel: "Line number",
            detail: "line written in upper margin",
            info: "3.,msup."
        }
    },
    lineNumberMarginLower: {
        template: "${num},minf. ",
		completion: {
			label: "${num},minf. ",
            displayLabel: "Line number",
            detail: "line written in lower margin",
            info: "3.,minf."
        }
    },

    lineNumberMarginPerpendicularLeft: {
        template: "(${num},ms, perpendicular)",
        completion: {
            label: "(${num},ms, perpendicular)",
            displayLabel: "Line number",
            detail: "line written in left margin perpendicular to text",
            info: "(8,ms, perpendicular)"
        }
    },
    lineNumberMarginPerpendicularRight: {
        template: "(${num},md, perpendicular)",
		completion: {
			label: "(${num},md, perpendicular)",
            displayLabel: "Line number",
            detail: "line written in right margin perpendicular to text",
            info: "(8,md, perpendicular)"
        }
    },
    lineNumberMarginInverseLower: {
        template: "(${num},minf, inverse)",
		completion: {
			label: "(${num},minf, inverse)",
            displayLabel: "Line number",
            detail: "line written in lower margin inverse to text",
            info: "(16,minf, inverse)"
        }
    },

    lineNumberPerpendicular: {
        template: "(${num}, perpendicular)",
		completion: {
			label: "(${num}, perpendicular)",
            displayLabel: "Line number",
            detail: "line written perpendicular to text",
            info: "(2, perpendicular)"
        }
    },
    lineNumberInverse: {
        template: "(${num}, inverse)",
		completion: {
			label: "(${num}, inverse)",
            displayLabel: "Line number",
            detail: "line written inverse to text",
            info: "(2, inverse)"
        }
    },
    lineNumberIndented: {
        template: "(${num}, indent)",
		completion: {
			label: "(${num}, indent)",
            displayLabel: "Line number",
            detail: "line indented (i.e., in eisthesis) to text",
            info: "(2, indent)"
        }
    },
    lineNumberOutdented: {
        template: "(${num}, outdent)",
		completion: {
			label: "(${num}, outdent)",
            displayLabel: "Line number",
            detail: "line outdented (i.e., in ekthesis) to text",
            info: "(2, outdent)"
        }
    }


} satisfies Snippets;
