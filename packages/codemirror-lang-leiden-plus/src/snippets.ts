import {Completion, snippet, snippetCompletion} from "@codemirror/autocomplete";

export const snippets: Record<string, {
    template: string,
    completion: Completion
}> = {
    vestigChars: {
        template: "vestig.${num}char",
        completion: {
            label: "Vestiges",
            detail: "no. of chars",
            type: "keyword"
        }
    },
    vestigCharsRange: {
        template: "vestig.${from}-${to}char",
        completion: {
            label: "Vestiges",
            detail: "range of chars",
            type: "keyword"
        }
    },
    vestigCharsCa: {
        template: "vestig.ca.${num}char",
        completion: {
            label: "Vestiges",
            detail: "approx. no. of chars",
            type: "keyword"}
    },
    vestigLines: {
        template: "vestig.${num}lin",
        completion: {
            label: "Vestiges",
            detail: "no. of lines",
            type: "keyword"
        }
    },
    vestigLinesRange: {
        template: "vestig.${from}-${to}lin",
        completion: {
            label: "Vestiges",
            detail: "range of lines",
            type: "keyword"
        }
    },
    vestigLinesCa: {
        template: "vestig.ca.${num}lin",
        completion: {
            label: "Vestiges",
            detail: "approx. no. of lines",
            type: "keyword"
        }
    },
    vestigLinesUnknown: {
        template: "vestig.?lin",
        completion: {
            label: "Vestiges",
            detail: "unknown no. of lines",
            type: "keyword"
        }
    },

    abbreviation: {
        template: "((${expansion}))",
        completion: {
            label: "Abbreviation",
            detail: "with expansion",
            type: "keyword"
        }
    },

    abbreviationUnresolved: {
        template: "(|${abbreviation}|)",
        completion: {
            label: "Abbreviation",
            detail: "not resolved",
            type: "keyword"
        }
    },



    gapLostChars: {
        template: "[.${num}]",
        completion: {
            label: "Lacuna",
            detail: "no. of lost chars",
            type: "keyword"
        }
    },
    gapLostCharsRange: {
        template: "[.${from}-${to}]",
        completion: {
            label: "Lacuna",
            detail: "range of lost chars",
            type: "keyword"
        }
    },
    gapLostCharsCa: {
        template: "[ca.${num}]",
        completion: {
            label: "Lacuna",
            detail: "approx. no. of lost chars",
            type: "keyword"
        }
    },
    gapLostCharsUnknown: {
        template: "[.?]",
        completion: {
            label: "Lacuna",
            detail: "unknown no. of lost chars",
            type: "keyword"
        }
    },

    gapLostLines: {
        template: "lost.${num}lin",
        completion: {
            label: "Lacuna",
            detail: "no. of lost lines",
            type: "keyword"
        }
    },
    gapLostLinesRange: {
        template: "lost.${from}-${to}lin",
        completion: {
            label: "Lacuna",
            detail: "range of lost lines",
            type: "keyword"
        }
    },
    gapLostLinesCa: {
        template: "lost.ca.${num}lin",
        completion: {
            label: "Lacuna",
            detail: "approx. no. of lost lines",
            type: "keyword"
        }
    },
    gapLostLinesUnknown: {
        template: "lost.?lin",
        completion: {
            label: "Lacuna",
            detail: "unknown no. of lost lines",
            type: "keyword"
        }
    },

    gapOmittedChars: {
        template: "<.${num}>",
        completion: {
            label: "Omission",
            detail: "no. of omitted chars",
        }
    },
    gapOmittedCharsUnknown: {
        template: "<.?>",
        completion: {
            label: "Omission",
            detail: "unknown no. of omitted chars",
        }
    },

    vacatChars: {
        template: "vac.${num}",
        completion: {
            label: "Vacat",
            detail: "no. of lost chars",
            type: "keyword"
        }
    },
    vacatCharsRange: {
        template: "vac.${from}-${to}",
        completion: {
            label: "Vacat",
            detail: "range of lost chars",
            type: "keyword"
        }
    },
    vacatCharsCa: {
        template: "vac.ca.${num}",
        completion: {
            label: "Vacat",
            detail: "approx. no. of lost chars",
            type: "keyword"
        }
    },
    vacatCharsUnknown: {
        template: "vac.?",
        completion: {
            label: "Vacat",
            detail: "unknown no. of lost chars",
            type: "keyword"
        }
    },
    vacatLines: {
        template: "vac.${num}lin",
        completion: {
            label: "Vacat",
            detail: "no. of lost lines",
            type: "keyword"
        }
    },
    vacatLinesRange: {
        template: "vac.${from}-${to}lin",
        completion: {
            label: "Vacat",
            detail: "range of lost lines",
            type: "keyword"
        }
    },
    vacatLinesCa: {
        template: "vac.ca.${num}lin",
        completion: {
            label: "Vacat",
            detail: "approx. no. of lost lines",
            type: "keyword"
        }
    },
    vacatLinesUnknown: {
        template: "vac.?lin",
        completion: {
            label: "Vacat",
            detail: "unknown no. of lost lines",
            type: "keyword"
        }
    },

    illegibleChars: {
        template: ".${num}",
        completion: {
            label: "Illegible",
            detail: "no. of chars",
            type: "keyword"
        }
    },
    illegibleCharsRange: {
        template: ".${from}-${to}",
        completion: {
            label: "Illegible",
            detail: "range of chars",
            type: "keyword"
        }
    },
    illegibleCharsCa: {
        template: "ca.${num}",
        completion: {
            label: "Illegible",
            detail: "approx. no. of chars",
            type: "keyword"
        }
    },
    illegibleCharsUnknown: {
        template: ".?",
        completion: {
            label: "Illegible",
            detail: "unknown no. of chars",
            type: "keyword"
        }
    },
    illegibleLines: {
        template: ".${num}lin",
        completion: {
            label: "Illegible",
            detail: "no. of lines",
            type: "keyword"
        }
    },
    illegibleLinesRange: {
        template: ".${from}-${to}lin",
        completion: {
            label: "Illegible",
            detail: "range of lines",
            type: "keyword"
        }
    },
    illegibleLinesCa: {
        template: "ca.${num}lin",
        completion: {
            label: "Illegible",
            detail: "approx. no. of lines",
            type: "keyword"
        }
    },

    nonTranscribedLanguageChars: {
        template: "(Lang: ${Language} ${num} char)",
        completion: {
            label: "Non-transcribed language",
            detail: "no. of chars",
        }
    },
    nonTranscribedLanguageCharsUnknown: {
        template: "(Lang: ${Language} ? char)",
        completion: {
            label: "Non-transcribed language",
            detail: "unknown no. of chars",
        }
    },
    nonTranscribedLanguageLines: {
        template: "(Lang: ${Language} ${num} lines)",
        completion: {
            label: "Non-transcribed language",
            detail: "no. of lines",
        }
    },
    nonTranscribedLanguageLinesCa: {
        template: "(Lang: ${Language} ca.${num} lines)",
        completion: {
            label: "Non-transcribed language",
            detail: "approx. no. of lines",
        }
    },
    nonTranscribedLanguageLinesUnknown: {
        template: "(Lang: ${Language} ? lines)",
        completion: {
            label: "Non-transcribed language",
            detail: "unknown no. of lines",
        }
    },

    untranscribedChars: {
        template: "(Chars: ${num} non transcribed)",
        completion: {
            label: "Untranscribed",
            detail: "no. of chars",
        }
    },
    untranscribedCharsRange: {
        template: "(Chars: ${from}-${to} non transcribed)",
        completion: {
            label: "Untranscribed",
            detail: "range of chars",
        }
    },
    untranscribedCharsCa: {
        template: "(Chars: ca.${num} non transcribed)",
        completion: {
            label: "Untranscribed",
            detail: "approx. no. of chars",
        }
    },
    untranscribedCharsUnknown: {
        template: "(Chars: ? non transcribed)",
        completion: {
            label: "Untranscribed",
            detail: "unknown no. of chars",
        }
    },
    untranscribedLines: {
        template: "(Lines: ${num} non transcribed)",
        completion: {
            label: "Untranscribed",
            detail: "no. of lines",
        }
    },
    untranscribedLinesRange: {
        template: "(Lines: ${from}-${to} non transcribed)",
        completion: {
            label: "Untranscribed",
            detail: "range of lines",
        }
    },
    untranscribedLinesCa: {
        template: "(Lines: ca.${num} non transcribed)",
        completion: {
            label: "Untranscribed",
            detail: "approx. no. of lines",
        }
    },
    untranscribedLinesUnknown: {
        template: "(Lines: ? non transcribed)",
        completion: {
            label: "Untranscribed",
            detail: "unknown no. of lines",
        }
    },
    untranscribedColumns: {
        template: "(Column: ${num} non transcribed)",
        completion: {
            label: "Untranscribed",
            detail: "no. of columns",
        }
    },
    untranscribedColumnsRange: {
        template: "(Column: ${from}-${to} non transcribed)",
        completion: {
            label: "Untranscribed",
            detail: "range of columns",
        }
    },
    untranscribedColumnsCa: {
        template: "(Column: ca.${num} non transcribed)",
        completion: {
            label: "Untranscribed",
            detail: "approx. no. of columns",
        }
    },
    untranscribedColumnsUnknown: {
        template: "(Column: ? non transcribed)",
        completion: {
            label: "Untranscribed",
            detail: "unknown no. of columns",
        }
    },

    glyph: {
        template: "*${glyph type}*",
        completion: {
            label: "Glyph"
        }
    },
    filler: {
        template: "*filler(${extension})*",
        completion: {
            label: "Filler"
        }
    },
    figure: {
        template: "#${figureDescription} ",
        completion: {
            label: "Figure"
        }
    },

    textInBox: {
        template: "###",
        completion: {
            label: "Text in box"
        }
    },
    wavyLine: {
        template: "~~~~~~~~",
        completion: {
            label: "Wavy line"
        }
    },
    dipleObelismene: {
        template: ">---",
        completion: {
            label: "Diple obelismene"
        }
    },
    paragraphos: {
        template: "----",
        completion: {
            label: "Paragraphos"
        }
    },
    horizontalRule: {
        template: "--------",
        completion: {
            label: "Horizontal rule"
        }
    },
    coronis: {
        template: "-$$-",
        completion: {
            label: "Coronis"
        }
    },

    diacritical: {
      template: " ${char}(${symbol}})",
      completion: {
          label: "Ancient diacritical"
      }
    },

    handShift: {
        template: "$m${num} ",
        completion: {
            label: "Hand shift"
        }
    },

    number: {
        template: "<#${symbol or text on papyrus}=${numeric value}#>",
        completion: {
            label: "Number",
            detail: "number"
        }
    },
    numberFraction: {
        template: "<#${symbol or text on papyrus}=${numerator}/${denominator}#>",
        completion: {
            label: "Number",
            detail: "fraction"
        }
    },
    numberFractionUnknown: {
        template: "<#${symbol or text on papyrus}=frac#>",
        completion: {
            label: "Number",
            detail: "fraction, unknown"
        }
    },
    numberRange: {
        template: "<#${symbol or text on papyrus}=${from}-${to}#>",
        completion: {
            label: "Number",
            detail: "range"
        }
    },
    numberRangeUnknownEnd: {
        template: "<#${symbol or text on papyrus}=${from}-?#>",
        completion: {
            label: "Number",
            detail: "range, open end"
        }
    },

    numberTick: {
        template: "<#${symbol or text on papyrus} '=${numeric value}#>",
        completion: {
            label: "Number",
            detail: "with tick"
        }
    },
    numberTickFraction: {
        template: "<#${symbol or text on papyrus} '=${numerator}/${denominator}#>",
        completion: {
            label: "Number",
            detail: "with tick, fraction"
        }
    },
    numberTickFractionUnknown: {
        template: "<#${symbol or text on papyrus} '=frac#>",
        completion: {
            label: "Number",
            detail: "with tick, fraction, unknown"
        }
    },

    editorialNote: {
        template: "/*${note}*/",
        completion: {
            label: "Editorial note"
        }
    },
    editorialNoteRef: {
        template: "/*${note} (ref=${reference id}=${reference title})*/",
        completion: {
            label: "Editorial note",
            detail: "with reprint reference"
        }
    },
    quotation: {
        template: "\"quoted text\"",
        completion: {
            label: "Quotation"
        }
    },
    surplus: {
        template: "{${surplus text}}",
        completion: {
            label: "Surplus text",
            detail: "deleted by editor"
        }
    },

    textTall: {
        template: "~||${tall text}||~tall",
        completion: {
            label: "Tall text"
        }
    },
    textSuperscript: {
        template: "|^${superscript text}^|",
        completion: {
            label: "Superscript text"
        }
    },
    textSubscript: {
        template: "\\|${subscript text}|/",
        completion: {
            label: "Subscript text"
        }
    },
    textSupraline: {
        template: "¯${supraline text}¯",
        completion: {
            label: "Supralined text"
        }
    },
    textSupralineUnderline: {
        template: "¯_${supralined and underlined text}_¯",
        completion: {
            label: "Supralined and underlined text"
        }
    },

    insertionAbove: {
        template: "\\${text inserted above}/",
        completion: {
            label: "Insertion",
            detail: "above"
        }
    },
    insertionBelow: {
        template: "//${text inserted below}\\\\",
        completion: {
            label: "Insertion",
            detail: "below"
        }
    },
    insertionMargin: {
        template: "||margin:${inserted text}||",
        completion: {
            label: "Marginal insertion",
            detail: "other"
        }
    },
    insertionMarginUnderline: {
        template: "<_${inserted text}_>",
        completion: {
            label: "Marginal insertion",
            detail: "with underline"
        }
    },
    insertionMarginLeft: {
        template: "||left:${inserted text}||",
        completion: {
            label: "Marginal insertion",
            detail: "left margin"
        }
    },
    insertionMarginRight: {
        template: "||right:${inserted text}||",
        completion: {
            label: "Marginal insertion",
            detail: "right margin"
        }
    },
    insertionMarginTop: {
        template: "||top:${inserted text}||",
        completion: {
            label: "Marginal insertion",
            detail: "top margin"
        }
    },
    insertionMarginBottom: {
        template: "||bottom:${inserted text}||",
        completion: {
            label: "Marginal insertion",
            detail: "bottom margin"
        }
    },
    insertionInterlinear: {
        template: "||interlin:${inserted text}||",
        completion: {
            label: "Interlinear insertion"
        }
    },
    insertionMarginSling: {
        template: "<|${inserted text}|>",
        completion: {
            label: "Marginal insertion",
            detail: "with sling"
        }
    },

    deletion: {
        template: "〚${deleted text}〛",
        completion: {
            label: "Deletion",
            detail: ""
        }
    },
    deletionSlashes: {
        template: "〚/${deleted text}〛",
        completion: {
            label: "Deletion",
            detail: "by slashes (///)"
        }
    },
    deletionCrossStrokes: {
        template: "〚X${deleted text}〛",
        completion: {
            label: "Deletion",
            detail: "by cross strokes (XXX)"
        }
    },


    suppliedLost: {
        template: "[${supplied text lost in lacuna}]",
        completion: {
            label: "Supplied",
            detail: "reason: lost in lacuna"
        }
    },
    suppliedLostParallel: {
        template: "_[${supplied text lost in lacuna}]_",
        completion: {
            label: "Supplied",
            detail: "reason: lost in lacuna, parallel evidence"
        }
    },
    suppliedParallel: {
        template: "|_${supplied lost text}_|",
        completion: {
            label: "Supplied",
            detail: "reason: unknown, parallel evidence"
        }
    },
    suppliedOmitted: {
        template: "<${supplied text omitted by scribe}>",
        completion: {
            label: "Supplied",
            detail: "reason: omitted by scribe"
        }
    },


    modernRegularization: {
        template: "<:${regularized form}|reg|${non-standard form}:>",
        completion: {
            label: "Modern regularization" // of ancient reading
        }
    },

    modernCorrection: {
        template: "<:${corrected form}|corr|${incorrect form}:>",
        completion: {
            label: "Modern correction" // of ancient error
        }
    },
    scribalCorrection: {
        // Correct form, e.g. κ̣λήρου (with diacriticals and full Leiden)
        // Original form, e.g. δ̣ληρου (with full Leiden, but without diacriticals)
        template: "<:${correct form}|subst|${original form}:>",
        completion: {
            label: "Scribal correction/substitution" // of ancient error
        }
    },
    alternateReading: {
        // Preferred reading: e.g. ἐᾶ̣
        // Other possible reading: e.g. ἐᾶ[ι]
        template: "<:${preferred reading}|alt|${other possible reading}:>",
        completion: {
            label: "Alternate reading" // Alternate readings
        }
    },
    editorialCorrection: {
        // citations?
        template: "<:${correct form}|ed|${original, previous, incorrect form}:>",
        completion: {
            label: "Editorial Correction" // Alternate readings
        }
    },


    foreign: {
        template: "~|${foreign text}|~${lang} ",
        completion: {
            label: "Foreign text",
            detail: "other language"
        }
    },
    foreignLatin: {
        template: "~|${latin text}|~la ",
        completion: {
            label: "Foreign text",
            detail: "Latin"
        }
    },
    foreignGreek: {
        template: "~|${greek text}|~grc ",
        completion: {
            label: "Foreign text",
            detail: "Greek"
        }
    },


    divisionRecto: {
        template: "<D=.r<=${text of recto}=>=D>",
        completion: {
            label: "Recto"
        }
    },
    divisionVerso: {
        template: "<D=.v<=${text of verso}=>=D>",
        completion: {
            label: "Verso"
        }
    },
    divisionColumn: {
        template: "<D=.${i}.column<=${text of column}=>=D>",
        completion: {
            label: "Column"
        }
    },
    divisionFolio: {
        template: "<D=.${a}.folio<=${text of folio}=>=D>",
        completion: {
            label: "Folio"
        }
    },
    divisionFragment: {
        template: "<D=.${a}.fragment<=${text of fragment}=>=D>",
        completion: {
            label: "Fragment"
        }
    },
    divisionOther: {
        template: "<D=.${num}.${type}<=${text of division}=>=D>",
        completion: {
            label: "Other"
        }
    },
    divisionOtherRef: {
        template: "<D=.${num}.${type}.#${ref}<=${text of division}=>=D>",
        completion: {
            label: "Other",
            detail: "with reference"
        }
    },

    lineNumber: {
        template: "${num}. ",
        completion: {
            label: "Line number"
        }
    },
    lineNumberBreak: {
        template: "${num}.- ",
        completion: {
            label: "Line number",
            detail: "with word break"
        }
    },

    lineNumberMarginLeft: {
        template: "${num},ms. ",
        completion: {
            label: "Line number",
            detail: "line written in left margin"
        }
    },
    lineNumberMarginRight: {
        template: "${num},md. ",
        completion: {
            label: "Line number",
            detail: "line written in right margin"
        }
    },
    lineNumberMarginUpper: {
        template: "${num},msup. ",
        completion: {
            label: "Line number",
            detail: "line written in upper margin"
        }
    },
    lineNumberMarginLower: {
        template: "${num},minf. ",
        completion: {
            label: "Line number",
            detail: "line written in lower margin"
        }
    },

    lineNumberMarginPerpendicularLeft: {
      template: "(${num},ms, perpendicular)",
      completion: {
          label: "Line number",
          detail: "line written in left margin perpendicular to text"
      }
    },
    lineNumberMarginPerpendicularRight: {
        template: "(${num},md, perpendicular)",
        completion: {
            label: "Line number",
            detail: "line written in right margin perpendicular to text"
        }
    },
    lineNumberMarginInverseLower: {
        template: "(${num},minf, inverse)",
        completion: {
            label: "Line number",
            detail: "line written in lower margin inverse to text"
        }
    },

    lineNumberPerpendicular: {
        template: "(${num}, perpendicular)",
        completion: {
            label: "Line number",
            detail: "line written perpendicular to text"
        }
    },
    lineNumberInverse: {
        template: "(${num}, inverse)",
        completion: {
            label: "Line number",
            detail: "line written inverse to text"
        }
    },
    lineNumberIndented: {
        template: "(${num}, indent)",
        completion: {
            label: "Line number",
            detail: "line indented (i.e., in eisthesis) to text"
        }
    },
    lineNumberOutdented: {
        template: "(${num}, outdent)",
        completion: {
            label: "Line number",
            detail: "line outdented (i.e., in ekthesis) to text"
        }
    }


}
