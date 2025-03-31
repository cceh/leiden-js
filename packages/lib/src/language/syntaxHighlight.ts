import {Tag, tags as t} from "@lezer/highlight";
import {defaultHighlightStyle, HighlightStyle} from "@codemirror/language";
import {oneDarkHighlightStyle} from "@codemirror/theme-one-dark";

const block = Tag.define(t.comment)
const blockAttr = Tag.define(t.comment)

const blockLevel1 = Tag.define(block)
const blockLevel1Attr = Tag.define(blockAttr)

const blockLevel2 = Tag.define(blockLevel1)
const blockLevel2Attr = Tag.define(blockLevel1Attr)

const app1 = Tag.define(t.literal)
const app1Infix = Tag.define(app1)
const app1Left = Tag.define(app1)
const app1LeftSpec = Tag.define(app1)
const app1Right = Tag.define(app1)
const app1RightSpec = Tag.define(app1)
const app1Equals = Tag.define(t.meta)

const app2 = Tag.define(app1)
const app2Infix = Tag.define(app1Infix)
const app2Left = Tag.define(app1Left)
const app2LeftSpec = Tag.define(app1LeftSpec)
const app2Right = Tag.define(app1Right)
const app2RightSpec = Tag.define(app1RightSpec)
const app2Equals = Tag.define(app1Equals)

const app3 = Tag.define(app2)
const app3Infix = Tag.define(app2Infix)
const app3Left = Tag.define(app2Left)
const app3LeftSpec = Tag.define(app2LeftSpec)
const app3Right = Tag.define(app2Right)
const app3RightSpec = Tag.define(app2RightSpec)
const app3Equals = Tag.define(app2Equals)

const app4 = Tag.define(app3)
const app4Infix = Tag.define(app3Infix)
const app4Left = Tag.define(app3Left)
const app4LeftSpec = Tag.define(app3LeftSpec)
const app4Right = Tag.define(app3Right)
const app4RightSpec = Tag.define(app3RightSpec)
const app4Equals = Tag.define(app3Equals)

const app5 = Tag.define(app4)
const app5Infix = Tag.define(app4Infix)
const app5Left = Tag.define(app4Left)
const app5LeftSpec = Tag.define(app4RightSpec)
const app5Right = Tag.define(app4Right)
const app5RightSpec = Tag.define(app4RightSpec)
const app5Equals = Tag.define(app4Equals)

const lost = Tag.define(t.string)
const supplied = Tag.define(t.propertyName)
const number = Tag.define(t.number)

const glyph = Tag.define(t.number)
const abbrev = Tag.define(t.className)

const insertion = Tag.define(t.inserted)
const insertionMargin = Tag.define(insertion)

const superscript = Tag.define(t.macroName)
const supraline = Tag.define(t.macroName)

const lineNumber = Tag.define(t.number)
const lineNumberWrap = Tag.define(lineNumber)

const editorialNote = Tag.define(t.annotation)

const milestone = Tag.define(lineNumber)

const diacritical = Tag.define(t.regexp)

const untranscribed = Tag.define(t.annotation);
const omittedLanguage = Tag.define(untranscribed);

export const leidenTags = {
    text: Tag.define(t.character),
    bracket: Tag.define(t.bracket),
    gapNumber: Tag.define(),

    keyword: Tag.define(),
    bracketedKeywordStart: Tag.define(),
    bracketedKeywordContent: Tag.define(),
    bracketedKeywordEnd: Tag.define(),

    id: Tag.define(),

    blockLevel1,
    blockLevel1Attr,
    blockLevel2,
    blockLevel2Attr,
    blockLevel3: Tag.define(blockLevel2),

    illegible: Tag.define(lost),
    vestiges: Tag.define(lost),
    lostLines: Tag.define(lost),
    vacat: Tag.define(lost),

    number,
    numberSymbol: Tag.define(number),
    numberValue: Tag.define(number),

    abbrev,
    expansion: Tag.define(t.propertyName),

    abbrevUnresolved: Tag.define(abbrev),

    erasure: Tag.define(t.deleted),
    erasureContent: Tag.define(t.deleted),

    gap: Tag.define(lost),
    lost,

    supplied,
    suppliedLost: Tag.define(supplied),
    suppliedParallel: Tag.define(supplied),
    suppliedParallelLost: Tag.define(supplied),
    suppliedOmitted: Tag.define(supplied),

    glyph,
    filler: Tag.define(glyph),

    editorialComment: Tag.define(t.annotation),
    foreign: Tag.define(t.keyword),
    foreignLanguageId: Tag.define(t.bool),
    surplus: Tag.define(t.keyword),
    orig: Tag.define(t.keyword),

    app1, app1Infix, app1Left, app1Right, app1Equals, app1LeftSpec, app1RightSpec,
    app2, app2Infix, app2Left, app2Right, app2Equals, app2LeftSpec, app2RightSpec,
    app3, app3Infix, app3Left, app3Right, app3Equals, app3LeftSpec, app3RightSpec,
    app4, app4Infix, app4Left, app4Right, app4Equals, app4LeftSpec, app4RightSpec,
    app5, app5Infix, app5Left, app5Right, app5Equals, app5LeftSpec, app5RightSpec,

    handshift: Tag.define(t.strong),

    untranscribed,
    untranscribedQuantity: Tag.define(untranscribed),
    omittedLanguage,
    omittedLanguageQuantity: Tag.define(omittedLanguage),
    omittedLanguageLanguage: Tag.define(omittedLanguage),

    insertion,
    insertionAbove: Tag.define(insertion),
    insertionBelow: Tag.define(insertion),
    insertionMargin,
    insertionMarginSling: Tag.define(insertionMargin),
    insertionMarginUnderline: Tag.define(insertionMargin),

    superscript,
    subscript: Tag.define(superscript),
    supraline,
    supralineUnderline: Tag.define(supraline),
    tall: Tag.define(t.macroName),

    quotation: Tag.define(t.variableName),

    lineNumber,
    lineNumberWrap,
    lineNumberSpecial: Tag.define(lineNumber),
    lineNumberSpecialWrap: Tag.define(lineNumberWrap),

    editorialNote,
    milestone,

    diacritical,
    diacritChar: Tag.define(diacritical),
    diacritSymbol: Tag.define(diacritical),
    diacritParens: Tag.define(diacritical),

    figure: Tag.define(t.strong),

    lowCertaintyMarker: Tag.define(t.regexp),

    unclear: Tag.define(t.annotation),
}


export const leidenHighlightStyle = HighlightStyle.define([
    ...defaultHighlightStyle.specs,

    {tag: leidenTags.gapNumber,
        filter: "brightness(130%)"},
    {tag: leidenTags.id,
        'font-family': 'monospace',
        },
    {tag: leidenTags.keyword,
        'font-family': 'monospace',
        'border': '1px solid color-mix(in srgb, currentColor 15%, transparent)',
        'border-radius': '5px',
        'padding-inline': '3px',
        'margin-inline': '0.1em',
        'background-color': 'rgba(250,250,250, 0.7)',
        },
    {tag: leidenTags.bracketedKeywordStart,
        fontFamily: 'monospace',
        border: '0 solid color-mix(in srgb, currentColor 15%, transparent)',
        borderBlockWidth: '1px',
        borderInlineStartWidth: '1px',
        borderStartStartRadius: '5px',
        borderEndStartRadius: '5px',
        paddingInlineStart: '2px',
        marginInlineStart: '0.1em',
        backgroundColor: 'rgba(250,250,250, 0.7)',
        },
    {tag: leidenTags.bracketedKeywordContent,
        fontFamily: 'monospace',
        border: '0 solid color-mix(in srgb, currentColor 15%, transparent)',
        borderBlockWidth: '1px',
        backgroundColor: 'rgba(250,250,250, 0.7)',
        },
    {tag: leidenTags.bracketedKeywordEnd,
        fontFamily: 'monospace',
        border: '0 solid color-mix(in srgb, currentColor 15%, transparent)',
        borderBlockWidth: '1px',
        borderInlineEndWidth: '1px',
        borderStartEndRadius: '5px',
        borderEndEndRadius: '5px',
        paddingInlineEnd: '2px',
        marginInlineEnd: '0.1em',
        backgroundColor: 'rgba(250,250,250, 0.7)',
    },

    {tag: leidenTags.lost,
        color: "#DC2626"},
    {tag: [leidenTags.illegible, leidenTags.vestiges, leidenTags.lostLines, leidenTags.vacat, leidenTags.gap],
        color: "#6f1e1e"},

    {tag: [leidenTags.untranscribed, leidenTags.omittedLanguage],
        color: "#5d5d5d",},

    {tag: [leidenTags.untranscribedQuantity, leidenTags.omittedLanguageQuantity, leidenTags.omittedLanguageLanguage],
        fontStyle: "italic"},

    {tag: leidenTags.blockLevel1,
        color: "#1E429F"},
    {tag: leidenTags.blockLevel1Attr,
        color: "#2563EB",
        fontStyle: "italic"},
    {tag: leidenTags.blockLevel2,
        color: "#2563EB"},
    {tag: leidenTags.blockLevel3,
        color: "#3B82F6"},


    {tag: leidenTags.number,
        color: "#003fbf"},
    {tag: leidenTags.numberValue,
        color: "#2167e8"},

    {tag: leidenTags.abbrev,
        color: "#056c94"},

    {tag: leidenTags.abbrevUnresolved,
        color: "#02646a"},

    {tag: leidenTags.expansion,
        color: "#0c8c3a"},

    {tag: leidenTags.erasure,
        color: "#ff5722",
    },
    {tag: leidenTags.erasureContent,
        color: "#ff5722",
        textDecorationColor: "rgba(201,40,19,0.38)",
        textDecoration: "line-through"},

    {tag: leidenTags.supplied,
        color: "#a11"},
    {tag: leidenTags.suppliedParallel,
        color: "#ad5a19"},
    {tag: leidenTags.suppliedParallelLost,
        color: "#991B1B"},
    {tag: leidenTags.suppliedOmitted,
        color: "#9b007f" },

    {tag: leidenTags.glyph,
        color: "#0f5e3e",
        fontStyle: "italic"
    },

    {tag: [leidenTags.editorialComment, leidenTags.app1RightSpec,
            leidenTags.app2RightSpec, leidenTags.app3RightSpec,
            leidenTags.app1RightSpec, leidenTags.app1LeftSpec,
        leidenTags.editorialNote],
        color: "#5c6b80"},


    {tag: leidenTags.app1Infix,
        fontFamily: "monospace"},

    {tag: leidenTags.app1,
        color: "#A3542E"},
    {tag: leidenTags.app1Left,
        color: "#CD6839"},
    {tag: leidenTags.app1Right,
        color: "#E6924D"},

    {tag: leidenTags.app2,
        color: "#7A3621"},
    {tag: leidenTags.app2Left,
        color: "#A84B2E"},
    {tag: leidenTags.app2Right,
        color: "#c5684a"},

    {tag: leidenTags.app3,
        color: "#e07801"},
    {tag: leidenTags.app3Left,
        color: "#B8860B"},
    {tag: leidenTags.app3Right,
        color: "#DAA520"},

    {tag: leidenTags.app4,
        color: "#4D4435"},
    {tag: leidenTags.app4Left,
        color: "#6B604B"},
    {tag: leidenTags.app4Right,
        color: "#8A7B62"},

    {tag: leidenTags.app5,
        color: "#9c6868"},
    {tag: leidenTags.app5Left,
        color: "#dc5757"},
    {tag: leidenTags.app5Right,
        color: "#e07e7e"},

    {tag: leidenTags.foreign,
        color: "#6B2B8A"},
    {tag: leidenTags.foreignLanguageId,
        color: "rgba(52,38,241,0.56)"},

    {tag: leidenTags.surplus,
        color: "#A65A2B"},

    {tag: leidenTags.insertion,
        color: "#D81B60"},
    {tag: leidenTags.insertionBelow,
        color: "#E45085"},
    {tag: leidenTags.insertionMargin,
        color: "#C2185B"},

    {tag: leidenTags.superscript,
        color: "#0288D1"},
     {tag: leidenTags.subscript,
        color: "#03A9F4"},
     {tag: leidenTags.supraline,
        color: "#26C6DA"},
     {tag: leidenTags.supralineUnderline,
        color: "#4DD0E1"},
     {tag: leidenTags.tall,
        color: "#6ebfcb"},

    {tag: leidenTags.quotation,
        fontStyle: "italic"},

    {tag: leidenTags.orig,
        color: "#6D8046"},

    {tag: leidenTags.lineNumber,
        color: "#0009b7"},
    {tag: leidenTags.lineNumberWrap,
        color: "#0009b7",
        fontStyle: "italic"},

    {tag: leidenTags.milestone,
        color: "#0009b7"},

    {tag: leidenTags.diacritical,
        color: "#0f5e3e"},

    {tag: leidenTags.diacritChar,
        paddingInlineEnd: "1px"},

    {tag: leidenTags.diacritParens,
        color: "#CD6839"},

    {tag: leidenTags.diacritical,
        fontStyle: "italic"},

    {tag: leidenTags.diacritSymbol,
        color: "#CD6839",
        fontWeight: "bold",
        paddingInline: "2px"},

    {tag: [leidenTags.handshift],
        fontWeight: "bold",
        fontFamily: "monospace"},

    {tag: leidenTags.figure,
        fontFamily: "monospace",
        fontStyle: "italic"},

    {tag: leidenTags.lowCertaintyMarker,
        color: "#a11"},

    {tag: leidenTags.unclear,
        opacity: 0.75}
]);



export const leidenHighlightStyleDark = HighlightStyle.define([
    ...oneDarkHighlightStyle.specs,

    {tag: leidenTags.gapNumber,
        filter: "brightness(130%)"},
    {tag: leidenTags.id,
        'font-family': 'monospace'},
    {tag: leidenTags.keyword,
        'font-family': 'monospace',
        'border': '1px solid color-mix(in srgb, currentColor 30%, transparent)',
        'border-radius': '5px',
        'padding-inline': '3px',
        'margin-inline': '0.1em',
        'background-color': 'rgba(0,0,0, 0.2)'},
    {tag: leidenTags.bracketedKeywordStart,
        fontFamily: 'monospace',
        border: '0 solid color-mix(in srgb, currentColor 30%, transparent)',
        borderBlockWidth: '1px',
        borderInlineStartWidth: '1px',
        borderStartStartRadius: '5px',
        borderEndStartRadius: '5px',
        paddingInlineStart: '2px',
        marginInlineStart: '0.1em',
        backgroundColor: 'rgba(0,0,0, 0.2)'},
    {tag: leidenTags.bracketedKeywordContent,
        fontFamily: 'monospace',
        border: '0 solid color-mix(in srgb, currentColor 30%, transparent)',
        borderBlockWidth: '1px',
        backgroundColor: 'rgba(0,0,0, 0.2)'},
    {tag: leidenTags.bracketedKeywordEnd,
        fontFamily: 'monospace',
        border: '0 solid color-mix(in srgb, currentColor 30%, transparent)',
        borderBlockWidth: '1px',
        borderInlineEndWidth: '1px',
        borderStartEndRadius: '5px',
        borderEndEndRadius: '5px',
        paddingInlineEnd: '2px',
        marginInlineEnd: '0.1em',
        backgroundColor: 'rgba(0,0,0, 0.2)'},

    // Document Structure - Inspired by manuscript hierarchical systems
    {tag: leidenTags.blockLevel1,
        color: "#8AB5D4"},
    {tag: leidenTags.blockLevel1Attr,
        color: "#A8C9E3",
        fontStyle: "italic"},
    {tag: leidenTags.blockLevel2,
        color: "#6B9BC0"},
    {tag: leidenTags.blockLevel3,
        color: "#8bc2ea"},

    {tag: leidenTags.lost,
        color: "#E67373"},
    {tag: [leidenTags.illegible, leidenTags.vestiges, leidenTags.lostLines, leidenTags.vacat, leidenTags.gap],
        color: "#BF6060"},
    {tag: leidenTags.unclear,
        opacity: 0.75},

    {tag: leidenTags.abbrev,
        color: "#7FA881"},
    {tag: leidenTags.abbrevUnresolved,
        color: "#899f8a"},
    {tag: leidenTags.expansion,
        color: "#aec6b0"},


    {tag: leidenTags.erasure,
        color: "#F97316"},
    {tag: leidenTags.erasureContent,
        color: "#F97316",
        textDecorationColor: "rgba(234,88,12,0.38)",
        textDecoration: "line-through"},

    {tag: leidenTags.supplied,
        color: "#E49B6E"},
    {tag: leidenTags.suppliedParallel,
        color: "#CB8A62"},
    {tag: leidenTags.suppliedParallelLost,
        color: "#c09d87"},
    {tag: leidenTags.suppliedOmitted,
        color: "#D5805C"},

    {tag: leidenTags.glyph,
        color: "#adebc2",
        fontStyle: "italic"},

    {tag: [leidenTags.editorialComment, leidenTags.app1RightSpec,
            leidenTags.app2RightSpec, leidenTags.app3RightSpec,
            leidenTags.app1RightSpec, leidenTags.app1LeftSpec,
            leidenTags.editorialNote],
        color: "#94A3B8"},

    {tag: leidenTags.foreign,
        color: "#E4B6E4"},
    {tag: leidenTags.foreignLanguageId,
        color: "#D49ED4"},

    {tag: leidenTags.surplus,
        color: "#dda836"},

    {tag: leidenTags.insertionAbove,
        color: "#FF9F7F"},
    {tag: leidenTags.insertionBelow,
        color: "#FFB499"},
    {tag: leidenTags.insertionMargin,
        color: "#FFCAB3"},
    {tag: leidenTags.insertionMarginSling,
        color: "#FFE0CC"},
    {tag: leidenTags.insertionMarginUnderline,
        color: "#FFF5E6"},

    {tag: leidenTags.superscript,
        color: "#0EA5E9"},
    {tag: leidenTags.subscript,
        color: "#02a6cf"},
    {tag: leidenTags.supraline,
        color: "#06B6D4"},
    {tag: leidenTags.supralineUnderline,
        color: "#22D3EE"},
    {tag: leidenTags.tall,
        color: "#67E8F9"},

    {tag: leidenTags.quotation,
        fontStyle: "italic"},

    {tag: leidenTags.diacritChar,
        paddingInlineEnd: "1px"},

    {tag: leidenTags.orig,
        color: "#84CC16"},

    {tag: leidenTags.diacritical,
        fontStyle: "italic"},
    {tag: leidenTags.diacritSymbol,
        color: "#FB923C",
        fontWeight: "bold",
        paddingInline: "2px"},

    {tag: leidenTags.number,
        color: "#B8D7F0"}, // Brighter blue
    {tag: leidenTags.numberValue,
        color: "#D6E9F5",
        fontStyle: "italic",
        fontFamily: "monospace"
    },

    {tag: leidenTags.app1Infix,
        fontFamily: "monospace"},

    // Apparatus entries
    {tag: leidenTags.app1,
        color: "#C1976A"},
    {tag: leidenTags.app1Left,
        color: "#D4AA7D"},
    {tag: leidenTags.app1Right,
        color: "#E6BC90"},

    {tag: leidenTags.app2,
        color: "#7B9BB3"},
    {tag: leidenTags.app2Left,
        color: "#8EAEC6"},
    {tag: leidenTags.app2Right,
        color: "#A1C1D9"},

    {tag: leidenTags.app3,
        color: "#d27e60"},
    {tag: leidenTags.app3Left,
        color: "#da8e72"},
    {tag: leidenTags.app3Right,
        color: "#e7ad97"},

    {tag: leidenTags.app4,
        color: "#9DA5B4"},
    {tag: leidenTags.app4Left,
        color: "#B0B8C7"},
    {tag: leidenTags.app4Right,
        color: "#C3CBDA"},

    {tag: leidenTags.app5,
        color: "#BC9A5F"},
    {tag: leidenTags.app5Left,
        color: "#CFAD72"},
    {tag: leidenTags.app5Right,
        color: "#E2C085"},

    // Special Marks
    {tag: leidenTags.diacritical,
        color: "#B8C2CC",
        fontStyle: "italic"},
    {tag: leidenTags.diacritParens,
        color: "#A1ABB5"},
    {tag: leidenTags.diacritSymbol,
        color: "#8A949E",
        fontWeight: "bold",
        paddingInline: "2px"},

    // Reference Elements
    {tag: leidenTags.lineNumber,
        color: "#C2B4A1"},
    {tag: leidenTags.lineNumberWrap,
        color: "#C2B4A1",
        fontStyle: "italic"},
    {tag: leidenTags.milestone,
        color: "#C2B4A1"},

    {tag: [leidenTags.handshift],
        fontWeight: "bold",
        fontFamily: "monospace",
        color: "#D4CDC3"},
    {tag: leidenTags.figure,
        fontFamily: "monospace",
        fontStyle: "italic",
        color: "#BFB8AE"},

    {tag: [leidenTags.untranscribed, leidenTags.omittedLanguage],
        color: "#9DA5B4"},
    {tag: [leidenTags.untranscribedQuantity, leidenTags.omittedLanguageQuantity, leidenTags.omittedLanguageLanguage],
        color: "#828A99",
        fontStyle: "italic"},

    {tag: leidenTags.lowCertaintyMarker,
        color: "#f7a6a6"},

    {tag: leidenTags.supraline,
        fontStyle: "italic"},
    {tag: leidenTags.supralineUnderline,
        fontStyle: "italic"}
]);