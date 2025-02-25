import {
    MenuTrigger,
    setPreviewHighlights,
    toolbar,
    toolbarConfig
} from "@leiden-plus/ui-toolbar";
import {Extension} from "@codemirror/state";
import {inlineContentAllowed, snippets} from "@leiden-plus/codemirror-lang-leiden-plus";
import { SnippetDef} from "@leiden-plus/lib/language";
import { MenuItem } from "@leiden-plus/ui-toolbar";
import {applySnippet} from "@leiden-plus/lib/language";
import {addCombiningMarks, removeCombiningMarks} from "@leiden-plus/lib/util";
import {syntactialDiacritRanges} from "./syntacticalDiacritRanges.js";

const ancientDiacrits = {
    Acute: "´",
    Asper: " ῾",
    Circumflex: "^",
    Diaeresis: "¨",
    Grave: "`",
    Lenis: " ᾿",
}

export const leidenPlusToolbar: Extension[] = [
    toolbarConfig.of((state) => {
        const snippetItem = ([id, snippetDef]: [string, SnippetDef]): MenuItem => ({
            type: "action",
            id,
            label: `${snippetDef.completion.displayLabel}${snippetDef.completion.detail ? ", " + snippetDef.completion.detail : ""}`,
            action: (view) => applySnippet(view, snippetDef),
            active: inlineContentAllowed(state),
            info: snippetDef.completion.info
        })

        const inlineAllowed = () => inlineContentAllowed(state)


        const diacritItems = Object.entries(ancientDiacrits).map<MenuItem>(([name, diacrit]) => ({
            type: "action",
            id: name.toLowerCase(),
            label: name,
            active: inlineAllowed(),
            action: (view) => {
                applySnippet(view, {
                    template: ` \${char}(${diacrit})`
                })
            }
        }))

        const doubleDiacritFirstItems = Object.entries(ancientDiacrits).map<MenuTrigger>(([name, diacrit]) => ({
            type: "menu",
            id: `${name.toLowerCase()}-with`,
            label: `${name} with`,
            active: inlineAllowed(),
            items: Object.entries(ancientDiacrits)
                .filter(([secondName]) => secondName !== name)
                .map(([secondName, secondDiacrit]) => ({
                    type: "action",
                    id: `with-${secondName.toLowerCase()}`,
                    label: `${secondName}`,
                    action: (view) => {
                        applySnippet(view, {
                            template: ` \${char}(${diacrit}${secondDiacrit})`
                        })
                    }
                }))
        }))


        return ({
            items: [
                {
                    type: "menu",
                    id: "markup",
                    label: "Markup",
                    items: [
                        {
                            type: "menu",
                            id: "abbreviations",
                            label: "Abbreviations",
                            items: (() => {
                                const {abbreviation, abbreviationUnresolved} = snippets;
                                return Object.entries({abbreviation, abbreviationUnresolved}).map(snippetEntry => ({
                                    ...snippetItem(snippetEntry),
                                    active: inlineAllowed()
                                }))
                            })(),
                        }, {
                            type: "menu",
                            id: "apparatus",
                            label: "Apparatus",
                            items: (() => {
                                const {
                                    modernRegularization,
                                    modernCorrection,
                                    scribalCorrection,
                                    alternateReading,
                                    editorialCorrection
                                } = snippets;
                                return Object.entries({
                                    modernRegularization,
                                    modernCorrection,
                                    scribalCorrection,
                                    alternateReading,
                                    editorialCorrection
                                }).map(snippetEntry => ({
                                    ...snippetItem(snippetEntry),
                                    active: inlineAllowed()
                                }))
                            })(),
                        }, {
                            type: "menu",
                            id: "deletions",
                            label: "Deletion/cancellation",
                            items: (() => {
                                const {deletion, deletionSlashes, deletionCrossStrokes} = snippets;
                                return Object.entries({
                                    deletionSlashes,
                                    deletionCrossStrokes,
                                    deletion
                                }).map(snippetEntry => ({
                                    ...snippetItem(snippetEntry),
                                    active: inlineAllowed()
                                }))
                            })(),
                        }, {
                            type: "menu",
                            id: "doc-divisions",
                            label: "Document divisions",
                            items: (() => {
                                const {
                                    divisionRecto,
                                    divisionVerso,
                                    divisionColumn,
                                    divisionFolio,
                                    divisionFragment,
                                    divisionOther,
                                    divisionOtherRef
                                } = snippets;
                                return Object.entries({
                                    divisionRecto,
                                    divisionVerso,
                                    divisionColumn,
                                    divisionFolio,
                                    divisionFragment,
                                    divisionOther,
                                    divisionOtherRef
                                }).map(snippetEntry => ({
                                    ...snippetItem(snippetEntry),
                                    active: inlineAllowed() // TODO
                                }))
                            })()
                        }, {
                            type: "menu",
                            id: "foreign-lang",
                            label: "Foreign language",
                            items: (() => {
                                const {foreignLatin, foreignGreek, foreign} = snippets;
                                return Object.entries({foreignLatin, foreignGreek, foreign}).map((snippetEntry) => ({
                                    ...snippetItem(snippetEntry),
                                    active: inlineAllowed()
                                }))
                            })(),
                        }, {
                            type: "menu",
                            id: "gaps",
                            label: "Gaps (missing/illegible)",
                            items: [
                                {
                                    type: "menu",
                                    id: "lacunae",
                                    label: "Lacuna",
                                    items: (() => {
                                        const {
                                            gapLostChars,
                                            gapLostCharsCa,
                                            gapLostCharsRange,
                                            gapLostCharsUnknown,
                                            gapLostLines,
                                            gapLostLinesRange,
                                            gapLostLinesCa,
                                            gapLostLinesUnknown
                                        } = snippets;
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
                                            active: inlineAllowed()
                                        }))
                                    })()
                                }, {
                                    type: "menu",
                                    id: "illegibles",
                                    label: "Illegible",
                                    items: (() => {
                                        const {
                                            illegibleChars,
                                            illegibleCharsRange,
                                            illegibleCharsCa,
                                            illegibleCharsUnknown,
                                            illegibleLines,
                                            illegibleLinesRange,
                                            illegibleLinesCa
                                        } = snippets;
                                        return Object.entries({
                                            illegibleChars,
                                            illegibleCharsRange,
                                            illegibleCharsCa,
                                            illegibleCharsUnknown,
                                            illegibleLines,
                                            illegibleLinesRange,
                                            illegibleLinesCa
                                        }).map((snippetEntry) => ({
                                            ...snippetItem(snippetEntry),
                                            active: inlineAllowed()
                                        }))
                                    })()
                                }, {
                                    type: "menu",
                                    id: "vacats",
                                    label: "Vacat",
                                    items: (() => {
                                        const {
                                            vacatChars,
                                            vacatCharsRange,
                                            vacatCharsCa,
                                            vacatCharsUnknown,
                                            vacatLines,
                                            vacatLinesRange,
                                            vacatLinesCa,
                                            vacatLinesUnknown
                                        } = snippets;
                                        return Object.entries({
                                            vacatChars,
                                            vacatCharsRange,
                                            vacatCharsCa,
                                            vacatCharsUnknown,
                                            vacatLines,
                                            vacatLinesRange,
                                            vacatLinesCa,
                                            vacatLinesUnknown
                                        }).map((snippetEntry) => ({
                                            ...snippetItem(snippetEntry),
                                            active: inlineAllowed()
                                        }))
                                    })()
                                }, {
                                    type: "menu",
                                    id: "vestiges",
                                    label: "Vestiges",
                                    items: (() => {
                                        const {
                                            vestigChars,
                                            vestigCharsRange,
                                            vestigCharsCa,
                                            vestigLines,
                                            vestigLinesRange,
                                            vestigLinesCa,
                                            vestigLinesUnknown
                                        } = snippets;
                                        return Object.entries({
                                            vestigChars,
                                            vestigCharsRange,
                                            vestigCharsCa,
                                            vestigLines,
                                            vestigLinesRange,
                                            vestigLinesCa,
                                            vestigLinesUnknown
                                        }).map((snippetEntry) => ({
                                            ...snippetItem(snippetEntry),
                                            active: inlineAllowed()
                                        }))
                                    })()
                                }, {
                                    type: "menu",
                                    id: "omissions",
                                    label: "Omissions",
                                    items: (() => {
                                        const {gapOmittedChars, gapOmittedCharsUnknown} = snippets;
                                        return Object.entries({
                                            gapOmittedChars, gapOmittedCharsUnknown
                                        }).map((snippetEntry) => ({
                                            ...snippetItem(snippetEntry),
                                            active: inlineAllowed()
                                        }))
                                    })()
                                }
                            ],
                        }, {
                            type: "menu",
                            id: "non-transcribed",
                            label: "Not transcribed",
                            items: [
                                {
                                    type: "menu",
                                    id: "not-transcribed-language",
                                    label: "Language not transcribed",
                                    items: (() => {
                                        const {
                                            nonTranscribedLanguageChars,
                                            nonTranscribedLanguageCharsUnknown,
                                            nonTranscribedLanguageLines,
                                            nonTranscribedLanguageLinesCa,
                                            nonTranscribedLanguageLinesUnknown
                                        } = snippets;
                                        return Object.entries({
                                            nonTranscribedLanguageChars,
                                            nonTranscribedLanguageCharsUnknown,
                                            nonTranscribedLanguageLines,
                                            nonTranscribedLanguageLinesCa,
                                            nonTranscribedLanguageLinesUnknown
                                        }).map((snippetEntry) => ({
                                            ...snippetItem(snippetEntry),
                                            active: inlineAllowed(),
                                        }))
                                    })()
                                }, {
                                    type: "menu",
                                    id: "untranscribed-chars",
                                    label: "Untranscribed characters",
                                    items: (() => {
                                        const {
                                            untranscribedChars,
                                            untranscribedCharsRange,
                                            untranscribedCharsCa,
                                            untranscribedCharsUnknown
                                        } = snippets;
                                        return Object.entries({
                                            untranscribedChars,
                                            untranscribedCharsRange,
                                            untranscribedCharsCa,
                                            untranscribedCharsUnknown
                                        }).map((snippetEntry) => ({
                                            ...snippetItem(snippetEntry),
                                            active: inlineAllowed(),
                                        }))
                                    })()
                                }, {
                                    type: "menu",
                                    "id": "untranscribed-lines",
                                    label: "Untranscribed lines",
                                    items: (() => {
                                        const {
                                            untranscribedLines,
                                            untranscribedLinesRange,
                                            untranscribedLinesCa,
                                            untranscribedLinesUnknown
                                        } = snippets;
                                        return Object.entries({
                                            untranscribedLines,
                                            untranscribedLinesRange,
                                            untranscribedLinesCa,
                                            untranscribedLinesUnknown
                                        }).map((snippetEntry) => ({
                                            ...snippetItem(snippetEntry),
                                            active: inlineAllowed(),
                                        }))
                                    })()
                                }, {
                                    type: "menu",
                                    "id": "untranscribed-columns",
                                    label: "Untranscribed columns",
                                    items: (() => {
                                        const {
                                            untranscribedColumns,
                                            untranscribedColumnsRange,
                                            untranscribedColumnsCa,
                                            untranscribedColumnsUnknown
                                        } = snippets;
                                        return Object.entries({
                                            untranscribedColumns,
                                            untranscribedColumnsRange,
                                            untranscribedColumnsCa,
                                            untranscribedColumnsUnknown
                                        }).map((snippetEntry) => ({
                                            ...snippetItem(snippetEntry),
                                            active: inlineAllowed(),
                                        }))
                                    })()
                                }
                            ]
                        }, {
                            type: "menu",
                            id: "insertions",
                            label: "Insertion",
                            items: (() => {
                                const {
                                    insertionAbove,
                                    insertionBelow,
                                    insertionMarginLeft,
                                    insertionMarginRight,
                                    insertionMarginTop,
                                    insertionMarginBottom,
                                    insertionMargin,
                                    insertionMarginSling,
                                    insertionMarginUnderline,
                                    insertionInterlinear
                                } = snippets;
                                return Object.entries({
                                    insertionAbove,
                                    insertionBelow,
                                    insertionMarginLeft,
                                    insertionMarginRight,
                                    insertionMarginTop,
                                    insertionMarginBottom,
                                    insertionMargin,
                                    insertionMarginSling,
                                    insertionMarginUnderline,
                                    insertionInterlinear
                                }).map(snippetEntry => ({
                                    ...snippetItem(snippetEntry),
                                    active: inlineAllowed()
                                }))
                            })()
                        }, {
                            type: "menu",
                            id: "line-numbers",
                            label: "Line numbers",
                            items: [
                                ...(() => {
                                    const {lineNumber, lineNumberBreak} = snippets;
                                    return Object.entries({lineNumber, lineNumberBreak}).map(snippetEntry => ({
                                        ...snippetItem(snippetEntry),
                                        active: inlineAllowed()
                                    }))
                                })(), {
                                    type: "menu",
                                    id: "line-numbers-margin",
                                    label: "Line written in margin",
                                    items: (() => {
                                        const {
                                            lineNumberMarginLeft,
                                            lineNumberMarginRight,
                                            lineNumberMarginUpper,
                                            lineNumberMarginLower,
                                            lineNumberMarginPerpendicularLeft,
                                            lineNumberMarginPerpendicularRight,
                                            lineNumberMarginInverseLower
                                        } = snippets;
                                        return Object.entries({
                                            lineNumberMarginLeft,
                                            lineNumberMarginRight,
                                            lineNumberMarginUpper,
                                            lineNumberMarginLower,
                                            lineNumberMarginPerpendicularLeft,
                                            lineNumberMarginPerpendicularRight,
                                            lineNumberMarginInverseLower
                                        }).map(snippetEntry => ({
                                            ...snippetItem(snippetEntry),
                                            active: inlineAllowed()
                                        }))
                                    })()
                                }, {
                                    type: "menu",
                                    id: "line-numbers-relative",
                                    label: "Lines relative to the main text",
                                    items: (() => {
                                        const {
                                            lineNumberPerpendicular,
                                            lineNumberInverse,
                                            lineNumberIndented,
                                            lineNumberOutdented
                                        } = snippets;
                                        return Object.entries({
                                            lineNumberPerpendicular,
                                            lineNumberInverse,
                                            lineNumberIndented,
                                            lineNumberOutdented
                                        }).map(snippetEntry => ({
                                            ...snippetItem(snippetEntry),
                                            active: inlineAllowed()
                                        }))
                                    })()
                                }
                            ],
                        }, {
                            type: "menu",
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
                                    active: inlineAllowed()
                                }))
                            })(),
                        }, {
                            type: "menu",
                            id: "supplied",
                            label: "Supplied text",
                            items: (() => {
                                const {suppliedLost, suppliedLostParallel, suppliedParallel, suppliedOmitted} = snippets
                                return Object.entries({
                                    suppliedLost,
                                    suppliedLostParallel,
                                    suppliedParallel,
                                    suppliedOmitted
                                }).map((snippetEntry) => ({
                                    ...snippetItem(snippetEntry),
                                    active: inlineAllowed()
                                }))
                            })()
                        }, {
                            type: "menu",
                            id: "textual-features",
                            label: "Textual features",
                            items: (() => {
                                const {
                                    textTall,
                                    textSubscript,
                                    textSuperscript,
                                    textSupraline,
                                    textSupralineUnderline
                                } = snippets
                                return Object.entries({
                                    textTall,
                                    textSubscript,
                                    textSuperscript,
                                    textSupraline,
                                    textSupralineUnderline
                                }).map((snippetEntry) => ({
                                    ...snippetItem(snippetEntry),
                                    active: inlineAllowed()
                                }))
                            })()
                        }, {
                            type: "menu",
                            id: "other",
                            label: "Other annotations",
                            items: (() => {
                                const {handShift, editorialNote, editorialNoteRef, surplus, quotation} = snippets
                                return Object.entries({
                                    handShift,
                                    editorialNote,
                                    editorialNoteRef,
                                    surplus,
                                    quotation
                                }).map((snippetEntry) => ({
                                    ...snippetItem(snippetEntry),
                                    active: inlineAllowed()
                                }))
                            })()
                        }
                    ],
                },
                {
                    type: "menu",
                    id: "symbols",
                    label: "Symbols",
                    items: [
                        ...(() => {
                            const {figure, filler, glyph} = snippets
                            return Object.entries({figure, filler, glyph}).map((snippetEntry) => ({
                                ...snippetItem(snippetEntry),
                                active: inlineAllowed()
                            }))
                        })(),
                        {
                            type: "menu",
                            id: "ancient-diacrits",
                            label: "Ancient diacriticals",
                            info: " ὑ(¨)",
                            items: [
                                ...diacritItems, {
                                    type: "menu",
                                    id: "ancient-diacrits-double",
                                    label: "Double diacriticals",
                                    items: doubleDiacritFirstItems
                                }
                            ]
                        },
                        {
                            type: "menu",
                            id: "milestones",
                            label: "Milestone",
                            items: (() => {
                                const {
                                    paragraphos,
                                    horizontalRule,
                                    wavyLine,
                                    dipleObelismene,
                                    coronis,
                                    textInBox
                                } = snippets
                                return Object.entries({
                                    paragraphos,
                                    horizontalRule,
                                    wavyLine,
                                    dipleObelismene,
                                    coronis,
                                    textInBox
                                }).map((snippetEntry) => ({
                                    ...snippetItem(snippetEntry),
                                    active: inlineAllowed()
                                }))
                            })()
                        }
                    ]
                },
                {type: "divider"},
                {
                    type: "split",
                    id: "abbreviation",
                    label: "(a(bc))",
                    action: (view) => applySnippet(view, snippets.abbreviation),
                    tooltip: snippets.abbreviation.completion.displayLabel + " " + snippets.abbreviation.completion.detail,
                    menuTooltip: "More abbreviation markup",
                    items: [
                        {
                            type: "action",
                            id: "abbreviation-unresolved",
                            label: "Abbreviation, not resolved (|abc|)",
                            action: (view) => applySnippet(view, snippets.abbreviationUnresolved),
                            active: inlineAllowed()
                        }
                    ],
                    active: inlineAllowed()
                },
                {
                    type: "split",
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
                            active: inlineAllowed()
                        }))
                    })(),
                    active: inlineAllowed()
                },
                {
                    type: "split",
                    id: "deletion",
                    label: "⟦abc⟧",
                    tooltip: "Deleted text",
                    menuTooltip: "More deletion markup",
                    action: (view) => applySnippet(view, snippets.deletion),
                    items: (() => {
                        const {deletionSlashes, deletionCrossStrokes} = snippets;
                        return Object.entries({deletionSlashes, deletionCrossStrokes}).map(snippetEntry => ({
                            ...snippetItem(snippetEntry),
                            active: inlineAllowed()
                        }))
                    })(),
                    active: inlineAllowed()
                },
                {
                    type: "split",
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
                            active: inlineAllowed()
                        }))
                    })(),
                    active: inlineAllowed()
                },
                {type: "divider"},
                {
                    type: "action",
                    id: "unclear",
                    label: "ạ",
                    tooltip: "Mark as unclear",
                    action: (view) => {
                        const availableRanges = view.state.field(syntactialDiacritRanges)
                        view.dispatch({
                            changes: availableRanges.map(range => {
                                const text = view.state.doc.sliceString(range.from, range.to)
                                const process = range.name === "Unclear" || range.name === "SupralineUnclear"
                                    ? removeCombiningMarks
                                    : addCombiningMarks
                                return {from: range.from, to: range.to, insert: process(text, 0x0323)}
                            })
                        })
                    },
                    active: state.field(syntactialDiacritRanges).length > 0,
                    hoverAction: {
                        enter: (view) => {
                            const availableRanges = view.state.field(syntactialDiacritRanges)
                            view.dispatch({effects: [setPreviewHighlights.of(availableRanges)]})
                        },
                        leave: (view) => view.dispatch({effects: [setPreviewHighlights.of([])]})
                    }
                },
                {
                    type: "action",
                    id: "supraline-macron",
                    label: "ā",
                    tooltip: "Supraline",
                    action: (view) => {
                        const availableRanges = view.state.field(syntactialDiacritRanges)
                        view.dispatch({
                            changes: availableRanges.map(range => {
                                const text = view.state.doc.sliceString(range.from, range.to)
                                const process = range.name === "SupralineMacronContent" || range.name === "SupralineUnclear"
                                    ? removeCombiningMarks
                                    : addCombiningMarks
                                return {from: range.from, to: range.to, insert: process(text, 0x0304)}
                            })
                        })
                    },
                    active: state.field(syntactialDiacritRanges).length > 0,
                    hoverAction: {
                        enter: (view) => {
                            const availableRanges = view.state.field(syntactialDiacritRanges)
                            view.dispatch({effects: [setPreviewHighlights.of(availableRanges)]})
                        },
                        leave: (view) => view.dispatch({effects: [setPreviewHighlights.of([])]})
                    }
                },
                {type: "divider"}
            ]
        });
    }),
    // toolbarConfig.of(() => ({
    //     items: [{
    //         // type: "split",
    //         type: "menu",
    //         label: "Action",
    //         id: "action",
    //         action: halloAction,
    //         active: true,
    //         items: [
    //             {type: "action", label: "A", id: "a", action: halloAction},
    //             {type: "menu", label: "B", id: "b", items: [
    //                     {type: "action", label: "A", id: "a1", action: halloAction},
    //                     {type: "menu", label: "B", id: "b1", items: [
    //                             {type: "action", label: "A", id: "a2", action: halloAction},
    //                             {type: "action", label: "B", id: "b3", action: halloAction},
    //                             {type: "action", label: "C", id: "c4", action: halloAction}
    //                         ]},
    //                     {type: "menu", label: "C", id: "c1", items: [
    //                             {type: "action", label: "Ar", id: "a49", action: halloAction, active: true},
    //
    //                         ]},
    //                 ]},
    //             {type: "action", label: "C", id: "c", action: halloAction},
    //         ]
    //     },
    //         {
    //             // type: "split",
    //             type: "split",
    //             label: "Action",
    //             id: "baction",
    //             action: halloAction,
    //             active: true,
    //             items: [
    //                 {type: "action", label: "Ar", id: "a5", action: halloAction},
    //                 {type: "menu", label: "Br", id: "b6", items: [
    //                         {type: "action", label: "Ar", id: "a7", action: halloAction},
    //                         {type: "menu", label: "Br", id: "b8", items: [
    //                                 {type: "action", label: "Ar", id: "a9", action: halloAction},
    //                                 {type: "action", label: "Br", id: "b10", action: halloAction},
    //                                 {type: "action", label: "Cr", id: "c11", action: halloAction},
    //                             ]},
    //                         {type: "action", label: "Cr", id: "c12", action: halloAction},
    //                     ]},
    //                 {type: "action", label: "Cr", id: "c13", action: halloAction},
    //             ]
    //         }, {
    //             type: "action",
    //             label: "Action2",
    //             id: "baction2",
    //             action: halloAction
    //         }, {
    //             type: "action",
    //             label: "Action24",
    //             id: "baction24",
    //             action: halloAction
    //         },
    //     ]
    // })),
    syntactialDiacritRanges,
    toolbar
]