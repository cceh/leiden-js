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
const app1Left = Tag.define(app1)
const app1LeftSpec = Tag.define(app1)
const app1Right = Tag.define(app1)
const app1RightSpec = Tag.define(app1)
const app1Equals = Tag.define(t.meta)

const app2 = Tag.define(app1)
const app2Left = Tag.define(app1Left)
const app2LeftSpec = Tag.define(app1LeftSpec)
const app2Right = Tag.define(app1Right)
const app2RightSpec = Tag.define(app1RightSpec)
const app2Equals = Tag.define(app1Equals)

const app3 = Tag.define(app2)
const app3Left = Tag.define(app2Left)
const app3LeftSpec = Tag.define(app2LeftSpec)
const app3Right = Tag.define(app2Right)
const app3RightSpec = Tag.define(app2RightSpec)
const app3Equals = Tag.define(app2Equals)

const app4 = Tag.define(app3)
const app4Left = Tag.define(app3Left)
const app4LeftSpec = Tag.define(app3LeftSpec)
const app4Right = Tag.define(app3Right)
const app4RightSpec = Tag.define(app3RightSpec)
const app4Equals = Tag.define(app3Equals)

const app5 = Tag.define(app4)
const app5Left = Tag.define(app4Left)
const app5LeftSpec = Tag.define(app4RightSpec)
const app5Right = Tag.define(app4Right)
const app5RightSpec = Tag.define(app4RightSpec)
const app5Equals = Tag.define(app4Equals)

const lost = Tag.define(t.string)
const number = Tag.define(t.number)

const glyph = Tag.define(t.number)
const abbrev = Tag.define(t.className)

export const leidenTags = {
    bracket: Tag.define(t.bracket),
    gapNumber: Tag.define(),
    keyword: Tag.define(), // TODO: remove

    blockLevel1,
    blockLevel1Attr,
    blockLevel2,
    blockLevel2Attr,
    blockLevel3: Tag.define(blockLevel2),

    lineNum: Tag.define(t.comment),
    lineNumBreak: Tag.define(t.string),
    lineNumNumber: Tag.define(t.strong),

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
    suppliedLost: Tag.define(lost),
    suppliedParallel: Tag.define(lost),

    glyph,
    filler: Tag.define(glyph),

    editorialComment: Tag.define(t.annotation),
    foreign: Tag.define(t.keyword),
    foreignLanguageId: Tag.define(t.bool),

    app1, app1Left, app1Right, app1Equals, app1LeftSpec, app1RightSpec,
    app2, app2Left, app2Right, app2Equals, app2LeftSpec, app2RightSpec,
    app3, app3Left, app3Right, app3Equals, app3LeftSpec, app3RightSpec,
    app4, app4Left, app4Right, app4Equals, app4LeftSpec, app4RightSpec,
    app5, app5Left, app5Right, app5Equals, app5LeftSpec, app5RightSpec,
}

export const leidenHighlightStyle = HighlightStyle.define([
    ...defaultHighlightStyle.specs,

    {tag: leidenTags.bracket,
        filter: "brightness(75%)"},
    {tag: leidenTags.gapNumber,
        filter: "brightness(130%)"},
    {tag: leidenTags.keyword,
        // 'text-decoration': 'overline dotted lightgrey',
        // 'font-variant': "small-caps",
        'font-family': 'monospace'},

    {tag: leidenTags.blockLevel1,
        color: "#1E429F"},
    {tag: leidenTags.blockLevel1Attr,
        color: "#2563EB",
        fontStyle: "italic"},
    {tag: leidenTags.blockLevel2,
        color: "#2563EB"},
    {tag: leidenTags.blockLevel3,
        color: "#3B82F6"},

    {tag: leidenTags.lineNum,
        color: "#881337"},
    {tag: leidenTags.lineNumNumber,
        fontWeight: "bold"},
    {tag: leidenTags.lineNumBreak,
        color: "#be123c"},


    // {tag: leidenTags.illegible,
    //     color: "#991B1B" },

    {tag: leidenTags.number,
        color: "#003fbf"},
    {tag: leidenTags.numberValue,
        color: "#2167e8"},

    {tag: leidenTags.abbrev,
        color: "#167aa4"},

    {tag: leidenTags.expansion,
        color: "#0c8c3a"},

    {tag: leidenTags.erasure,
        color: "#991B1B"},
    {tag: leidenTags.erasureContent,
        textDecoration: "line-through"},
    {tag: leidenTags.gap,
        color: "#B91C1C"},
    {tag: leidenTags.lost,
        color: "#DC2626"},

    {tag: leidenTags.glyph,
        color: "#0f5e3e"},

    {tag: [leidenTags.editorialComment, leidenTags.app1RightSpec, leidenTags.app2RightSpec, leidenTags.app3RightSpec, leidenTags.app1RightSpec, leidenTags.app1LeftSpec],
        color: "#64748B"},


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

    //
    // {tag: leidenTags.app1,
    //     color: "#065f22"},
    // {tag: [app1Right],
    //     color: "#0b8c2c",
    //     fontStyle: "italic"},
    // {tag: leidenTags.app1Equals,
    //     color: "#10b954"},
    //
    // {tag: leidenTags.app2,
    //     color: "#1f00ea"},
    // {tag: leidenTags.app2Left,
    //     color: "#534ee3",
    //     fontStyle: "italic"},
    // {tag: leidenTags.app2Right,
    //     color: "#827fda"},

    {tag: leidenTags.foreign,
        color: "#8328d9"},
    {tag: leidenTags.foreignLanguageId,
        color: "#af7edc",
        fontStyle: "italic"}
]);


export const leidenHighlightStyleDark = HighlightStyle.define([
    ...oneDarkHighlightStyle.specs,

    // Structure (lighter blues)
    {tag: leidenTags.blockLevel1,
        color: "#93c5fd"},
    {tag: leidenTags.blockLevel1Attr,
        color: "#60a5fa",
        fontStyle: "italic"},
    {tag: leidenTags.blockLevel2,
        color: "#60a5fa"},
    {tag: t.local(leidenTags.blockLevel3),
        color: "#3b82f6"},

    // Line numbers (brighter burgundy)
    {tag: leidenTags.lineNum,
        color: "#fda4af"},
    {tag: leidenTags.lineNumNumber,
        fontWeight: "bold"},
    {tag: leidenTags.lineNumBreak,
        color: "#f43f5e"},

    // Text issues (brighter reds)
    {tag: leidenTags.erasure,
        color: "#fca5a5"},
    {tag: leidenTags.erasureContent,
        textDecoration: "line-through"},
    {tag: leidenTags.gap,
        color: "#f87171"},
    {tag: leidenTags.lost,
        color: "#ef4444"},

    // Editorial (lighter greens)
    {tag: leidenTags.editorialComment,
        color: "#94a3b8"},
    {tag: leidenTags.app1,
        color: "#86efac"},
    {tag: [app1Right],
        color: "#4ade80",
        fontStyle: "italic"},
    {tag: leidenTags.app1Equals,
        color: "#34d399"},

    // Apparatus (lighter blues)
    {tag: leidenTags.app2,
        color: "#818cf8"},
    {tag: leidenTags.app2Left,
        color: "#6366f1",
        fontStyle: "italic"},
    {tag: leidenTags.app2Right,
        color: "#4f46e5"},

    // Foreign (lighter purples)
    {tag: leidenTags.foreign,
        color: "#c084fc"},
    {tag: leidenTags.foreignLanguageId,
        color: "#a855f7",
        fontStyle: "italic"}
]);


export const leidenHighlightStyleAccessible = HighlightStyle.define([
    ...defaultHighlightStyle.specs,
    // Structure (dark blues - high contrast on white)
    {tag: leidenTags.blockLevel1,
        color: "#1864ab"},  // Dark blue
    {tag: leidenTags.blockLevel1Attr,
        color: "#1971c2",
        fontStyle: "italic"},
    {tag: leidenTags.blockLevel2,
        color: "#1864ab"},
    {tag: t.local(leidenTags.blockLevel3),
        color: "#1c7ed6"},

    // Line numbers (deep orange)
    {tag: leidenTags.lineNum,
        color: "#d9480f"},  // Deep orange
    {tag: leidenTags.lineNumNumber,
        color: "#c92a2a",   // Deep red
        fontWeight: "bold"},
    {tag: leidenTags.lineNumBreak,
        color: "#e8590c"},

    // Text issues (pure red - clear warning)
    {tag: leidenTags.erasure,
        color: "#c92a2a"},  // Pure red
    {tag: leidenTags.erasureContent,
        textDecoration: "line-through"},
    {tag: leidenTags.gap,
        color: "#e03131"},
    {tag: leidenTags.lost,
        color: "#f03e3e"},

    // Editorial (dark teal)
    {tag: leidenTags.editorialComment,
        color: "#495057"},  // Dark gray
    {tag: leidenTags.app1,
        color: "#087f5b"},  // Dark teal
    {tag: [app1Right],
        color: "#0b7285",
        fontStyle: "italic"},
    {tag: leidenTags.app1Equals,
        color: "#0c8599"},

    // Apparatus (deep purple)
    {tag: leidenTags.app2,
        color: "#5f3dc4"},  // Deep purple
    {tag: leidenTags.app2Left,
        color: "#6741d9",
        fontStyle: "italic"},
    {tag: leidenTags.app2Right,
        color: "#7048e8"},

    // Foreign (dark magenta)
    {tag: leidenTags.foreign,
        color: "#a61e4d"},  // Dark magenta
    {tag: leidenTags.foreignLanguageId,
        color: "#be4bdb",
        fontStyle: "italic"}
]);

export const leidenHighlightStyleAccessibleDark = HighlightStyle.define([
    ...oneDarkHighlightStyle.specs,

    // Structure (blues - distinguishable in all types)
    {tag: leidenTags.blockLevel1,
        color: "#4dabf7"},  // Bright sky blue
    {tag: leidenTags.blockLevel1Attr,
        color: "#74c0fc",
        fontStyle: "italic"},
    {tag: leidenTags.blockLevel2,
        color: "#4dabf7"},
    {tag: t.local(leidenTags.blockLevel3),
        color: "#a5d8ff"},

    // Line numbers (yellows - visible in deuteranopia/protanopia)
    {tag: leidenTags.lineNum,
        color: "#ffd43b"},  // Bright yellow
    {tag: leidenTags.lineNumNumber,
        color: "#fcc419",
        fontWeight: "bold"},
    {tag: leidenTags.lineNumBreak,
        color: "#fab005"},

    // Text issues (orange - distinct from yellows and reds)
    {tag: leidenTags.erasure,
        color: "#ff922b"},  // Vivid orange
    {tag: leidenTags.erasureContent,
        textDecoration: "line-through"},
    {tag: leidenTags.gap,
        color: "#fd7e14"},
    {tag: leidenTags.lost,
        color: "#f76707"},

    // Editorial (cyan - distinct from blue and green)
    {tag: leidenTags.editorialComment,
        color: "#adb5bd"},  // Neutral gray
    {tag: leidenTags.app1,
        color: "#3bc9db"},  // Bright cyan
    {tag: [app1Right],
        color: "#15aabf",
        fontStyle: "italic"},
    {tag: leidenTags.app1Equals,
        color: "#22b8cf"},

    // Apparatus (magenta - visible in tritanopia)
    {tag: leidenTags.app2,
        color: "#f783ac"},  // Bright magenta
    {tag: leidenTags.app2Left,
        color: "#e64980",
        fontStyle: "italic"},
    {tag: leidenTags.app2Right,
        color: "#d6336c"},

    // Foreign (purple - distinct from all other colors)
    {tag: leidenTags.foreign,
        color: "#da77f2"},  // Bright purple
    {tag: leidenTags.foreignLanguageId,
        color: "#cc5de8",
        fontStyle: "italic"}
]);
