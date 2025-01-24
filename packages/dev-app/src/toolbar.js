import {computePosition, flip, offset, shift, size} from "@floating-ui/dom";
import {snippets} from "@leiden-plus/codemirror-lang-leiden-plus";
import {snippet} from "@codemirror/autocomplete";
import {html, nothing, render} from "lit-html";
import {createRef, ref} from "lit-html/directives/ref.js";
import {Directive, directive} from "lit-html/directive.js";
import {syntaxTree} from "@codemirror/language";
import {Facet, findClusterBreak, RangeSet, RangeSetBuilder, StateEffect, StateField} from "@codemirror/state";
import {Decoration, EditorView, showPanel, showTooltip} from "@codemirror/view";

// language=CSS
const css = `
    :root {
      /*--toolbar-bg: #f5f5f5;*/
      /*--toolbar-border: #ddd;*/
      --button-hover: #e5e5e5;
      --menu-bg: #ffffff;
      --menu-border: #ddd;
      --menu-shadow: rgba(0, 0, 0, 0.1);
      --chevron-down: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 66.91"><path d="M11.68 1.95a6.884 6.884 0 0 0-9.73.13 6.884 6.884 0 0 0 .13 9.73l54.79 53.13 4.8-4.93-4.8 4.95a6.9 6.9 0 0 0 9.75-.15c.08-.08.15-.16.22-.24l53.95-52.76a6.875 6.875 0 0 0 .14-9.73c-2.65-2.72-7.01-2.79-9.73-.13L61.65 50.41z"/></svg>');
        --chevron-size: 0.33em;
    }

    :root {
        /* Spacing */
        --toolbar-padding: 0.25rem;
        --button-padding: 0.25rem 0.5rem;
        --button-gap: 0.4rem;
        --divider-margin: 0.25rem;


        /* Icons */
        --icon-size: 0.5rem;
        --icon-size-more: 0.75rem;
        --icon-chevron: var(--chevron-down);

        /* Visual */
        --border-radius: 0.25rem;
        --focus-ring-width: 2px;
        --focus-ring-offset: 2px;
        --divider-width: 1px;

        /* Colors */
        --color-focus: #0066cc;
        --color-border: var(--menu-border, #e2e8f0);
        --color-hover: var(--button-hover, #f1f5f9);

        /* Typography */
        --font-family: system-ui, sans-serif;
    }

    .toolbar {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        padding: var(--toolbar-padding);
        font-family: var(--font-family);
    }

    .toolbar-button {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        padding: var(--button-padding);
        border: none;
        background: none;
        border-radius: var(--border-radius);
        cursor: pointer;
        position: relative;
        line-height: 1;
    }

    .toolbar-button:hover,
    .toolbar-button[aria-expanded="true"] {
        background: var(--color-hover);
    }

    .toolbar-button:focus-visible {
        outline: var(--focus-ring-width) solid var(--color-focus);
        outline-offset: var(--focus-ring-offset);
    }

    .toolbar-button[aria-haspopup="true"] {
        gap: var(--button-gap);
    }

    .toolbar-button[aria-haspopup="true"]:after,
    .more-button:after {
        content: "";
        width: var(--icon-size);
        height: var(--icon-size);
        background-image: var(--icon-chevron);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .more-button {
        display: flex;
        align-items: center;
        /*padding-inline-end: calc(var(--button-gap) / 2);*/
    }

    .more-button:after {
        width: var(--icon-size-more);
        height: var(--icon-size-more);
    }

    .toolbar-divider {
        width: var(--divider-width);
        margin: var(--divider-margin);
        background: var(--color-border);
        align-self: stretch;
    }

    .split-button-container {
        display: flex;
        align-items: stretch;
    }

    .split-button-container:hover,
    .split-button-container:has([aria-expanded="true"]) {
        box-sizing: border-box;
        box-shadow: 0 0 0 var(--divider-width) var(--color-hover) inset;
        border-radius: var(--border-radius);
    }

    .split-button-container button:first-child {
        border-end-end-radius: 0;
        border-start-end-radius: 0;
        padding-inline-end: calc(var(--button-gap) / 2); /* Match the menu button */
    }

    .split-button-container button:nth-child(2) {
        border-end-start-radius: 0;
        border-start-start-radius: 0;
        padding-inline: calc(var(--button-gap) / 2); /* Match the menu button */
    }

    /*.toolbar {*/
    /*  box-sizing: border-box;*/
    /*  display: flex;*/
    /*  align-items: center;*/
    /*  padding: 4px;*/
    /*  font-family: system-ui, sans-serif;*/
    /*}*/
    
    /*.toolbar-button {*/
    /*  box-sizing: border-box;*/
    /*  border: none;*/
    /*  padding: 0.15rem 0.3rem;*/
    /*  background: none;*/
    /*  border-radius: 4px;*/
    /*  cursor: pointer;*/
    /*  position: relative;*/
    /*}*/
    
    /*.toolbar > .toolbar-button, .split-button-container {*/
    /*    display: flex;*/
    /*    align-items: stretch;*/
    /*}*/
    
    /*.toolbar > .toolbar-button[aria-haspopup="true"] {*/
    /*    display: flex;*/
    /*    align-items: center;*/
    /*    gap: 0.3rem;*/
    /*}*/
    
    /* .toolbar > .toolbar-button[aria-haspopup="true"]:after {*/
    /*     content: "";*/
    /*     width: 0.5rem;*/
    /*     height: 0.5rem;*/
    /*     background-image: var(--chevron-down);*/
    /*     background-size: contain;*/
    /*     background-repeat: no-repeat;*/
    /*     background-position: center;*/
    /*     */
    /*   */
    /*}*/
    
    /*.toolbar-button:hover,*/
    /*.toolbar-button[aria-expanded="true"] {*/
    /*  background: var(--button-hover);*/
    /*}*/
    
    /*.toolbar-button:focus-visible {*/
    /*  outline: 2px solid #0066cc;*/
    /*  outline-offset: 2px;*/
    /*}*/
    
    /*.more-button {*/
    /*    display: flex;*/
    /*    align-items: center;*/
    /*    position: relative;*/
    /*    padding-inline: 0;*/
    /*}*/
    
    /*.more-button:after {*/
    /*    content: "";*/
    /*    width: 0.6rem;*/
    /*    height: 0.6rem;*/
    /*    background-image: var(--chevron-down);*/
    /*    background-size: contain;*/
    /*    background-repeat: no-repeat;*/
    /*    background-position: center;*/
    /*}*/
    
    /*.toolbar-divider {*/
    /*    width: 1px;*/
    /*    margin: 4px;*/
    /*    background: var(--menu-border);*/
    /*    align-self: stretch;*/
    /*}*/
    
    
    /*.split-button-container:hover,*/
    /*.split-button-container:has([aria-expanded="true"]) {*/
    /*    box-sizing: border-box;*/
    /*    box-shadow: 0 0 0 1px var(--button-hover) inset;*/
    /*    border-radius: 4px;*/
    /*}*/
    
    /* .split-button-container button:first-child {*/
    /*    border-end-end-radius: 0;*/
    /*    border-start-end-radius: 0;*/
    /*     padding-inline-end: 0.3rem;*/
    /*}*/
    
    /*.split-button-container button:nth-child(2) {*/
    /*    border-end-start-radius: 0;*/
    /*    border-start-start-radius: 0;*/
    /*    padding-inline-start: 0.3rem;*/
    /*    padding-inline-end: 0.3rem;*/
    /*}*/
    
    .menu-container {
        position: relative;
        z-index: 1000;
        pointer-events: none;
    }
    
    @keyframes menu-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .menu {
      position: fixed;
      background: var(--menu-bg);
      border: 1px solid var(--menu-border);
      border-radius: 4px;
      padding: 4px;
      box-shadow: 0 2px 8px var(--menu-shadow);
      z-index: 1000;
      min-width: 160px;
      margin-top: -6px;
      margin-left: -6px;
      display: none;
      pointer-events: none;
      overflow: auto;
      opacity: 0;
    }

    .menu[data-show] {
      display: block;
      pointer-events: auto;
      animation: menu-fade-in 0.1s ease-out forwards;
    }

    .menu-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 12px;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      border-radius: 2px;
    }
    
    .menu-item .info {
        color: darkgray;
    }
    
    .menu-item .info:not(:empty) {
        padding-inline-start: 1em;
    }

    .menu-item:hover,
    .menu-item:focus-visible {
      background: var(--button-hover);
    }

    .menu-item:focus-visible {
      outline: 2px solid #0066cc;
      outline-offset: -2px;
    }

    .menu-item[aria-haspopup="true"]::after {
      content: "→";
      margin-left: 8px;
    }
`;

function processCombiningMarks(text, combiningCharacters, mode = "add") {
    const output = []
    for (let i = 0; i < text.length; i++) {
        const codepoint = text.codePointAt(i);

        if (codepoint) {
            // Handle surrogate pairs, move index appropriately
            const char = String.fromCodePoint(codepoint);
            output.push(char);

            if (codepoint >= 0x10000) {
                i++; // increment extra for surrogate pairs
            }

            // Output existing combining marks and increase the index
            while (i + 1 < text.length) {
                const nextCodepoint = text.codePointAt(i + 1);
                if (!nextCodepoint || !/\p{M}/u.test(String.fromCodePoint(nextCodepoint))) {
                    break;
                }
                i++;
                const mark = String.fromCodePoint(nextCodepoint);
                if (!combiningCharacters.includes(mark)) {
                    output.push(mark);
                }
            }

            if (mode === "add") output.push(...combiningCharacters);
        }
    }
    return output.join("");
}

function addCombining(text, combiningCharacters) {
    return processCombiningMarks(text, combiningCharacters, "add");
}

function removeCombining(text, combiningCharacters) {
    return processCombiningMarks(text, combiningCharacters, "remove");
}

export const setHighlights = StateEffect.define()
export const clearHighlights = StateEffect.define()

const highlightMark = Decoration.mark({
    class: "leiden-highlight"
})

const highlightField = StateField.define({
    create() { return RangeSet.empty },
    update(highlights, tr) {
        highlights = highlights.map(tr.changes)
        for (const effect of tr.effects) {
            if (effect.is(setHighlights)) {
                return RangeSet.of(
                    effect.value.map(({from, to}) =>
                        highlightMark.range(from, to))
                )
            } else if (effect.is(clearHighlights)) {
                return RangeSet.empty
            }
        }

        return highlights
    },
    provide: f => EditorView.decorations.from(f)
})

const highlightTheme = EditorView.baseTheme({
    ".leiden-highlight": {
        backgroundColor: "rgba(255, 255, 0, 0.2)"
    }
})

const availableUnderdotRanges = StateField.define({
    create() { return [] },
    update(ranges, tr) {
        if (tr.docChanged || tr.selection) {
            ranges.length = 0
            const selection = tr.state.selection.main;
            if (selection.empty && selection.from === 0) {
                return ranges
            }

            const from = selection.empty ? findClusterBreak(tr.state.doc.toString(), selection.from, false) : selection.from
            const to = selection.to

            let node = syntaxTree(tr.state).cursorAt(from, 1)
            while (node) {
                const name = node.type.name
                if (name === "Text") {
                    const pattern = /[\p{L}\p{N}]+/gu
                    const testFrom = Math.max(from, node.from)
                    const testTo = Math.min(to, node.to)

                    let match
                    while ((match = pattern.exec(tr.state.doc.sliceString(testFrom, testTo)))) {
                        ranges.push({
                            name,
                            from: testFrom + match.index,
                            to: testFrom + match.index + match[0].length,
                        })
                    }
                } else if (name === "Unclear" || name === "SupralineMacronContent" || name === "SupralineUnclear") {
                    ranges.push({
                        name,
                        from: Math.max(from, node.from),
                        to: Math.min(to, node.to)
                    })
                }

                if (node.to > to) {
                    console.log({selTo: to, nodeTo: node.to})
                    break
                }
                node.next()
            }
        }
        return ranges
    }
})




const applySnippet = (view, snippetDef) => {
    const { to, from } = view.state.selection.ranges[0]
    snippet(snippetDef.template)(view, null, from, to);
}


const toolbarConfig = (state) => {
    const snippetItem = ([id, snippetDef]) => ({
        id,
        label: `${snippetDef.completion.displayLabel}${snippetDef.completion.detail ? ", " + snippetDef.completion.detail : ""}`,
        action: (view) => applySnippet(view, snippetDef),
        active: inlineNodeActive(),
        info: snippetDef.completion.info
    })

    const hasParent = (node, parent) => {
        while (node) {
            if (node.node.type.name === parent) {
                return true;
            }
            node = node.next
        }
    }

    const atomicRules = [
        "NumberSpecialValue", "FracPart", "RangePart", "CertLow",
        "Vestige", "Diacritical", "Glyph", "Filler", "Handshift",
        "Figure", "OmittedLanguage", "Untranscribed", "LineBreakSpecial",
        "LineBreakSpecialWrapped", "LineBreak", "LineBreakWrapped",
        "Illegible", "IllegibleInvalid", "VestigeInvalid", "LostLines",
        "LostLinesInvalid", "Vacat", "Citation", "EditorialNoteRef",
        "Gap", "GapOmitted"
    ]

    const inlineNodeActive = (() => {
        const tree = syntaxTree(state)
        let node = tree.resolveStack(state.selection.ranges[0].from)
        if (node.node.type.is("Delims")) {
            return false;
        }

        if (hasParent(node, "AbbrevInner")) {
            return false;
        }

        if (atomicRules.some(name => hasParent(node, name))) {
            return false;
        }

        return true
    })

    const ancientDiacrits = {
        Acute: "´",
        Asper: " ῾",
        Circumflex: "^",
        Diaeresis: "¨",
        Grave: "`",
        Lenis: " ᾿",
    }

    const diacritItems = Object.entries(ancientDiacrits).map(([name, diacrit]) => ({
        id: name.toLowerCase(),
        label: name,
        active: inlineNodeActive(),
        action: (view) => {
            applySnippet(view, {
                template: ` \${char}(${diacrit})`
            })
        }
    }))

    const doubleDiacritFirstItems = Object.entries(ancientDiacrits).map(([name, diacrit]) => ({
        id: `${name.toLowerCase()}-with`,
        label: `${name} with`,
        active: inlineNodeActive(),
        items: Object.entries(ancientDiacrits)
            .filter(([secondName]) => secondName !== name)
            .map(([secondName, secondDiacrit]) => ({
            id: `with-${secondName.toLowerCase()}`,
            label: `${secondName}`,
            action: (view) => {
                applySnippet(view, {
                    template: ` \${char}(${diacrit}${secondDiacrit})`
                })
            }
        }))
    }))
    return [
        {
            id: "markup",
            label: "Markup",
            items: [{
                id: "abbreviations",
                label: "Abbreviations",
                items: (() => {
                    const {abbreviation, abbreviationUnresolved} = snippets;
                    return Object.entries({abbreviation, abbreviationUnresolved}).map(snippetEntry => ({
                        ...snippetItem(snippetEntry),
                        active: inlineNodeActive()
                    }))
                })(),
            }, {
                id: "apparatus",
                label: "Apparatus",
                items: (() => {
                    const {modernRegularization, modernCorrection, scribalCorrection, alternateReading, editorialCorrection} = snippets;
                    return Object.entries({modernRegularization, modernCorrection, scribalCorrection, alternateReading, editorialCorrection}).map(snippetEntry => ({
                        ...snippetItem(snippetEntry),
                        active: inlineNodeActive()
                    }))
                })(),
            }, {
                id: "deletions",
                label: "Deletion/cancellation",
                items: (() => {
                    const {deletion, deletionSlashes, deletionCrossStrokes} = snippets;
                    return Object.entries({deletionSlashes, deletionCrossStrokes, deletion}).map(snippetEntry => ({
                        ...snippetItem(snippetEntry),
                        active: inlineNodeActive()
                    }))
                })(),
            }, {
                id: "doc-divisions",
                label: "Document divisions",
                items: (() => {
                    const {divisionRecto, divisionVerso, divisionColumn, divisionFolio, divisionFragment, divisionOther, divisionOtherRef} = snippets;
                    return Object.entries({divisionRecto, divisionVerso, divisionColumn, divisionFolio, divisionFragment, divisionOther, divisionOtherRef}).map(snippetEntry => ({
                        ...snippetItem(snippetEntry),
                        active: inlineNodeActive() // TODO
                    }))
                })()
            }, {
                id: "foreign-lang",
                label: "Foreign language",
                items: (() => {
                    const {foreignLatin, foreignGreek, foreign} = snippets;
                    return Object.entries({foreignLatin, foreignGreek, foreign}).map((snippetEntry) => ({
                        ...snippetItem(snippetEntry),
                        active: inlineNodeActive()
                    }))
                })(),
            }, {
                id: "gaps",
                label: "Gaps (missing/illegible)",
                items: [{
                    id: "lacunae",
                    label: "Lacuna",
                    items: (() => {
                        const {gapLostChars, gapLostCharsCa, gapLostCharsRange, gapLostCharsUnknown, gapLostLines, gapLostLinesRange, gapLostLinesCa, gapLostLinesUnknown} = snippets;
                        return Object.entries({
                            gapLostChars,
                            gapLostCharsCa,
                            gapLostCharsRange,
                            gapLostCharsUnknown,
                            gapLostLines,
                            gapLostLinesRange,
                            gapLostLinesCa,
                            gapLostLinesUnknown
                        }).map((snippetEntry) => ({
                            ...snippetItem(snippetEntry),
                            active: inlineNodeActive()
                        }))
                    })()
                }, {
                    id: "illegibles",
                    label: "Illegible",
                    items: (() => {
                        const {illegibleChars, illegibleCharsRange, illegibleCharsCa, illegibleCharsUnknown, illegibleLines, illegibleLinesRange, illegibleLinesCa} = snippets;
                        return Object.entries({
                            illegibleChars, illegibleCharsRange, illegibleCharsCa, illegibleCharsUnknown, illegibleLines, illegibleLinesRange, illegibleLinesCa
                        }).map((snippetEntry) => ({
                            ...snippetItem(snippetEntry),
                            active: inlineNodeActive()
                        }))
                    })()
                }, {
                    id: "vacats",
                    label: "Vacat",
                    items: (() => {
                        const {vacatChars, vacatCharsRange, vacatCharsCa, vacatCharsUnknown, vacatLines, vacatLinesRange, vacatLinesCa, vacatLinesUnknown} = snippets;
                        return Object.entries({
                            vacatChars, vacatCharsRange, vacatCharsCa, vacatCharsUnknown, vacatLines, vacatLinesRange, vacatLinesCa, vacatLinesUnknown
                        }).map((snippetEntry) => ({
                            ...snippetItem(snippetEntry),
                            active: inlineNodeActive()
                        }))
                    })()
                }, {
                    id: "vestiges",
                    label: "Vestiges",
                    items: (() => {
                        const {vestigChars, vestigCharsRange, vestigCharsCa, vestigLines, vestigLinesRange, vestigLinesCa, vestigLinesUnknown} = snippets;
                        return Object.entries({
                            vestigChars, vestigCharsRange, vestigCharsCa, vestigLines, vestigLinesRange, vestigLinesCa, vestigLinesUnknown
                        }).map((snippetEntry) => ({
                            ...snippetItem(snippetEntry),
                            active: inlineNodeActive()
                        }))
                    })()
                }, {
                    id: "omissions",
                    label: "Omissions",
                    items: (() => {
                        const {gapOmittedChars, gapOmittedCharsUnknown} = snippets;
                        return Object.entries({
                            gapOmittedChars, gapOmittedCharsUnknown
                        }).map((snippetEntry) => ({
                            ...snippetItem(snippetEntry),
                            active: inlineNodeActive()
                        }))
                    })()
                }],
            }, {
                id: "non-transcribed",
                label: "Not transcribed",
                items: [{
                    id: "not-transcribed-language",
                    label: "Language not transcribed",
                    items: (() => {
                        const {nonTranscribedLanguageChars, nonTranscribedLanguageCharsUnknown, nonTranscribedLanguageLines, nonTranscribedLanguageLinesCa, nonTranscribedLanguageLinesUnknown} = snippets;
                        return Object.entries({nonTranscribedLanguageChars, nonTranscribedLanguageCharsUnknown, nonTranscribedLanguageLines, nonTranscribedLanguageLinesCa, nonTranscribedLanguageLinesUnknown}).map((snippetEntry) => ({
                            ...snippetItem(snippetEntry),
                            active: inlineNodeActive(),
                        }))
                    })()
                }, {
                    id: "untranscribed-chars",
                    label: "Untranscribed characters",
                    items: (() => {
                        const {untranscribedChars, untranscribedCharsRange, untranscribedCharsCa, untranscribedCharsUnknown} = snippets;
                        return Object.entries({untranscribedChars, untranscribedCharsRange, untranscribedCharsCa, untranscribedCharsUnknown}).map((snippetEntry) => ({
                            ...snippetItem(snippetEntry),
                            active: inlineNodeActive(),
                        }))
                    })()
                }, {
                    "id": "untranscribed-lines",
                    label: "Untranscribed lines",
                    items: (() => {
                        const {untranscribedLines, untranscribedLinesRange, untranscribedLinesCa, untranscribedLinesUnknown} = snippets;
                        return Object.entries({untranscribedLines, untranscribedLinesRange, untranscribedLinesCa, untranscribedLinesUnknown}).map((snippetEntry) => ({
                            ...snippetItem(snippetEntry),
                            active: inlineNodeActive(),
                        }))
                    })()
                }, {
                    "id": "untranscribed-columns",
                    label: "Untranscribed columns",
                    items: (() => {
                        const {untranscribedColumns, untranscribedColumnsRange, untranscribedColumnsCa, untranscribedColumnsUnknown} = snippets;
                        return Object.entries({untranscribedColumns, untranscribedColumnsRange, untranscribedColumnsCa, untranscribedColumnsUnknown}).map((snippetEntry) => ({
                            ...snippetItem(snippetEntry),
                            active: inlineNodeActive(),
                        }))
                    })()
                }]
            }, {
                id: "insertions",
                label: "Insertion",
                items: (() => {
                    const {insertionAbove, insertionBelow, insertionMarginLeft, insertionMarginRight, insertionMarginTop, insertionMarginBottom, insertionMargin, insertionMarginSling, insertionMarginUnderline, insertionInterlinear} = snippets;
                    return Object.entries({insertionAbove, insertionBelow, insertionMarginLeft, insertionMarginRight, insertionMarginTop, insertionMarginBottom, insertionMargin, insertionMarginSling, insertionMarginUnderline, insertionInterlinear}).map(snippetEntry => ({
                        ...snippetItem(snippetEntry),
                        active: inlineNodeActive()
                    }))
                })()
            }, {
                id: "line-numbers",
                label: "Line numbers",
                items: [...(() => {
                    const {lineNumber, lineNumberBreak, lineNumberUnknown} = snippets;
                    return Object.entries({lineNumber, lineNumberBreak}).map(snippetEntry => ({
                        ...snippetItem(snippetEntry),
                        active: inlineNodeActive()
                    }))
                })(), {
                    id: "line-numbers-margin",
                    label: "Line written in margin",
                    items: (() => {
                        const {lineNumberMarginLeft, lineNumberMarginRight, lineNumberMarginUpper, lineNumberMarginLower, lineNumberMarginPerpendicularLeft, lineNumberMarginPerpendicularRight, lineNumberMarginInverseLower} = snippets;
                        return Object.entries({lineNumberMarginLeft, lineNumberMarginRight, lineNumberMarginUpper, lineNumberMarginLower, lineNumberMarginPerpendicularLeft, lineNumberMarginPerpendicularRight, lineNumberMarginInverseLower}).map(snippetEntry => ({
                            ...snippetItem(snippetEntry),
                            active: inlineNodeActive()
                        }))
                    })()
                }, {
                    id: "line-numbers-relative",
                    label: "Lines relative to the main text",
                    items: (() => {
                        const {lineNumberPerpendicular, lineNumberInverse, lineNumberIndented, lineNumberOutdented} = snippets;
                        return Object.entries({lineNumberPerpendicular, lineNumberInverse, lineNumberIndented, lineNumberOutdented}).map(snippetEntry => ({
                            ...snippetItem(snippetEntry),
                            active: inlineNodeActive()
                        }))
                    })()
                }],
            }, {
                id: "numbers",
                label: "Numbers",
                items: (() => {
                    const {
                        number,
                        numberFraction,
                        numberFractionUnknown,
                        numberRange,
                        numberRangeUnknownEnd,
                        numberTick,
                        numberTickFraction,
                        numberTickFractionUnknown,
                    } = snippets;
                    return Object.entries({
                        number,
                        numberFraction,
                        numberFractionUnknown,
                        numberRange,
                        numberRangeUnknownEnd,
                        numberTick,
                        numberTickFraction,
                        numberTickFractionUnknown
                    }).map(snippetEntry => ({
                        ...snippetItem(snippetEntry),
                        active: inlineNodeActive()
                    }))
                })(),
            }, {
                id: "supplied",
                label: "Supplied text",
                items: (() => {
                    const {suppliedLost, suppliedLostParallel, suppliedParallel, suppliedOmitted} = snippets
                    return Object.entries({suppliedLost, suppliedLostParallel, suppliedParallel, suppliedOmitted}).map((snippetEntry) => ({
                        ...snippetItem(snippetEntry),
                        active: inlineNodeActive()
                    }))
                })()
            }, {
                id: "textual-features",
                label: "Textual features",
                items: (() => {
                    const {textTall, textSubscript, textSuperscript, textSupraline, textSupralineUnderline} = snippets
                    return Object.entries({textTall, textSubscript, textSuperscript, textSupraline, textSupralineUnderline}).map((snippetEntry) => ({
                        ...snippetItem(snippetEntry),
                        active: inlineNodeActive()
                    }))
                })()
            }, {
                id: "other",
                label: "Other annotations",
                items: (() => {
                    const {handShift, editorialNote, editorialNoteRef, surplus, quotation} = snippets
                    return Object.entries({handShift, editorialNote, editorialNoteRef, surplus, quotation}).map((snippetEntry) => ({
                        ...snippetItem(snippetEntry),
                        active: inlineNodeActive()
                    }))
                })()
            }],
        },
        {
            id: "symbols",
            label: "Symbols",
            items: [...(() => {
                const {figure, filler, glyph} = snippets
                return Object.entries({figure, filler, glyph}).map((snippetEntry) => ({
                    ...snippetItem(snippetEntry),
                    active: inlineNodeActive()
                }))
            })(),
            {
              id: "ancient-diacrits",
              label: "Ancient diacriticals",
              info: " ὑ(¨)",
              items: [...diacritItems, {
                  id: "ancient-diacrits-double",
                  label: "Double diacriticals",
                  items: doubleDiacritFirstItems
              }]
            },
            {
                id: "milestones",
                label: "Milestone",
                items: (() => {
                    const {paragraphos, horizontalRule, wavyLine, dipleObelismene, coronis, textInBox} = snippets
                    return Object.entries({paragraphos, horizontalRule, wavyLine, dipleObelismene, coronis, textInBox}).map((snippetEntry) => ({
                        ...snippetItem(snippetEntry),
                        active: inlineNodeActive()
                    }))
                })()
            }]
        },
        {type: "divider"},
        {
            id: "abbreviation",
            label: "(a(bc))",
            action: (view) => applySnippet(view, snippets.abbreviation),
            tooltip: snippets.abbreviation.completion.displayLabel + " " + snippets.abbreviation.completion.detail,
            menuTooltip: "More abbreviation markup",
            items: [
                {
                    id: "abbreviation-unresolved",
                    label: "Abbreviation, not resolved (|abc|)",
                    action: (view) => applySnippet(view, snippets.abbreviationUnresolved),
                    active: inlineNodeActive()
                }
            ],
            active: inlineNodeActive()
        },
        {
            id: "supplied-lost",
            label: "[abc]",
            tooltip: "Lost text, supplied/restored",
            menuTooltip: "More lost text markup",
            action: (view) => applySnippet(view, snippets.suppliedLost),
            items: (() => {
                const {gapLostChars, gapLostCharsCa, gapLostCharsRange, gapLostCharsUnknown} = snippets;
                return Object.entries({
                    gapLostChars,
                    gapLostCharsCa,
                    gapLostCharsRange,
                    gapLostCharsUnknown
                }).map((snippetEntry) => ({
                    ...snippetItem(snippetEntry),
                    active: inlineNodeActive()
                }))
            })(),
            active: inlineNodeActive()
        },
        {
            id: "deletion",
            label:  "⟦abc⟧",
            tooltip: "Deleted text",
            menuTooltip: "More deletion markup",
            action: (view) => applySnippet(view, snippets.deletion),
            items: (() => {
                const {deletionSlashes, deletionCrossStrokes} = snippets;
                return Object.entries({deletionSlashes, deletionCrossStrokes}).map(snippetEntry => ({
                    ...snippetItem(snippetEntry),
                    active: inlineNodeActive()
                }))
            })(),
            active: inlineNodeActive()
        },
        {
            id: "number",
            label: "№",
            tooltip: "Number",
            action: (view) => {
                applySnippet(view, snippets.number);
            },
            items: (() => {
                const {
                    numberFraction,
                    numberFractionUnknown,
                    numberRange,
                    numberRangeUnknownEnd,
                    numberTick,
                    numberTickFraction,
                    numberTickFractionUnknown,
                } = snippets;
                return Object.entries({
                    numberFraction,
                    numberFractionUnknown,
                    numberRange,
                    numberRangeUnknownEnd,
                    numberTick,
                    numberTickFraction,
                    numberTickFractionUnknown
                }).map(snippetEntry => ({
                    ...snippetItem(snippetEntry),
                    active: inlineNodeActive()
                }))
            })(),
            active: inlineNodeActive()
        },
        {type: "divider"},
        {
            id: "unclear",
            label: "ạ",
            tooltip: "Mark as unclear",
            action: (view) => {
                const availableRanges = view.state.field(availableUnderdotRanges)
                view.dispatch({
                    changes: availableRanges.map(range => {
                        const text = view.state.doc.sliceString(range.from, range.to)
                        const process =
                            range.name === "Unclear" || range.name === "SupralineUnclear" ? removeCombining : addCombining
                        return {from: range.from, to: range.to, insert: process(text, ['\u0323'])}
                    })
                })
            },
            active: state.field(availableUnderdotRanges).length > 0,
            hoverAction: {
                enter: (view) => {
                    const availableRanges = view.state.field(availableUnderdotRanges)
                    view.dispatch({effects: [setHighlights.of(availableRanges)]})
                },
                leave: (view) => view.dispatch({effects: [clearHighlights.of()]})
            }
        },
        {
            id: "supraline-macron",
            label: "ā",
            tooltip: "Supraline",
            action: (view) => {
                const availableRanges = view.state.field(availableUnderdotRanges)
                view.dispatch({
                    changes: availableRanges.map(range => {
                        const text = view.state.doc.sliceString(range.from, range.to)
                        const process =
                            range.name === "SupralineMacronContent" || range.name === "SupralineUnclear" ? removeCombining : addCombining
                        return {from: range.from, to: range.to, insert: process(text, ['\u0304'])}
                    })
                })
            },
            active: state.field(availableUnderdotRanges).length > 0,
            hoverAction: {
                enter: (view) => {
                    const availableRanges = view.state.field(availableUnderdotRanges)
                    view.dispatch({effects: [setHighlights.of(availableRanges)]})
                },
                leave: (view) => view.dispatch({effects: [clearHighlights.of()]})
            }
        },
        {type: "divider"}
    ];
}

export function toolbarPanel(view) {
    const menus = new Set()

    const style = document.createElement('style');
    style.innerText = css
    const panel = document.createElement('div');
    panel.classList.add('toolbar')
    panel.role = "toolbar"
    panel.ariaLabel = "Toolbar"
    panel.appendChild(style);
    panel.addEventListener('click', (e) => {
        const toolbarItem = e.target.closest(".toolbar-button");
        if (!toolbarItem) {
            return
        }
        e.preventDefault();

        if (hasMenu(toolbarItem)) {
            if (isMenuOpen(toolbarItem)) {
                closeMenuForTrigger(toolbarItem);
            } else {
                closeAllMenusUnder(menuParent)
                void openMenuAndFocus(toolbarItem);
            }

        }
    })

    panel.addEventListener('keydown', async (e) => {
        const toolbarItem = e.target.closest(".toolbar-button");
        if (!toolbarItem) {
            return
        }

        const items = getToolbarItems();
        const currentIndex = items.indexOf(toolbarItem);

        switch(e.key) {
            case 'ArrowRight': {
                e.preventDefault();
                moveToolbarFocus(toolbarItem, getNextCircularItem(currentIndex, items));
                break;
            }

            case 'ArrowLeft': {
                e.preventDefault();
                moveToolbarFocus(toolbarItem, getPreviousCircularItem(currentIndex, items));
                break;
            }

            case 'Home': {
                e.preventDefault();
                moveToolbarFocus(toolbarItem, items[0])
                break;
            }

            case 'End': {
                e.preventDefault();
                moveToolbarFocus(toolbarItem, items[items.length - 1])
                break
            }

            case 'ArrowDown': {
                e.preventDefault();
                if (hasMenu(e.target)) {
                    void openMenuAndFocus(toolbarItem);
                }
                break
            }

            case 'ArrowUp': {
                e.preventDefault();
                if (hasMenu(e.target)) {
                    void openMenuAndFocus(toolbarItem, false);
                }
                break;
            }

            case 'Escape': {
                closeAllMenusUnder(menuParent)
            }
        }
    })

    const menuParent = document.createElement('div')
    menuParent.classList.add('menu-container')
    view.dom.appendChild(menuParent)

    // close when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuParent.contains(e.target) && !panel.contains(e.target)) {
            closeAllMenusUnder(menuParent)
        }
    })

    const focusOutListener = (e) => {
        const newTarget = e.relatedTarget
        if (!newTarget || (!menuParent.contains(newTarget) && !panel.contains(newTarget))) {
            closeAllMenusUnder(menuParent)
        }}

    menuParent.addEventListener('focusout', focusOutListener)
    panel.addEventListener('focusout', focusOutListener)

    const getMenuEl = (triggerEl) => {
        const menuId = triggerEl.getAttribute('aria-controls');
        return menuParent.querySelector(`#${menuId}`);
    }

    const getTriggerEl = (menuEl) =>
        view.dom.querySelector(`[aria-controls=${menuEl.id}]`)

    const isMenuOpen = (triggerEl) =>
        triggerEl.getAttribute('aria-expanded') === 'true'

    const hasMenu = (triggerEl) =>
        triggerEl.getAttribute('aria-haspopup') === 'true'

    const getToolbarItems = ()=>
        Array.from(panel.querySelectorAll(":scope .toolbar-button"))

    const openMenu = async (triggerEl) => {
        const menuEl = getMenuEl(triggerEl);
        const hasParentMenu = triggerEl.role === "menuitem"

        const placement = hasParentMenu ? 'right-start' : 'bottom-start';
        const fallbackPlacements = hasParentMenu
            ? ['left-start', 'top-start', 'bottom-start']
            : ['top-start', 'right-start', 'left-start'];

        const { x, y } = await computePosition(triggerEl, menuEl, {
            strategy: 'fixed',
            placement,
            middleware: [
                offset(4),
                flip({
                    fallbackPlacements,
                }),
                shift({ padding: 8 }),
                size({
                    padding: 8,
                    apply({_availableWidth, availableHeight, elements}) {
                        Object.assign(elements.floating.style, {
                            maxHeight: `${Math.max(0, availableHeight)}px`,
                        });
                    },
                }),
            ],
        });

        Object.assign(menuEl.style, {
            left: `${x}px`,
            top: `${y}px`,
        });

        triggerEl.setAttribute('aria-expanded', 'true');
        menuEl.setAttribute('data-show', '');
    }

    const closeAllMenusUnder = (parentEl) => {
        const menus = parentEl.querySelectorAll(":scope [role=menu][data-show]");
        menus.forEach(menu => closeMenu(menu))
    }

    const closeMenu = (menuEl) => {
        const triggerEl = getTriggerEl(menuEl);

        triggerEl.setAttribute('aria-expanded', 'false');
        menuEl.removeAttribute('data-show');

        closeAllMenusUnder(menuEl);
    }

    const closeMenuForTrigger = (triggerEl) => {
        if (hasMenu(triggerEl) && isMenuOpen(triggerEl)) {
            const menuEl = getMenuEl(triggerEl)
            closeMenu(menuEl)
        }
    }

    const moveToolbarFocus = (sourceItem, targetItem) => {
        closeMenuForTrigger(sourceItem)
        sourceItem.tabIndex = -1;
        targetItem.tabIndex = 0;
        targetItem.focus()
    }

    const getMenuItems = menuEl =>
        Array.from(menuEl.querySelectorAll(":scope > [role=menuitem]"));

    const getNextCircularItem = (currentIndex, items) =>
        items[(currentIndex + 1) % items.length]

    const getPreviousCircularItem = (currentIndex, items) =>
        items[(currentIndex - 1 + items.length) % items.length]

    const openMenuAndFocus = async (triggerEl, first = true) => {
        if (!isMenuOpen(triggerEl)) {
            await openMenu(triggerEl);
        }

        const menuEl = getMenuEl(triggerEl);
        const menuItems = getMenuItems(menuEl)

        const focusEl = first ? menuItems[0] : menuItems[menuItems.length - 1];
        focusEl.focus();
    }

    const moveMenuItemFocus = (menuEl, sourceItem, targetItem) => {
        closeAllMenusUnder(menuEl);
        targetItem.focus();
        if (hasMenu(targetItem)) {
            void openMenu(targetItem);
        }
    }

    const menuKeydownHandler = async (e) => {
        const currentItem = e.target;

        if (currentItem !== document.activeElement) {
            return
        }


        const menuEl = e.currentTarget;
        const items = getMenuItems(menuEl);
        const currentIndex = items.indexOf(currentItem);

        switch(e.key) {
            case 'ArrowDown': {
                e.preventDefault();
                moveMenuItemFocus(menuEl, currentItem, getNextCircularItem(currentIndex, items));
                break;
            }

            case 'ArrowUp': {
                e.preventDefault();
                moveMenuItemFocus(menuEl, currentItem, getPreviousCircularItem(currentIndex, items));
                break;
            }

            case 'Home': {
                e.preventDefault();
                moveMenuItemFocus(menuEl, currentItem, items[0]);
                break;
            }

            case 'End': {
                e.preventDefault();
                moveMenuItemFocus(menuEl, currentItem, items[items.length - 1]);
                break;
            }

            case 'Escape': {
                e.preventDefault();
                const triggerEl = getTriggerEl(menuEl);
                if (isMenuOpen(triggerEl)) {
                    closeMenu(menuEl);
                    triggerEl.focus();
                }
                break;
            }

            case 'ArrowRight': {
                e.preventDefault();

                if (hasMenu(currentItem)) {
                    void openMenuAndFocus(currentItem);
                } else {
                    const toolbarItems = getToolbarItems()
                    const currentToolbarItem = panel.querySelector("[aria-expanded=true]");
                    const currentToolbarIndex = toolbarItems.indexOf(currentToolbarItem)
                    moveToolbarFocus(currentToolbarItem, getNextCircularItem(currentToolbarIndex, toolbarItems));
                }
                break;
            }

            case 'ArrowLeft': {
                e.preventDefault();
                const currentToolbarItem = panel.querySelector("[aria-expanded=true]");

                void closeMenu(menuEl)

                const triggerThatOpenedThis = getTriggerEl(menuEl);
                if (triggerThatOpenedThis.role === "menuitem") {
                    triggerThatOpenedThis.focus();
                } else {
                    const toolbarItems = getToolbarItems();
                    const currentToolbarIndex = toolbarItems.indexOf(currentToolbarItem);
                    moveToolbarFocus(currentToolbarItem, getPreviousCircularItem(currentToolbarIndex, toolbarItems));
                }

                break;
            }
        }
    }

    const createSplitButton = (parent, {id, label, action, items, tooltip, menuTooltip, active}, tabIndex = -1) => {
        return html`
            <div class="split-button-container">
                ${createButton(parent, {id, label, action, items, tooltip, menuTooltip, active}, tabIndex)}
                <button 
                        class="toolbar-button more-button" 
                        id="more-${id}"
                        aria-haspopup="true"
                        aria-expanded="false"
                        aria-controls="menu-${id}"
                        tabindex="${tabIndex}"
                        title="${menuTooltip}"
                ></button>
            </div>
        `
    }


    const createButton = (parent, {id, label, action, items, tooltip, menuTooltip, active, hoverAction}, tabIndex = -1) => {
        return html`
            <button class="toolbar-button" 
                    id="button-${id}" 
                    title=${tooltip}
                    tabindex="${tabIndex}"
                    @click="${(e) => {
                        e.preventDefault();
                        action(view);
                        view.focus();
                    }}"
                    ?disabled="${active !== undefined && !active}"
                    @mouseenter="${() => {hoverAction && hoverAction.enter(view)}}"
                    @mouseleave="${() => {hoverAction && hoverAction.leave(view)}}"
            >${label}</button>
        `

    }

    const createMenuButton = (parent, {id, label, action, items, tooltip, menuTooltip}, menuRef, tabIndex = -1) => {
        return html`
            <button
                    class="toolbar-button"
                    id="more-${id}"
                    aria-haspopup="true"
                    aria-expanded="false"
                    aria-controls="menu-${id}"
                    tabindex="${tabIndex}"
                    title="${tooltip}"
            >${label}</button>
        `
    }

    let openTimeout;
    let closeTimeout;

    const createMenuEl = ({id, items, active}, ref) => {
        return html`
            <div
                    ${ref ?? nothing} id="menu-${id}" class="menu" role="menu"
                    aria-label="Format options"
                    @keydown=${menuKeydownHandler}
                    @mouseenter=${() => clearTimeout(closeTimeout)}
                    @mouseleave=${(e) => {
                        closeTimeout = setTimeout(() => closeMenu(e.target), 100)
                    }}
            >
                ${items ? items.map(item => createMenuItem(id, null, item)) : ""}
            </div>
            </div>
        `
    }

    const createMenuItem = (parent, menu, {id, label, action, items, active, info}) => {
        return html`
            ${items ? createMenuEl({id, items}, null) : ""}
            <button
                    aria-haspopup=${items ? "true" : nothing}
                    aria-expanded=${items ? "false" : nothing}
                    aria-controls=${items ? `menu-${id}` : nothing}
                    tabindex="-1" 
                    class="menu-item" role="menuitem" id="menu-item-${id}"
                    ?disabled="${active !== undefined && !active}"
                    @mouseenter=${(e) => {
                        e.preventDefault()
                        const menuItem = e.target
                        if (!hasMenu(menuItem)) {
                            return
                        }
                        
                        clearTimeout(closeTimeout)
                        const parentMenu = menuItem.closest("[role=menu]")
                        closeAllMenusUnder(parentMenu)
                        openTimeout = setTimeout(() => void openMenu(menuItem), 100)

                    }}
                    @mouseleave=${(e) => {
                        e.preventDefault()
                        clearTimeout(openTimeout)
                        if (hasMenu(e.target)) {
                            const menuEl = getMenuEl(e.target)

                            if (!menuEl.contains(e.relatedTarget)) {
                                closeTimeout = setTimeout(() => closeMenu(menuEl), 100)
                            }
                        }
                    }}
                    @click=${ action ? (e) => {
                        e.preventDefault()
                        closeAllMenusUnder(menuParent);
                        action(view);
                        view.focus();
                    } : nothing}
            >
                <span class="label">${label}</span>
                <span class="info">${info}</span>
            </button>
        `
    }

    const createDivider = () => html`
        <div class="toolbar-divider"></div>
    `

    const toolbarMenuRefs = new Map();
    const makeRef = (id) => {
        if (!toolbarMenuRefs.has(id)) {
            toolbarMenuRefs.set(id, createRef())
        }
        return toolbarMenuRefs.get(id)
    }

    const renderToolbar = (view) => {
        const config = toolbarConfig(view.state);

        render(html`${
            config.filter(button => button.items)
                .map(button => createMenuEl(button, makeRef(button.id)))
        }`, menuParent)


        render(html`${config.map((button, index) => {
                if (button.type === "divider") {
                    return createDivider()   
                }
            
                const tabIndex = index === 0 ? 0 : -1;
                if (button.action && button.items) {
                    return createSplitButton(panel, button, tabIndex);
                }

                return button.items
                    ? createMenuButton(panel, button, toolbarMenuRefs.get(button.id), tabIndex)
                    : createButton(panel, button, tabIndex);
            }
        )}`, panel)
    }

    return {
        dom: panel,
        top: true,
        mount() {
            renderToolbar(view)

            // Update positions on scroll and resize
            window.addEventListener('scroll', () => {
                menus.values().forEach(menu => menu.updatePosition());
            });

            window.addEventListener('resize', () => {
                menus.values().forEach(menu => menu.updatePosition());
            });

        },
        update(update) {

            if (update.transactions.some(transaction => transaction.reconfigured)) {
                console.log(update.view.dom.querySelector('.cm-panels'))
                const panelBg = getComputedStyle(update.view.dom.querySelector('.cm-panels')).backgroundColor
                this.dom.querySelectorAll(':scope > [role=menu]').forEach(menu => menu.style.backgroundColor = panelBg)
            }

            if (update.docChanged || update.selectionSet) {
                renderToolbar(update.view);
            }
        }

    }
}

export const leidenToolbar = [
    availableUnderdotRanges, highlightField, highlightTheme, showPanel.of(toolbarPanel),
]