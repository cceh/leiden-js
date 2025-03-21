import {
    createMenuItemsFromSnippets,
    MenuItem,
    MenuTrigger,
    setPreviewHighlights,
    toolbar, ToolbarActionItem,
    toolbarConfig
} from "@leiden-plus/ui-toolbar";
import {Extension} from "@codemirror/state";
import {
    acceptsCertLow,
    inlineContentAllowed,
    addCertLowAtCursorPosition,
    findClosestCertLowAncestor,
    snippets,
    hasCertLow,
    addCertLow,
    removeCertLow
} from "@leiden-plus/codemirror-lang-leiden-plus";
import {applySnippet} from "@leiden-plus/lib/language";
import {addCombiningMarks, removeCombiningMarks} from "@leiden-plus/lib/util";
import {syntactialDiacritRanges} from "./syntacticalDiacritRanges.js";
import {syntaxTree} from "@codemirror/language";

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
        const inlineAllowed = inlineContentAllowed(state)

        const createMenuItemsFor = (keys: (keyof typeof snippets)[]) =>
            createMenuItemsFromSnippets(snippets, keys, inlineAllowed)


        const abbreviationsMenu: MenuTrigger = {
            type: "menu",
            id: "abbreviations",
            label: "Abbreviations",
            items: createMenuItemsFor(["abbreviation", "abbreviationUnresolved"])
        }

        const apparratusMenu: MenuTrigger = {
            type: "menu",
            id: "apparatus",
            label: "Apparatus",
            items: createMenuItemsFor([
                "modernRegularization", "modernCorrection", "scribalCorrection", "alternateReading",
                "editorialCorrection"
            ])
        }
        
        const deletionsMenu: MenuTrigger = {
            type: "menu",
            id: "deletions",
            label: "Deletion/cancellation",
            items: createMenuItemsFor(["deletion", "deletionSlashes", "deletionCrossStrokes"]),
        }

        const docDivisionsMenu: MenuTrigger = {
            type: "menu",
            id: "doc-divisions",
            label: "Document divisions",
            items: createMenuItemsFor([
                "divisionRecto", "divisionVerso", "divisionColumn", "divisionFolio", "divisionFragment",
                "divisionOther", "divisionOtherRef"
            ])
        }

        const foreignLanguageMenu: MenuTrigger = {
            type: "menu",
            id: "foreign-lang",
            label: "Foreign language",
            items: createMenuItemsFor(["foreignLatin", "foreignGreek", "foreign"])
        }

        const gapsMenu: MenuTrigger = {
            type: "menu",
            id: "gaps",
            label: "Gaps (missing/illegible)",
            items: [
                {
                    type: "menu",
                    id: "lacunae",
                    label: "Lacuna",
                    items: createMenuItemsFor([
                        "gapLostChars", "gapLostCharsCa", "gapLostCharsRange", "gapLostCharsUnknown",
                        "gapLostLines", "gapLostLinesRange", "gapLostLinesCa", "gapLostLinesUnknown"
                    ])
                }, {
                    type: "menu",
                    id: "illegibles",
                    label: "Illegible",
                    items: createMenuItemsFor([
                        "illegibleChars", "illegibleCharsRange", "illegibleCharsCa",
                        "illegibleCharsUnknown", "illegibleLines", "illegibleLinesRange",
                        "illegibleLinesCa"
                    ])
                }, {
                    type: "menu",
                    id: "vacats",
                    label: "Vacat",
                    items: createMenuItemsFor([
                        "vacatChars", "vacatCharsRange", "vacatCharsCa", "vacatCharsUnknown",
                        "vacatLines", "vacatLinesRange", "vacatLinesCa", "vacatLinesUnknown"
                    ])
                }, {
                    type: "menu",
                    id: "vestiges",
                    label: "Vestiges",
                    items: createMenuItemsFor([
                        "vestigChars", "vestigCharsRange", "vestigCharsCa", "vestigLines",
                        "vestigLinesRange", "vestigLinesCa", "vestigLinesUnknown"
                    ])
                }, {
                    type: "menu",
                    id: "omissions",
                    label: "Omissions",
                    items: createMenuItemsFor(["gapOmittedChars", "gapOmittedCharsUnknown"])
                }
            ],
        }

        const nonTranscribedMenu: MenuTrigger = {
            type: "menu",
            id: "non-transcribed",
            label: "Not transcribed",
            items: [
                {
                    type: "menu",
                    id: "not-transcribed-language",
                    label: "Language not transcribed",
                    items: createMenuItemsFor([
                        "nonTranscribedLanguageChars",
                        "nonTranscribedLanguageCharsUnknown",
                        "nonTranscribedLanguageLines",
                        "nonTranscribedLanguageLinesCa",
                        "nonTranscribedLanguageLinesUnknown"
                    ])
                }, {
                    type: "menu",
                    id: "untranscribed-chars",
                    label: "Untranscribed characters",
                    items: createMenuItemsFor([
                        "untranscribedChars",
                        "untranscribedCharsRange",
                        "untranscribedCharsCa",
                        "untranscribedCharsUnknown"
                    ])
                }, {
                    type: "menu",
                    "id": "untranscribed-lines",
                    label: "Untranscribed lines",
                    items: createMenuItemsFor([
                        "untranscribedLines",
                        "untranscribedLinesRange",
                        "untranscribedLinesCa",
                        "untranscribedLinesUnknown"
                    ])
                }, {
                    type: "menu",
                    "id": "untranscribed-columns",
                    label: "Untranscribed columns",
                    items: createMenuItemsFor([
                        "untranscribedColumns",
                        "untranscribedColumnsRange",
                        "untranscribedColumnsCa",
                        "untranscribedColumnsUnknown"
                    ])
                }
            ]
        }

        const insertionsMenu: MenuTrigger = {
            type: "menu",
            id: "insertions",
            label: "Insertion",
            items: createMenuItemsFor([
                "insertionAbove",
                "insertionBelow",
                "insertionMarginLeft",
                "insertionMarginRight",
                "insertionMarginTop",
                "insertionMarginBottom",
                "insertionMargin",
                "insertionMarginSling",
                "insertionMarginUnderline",
                "insertionInterlinear"
            ])
        }

        const lineNumbersMenu: MenuTrigger = {
            type: "menu",
            id: "line-numbers",
            label: "Line numbers",
            items: [
                ...createMenuItemsFor(["lineNumber", "lineNumberBreak"]), {
                    type: "menu",
                    id: "line-numbers-margin",
                    label: "Line written in margin",
                    items: createMenuItemsFor([
                        "lineNumberMarginLeft",
                        "lineNumberMarginRight",
                        "lineNumberMarginUpper",
                        "lineNumberMarginLower",
                        "lineNumberMarginPerpendicularLeft",
                        "lineNumberMarginPerpendicularRight",
                        "lineNumberMarginInverseLower"
                    ])
                }, {
                    type: "menu",
                    id: "line-numbers-relative",
                    label: "Lines relative to the main text",
                    items: createMenuItemsFor([
                        "lineNumberPerpendicular",
                        "lineNumberInverse",
                        "lineNumberIndented",
                        "lineNumberOutdented"
                    ])
                }
            ],
        }

        const numbersMenu: MenuTrigger = {
            type: "menu",
            id: "numbers",
            label: "Numbers",
            items: createMenuItemsFor([
                "number",
                "numberFraction",
                "numberFractionUnknown",
                "numberRange",
                "numberRangeUnknownEnd",
                "numberTick",
                "numberTickFraction",
                "numberTickFractionUnknown"
            ]),
        }

        const suppliedMenu: MenuTrigger = {
            type: "menu",
            id: "supplied",
            label: "Supplied text",
            items: createMenuItemsFor([
                "suppliedLost",
                "suppliedLostParallel",
                "suppliedParallel",
                "suppliedOmitted"
            ])
        }

        const textualFeaturesMenu: MenuTrigger = {
            type: "menu",
            id: "textual-features",
            label: "Textual features",
            items: createMenuItemsFor([
                "textTall",
                "textSubscript",
                "textSuperscript",
                "textSupraline",
                "textSupralineUnderline"
            ])
        }

        const otherMenu: MenuTrigger = {
            type: "menu",
            id: "other",
            label: "Other annotations",
            items: createMenuItemsFor([
                "handShift",
                "editorialNote",
                "editorialNoteRef",
                "surplus",
                "quotation"
            ])
        }

        const diacritItems = Object.entries(ancientDiacrits).map<MenuItem>(([name, diacrit]) => ({
            type: "action",
            id: name.toLowerCase(),
            label: name,
            active: inlineAllowed,
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
            active: inlineAllowed,
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

        const ancientDiacriticalsMenu: MenuTrigger = {
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
        }

        const milestoneMenu: MenuTrigger = {
            type: "menu",
            id: "milestones",
            label: "Milestone",
            items: createMenuItemsFor([
                "paragraphos",
                "horizontalRule",
                "wavyLine",
                "dipleObelismene",
                "coronis",
                "textInBox"
            ])
        }

        const contextItems: ToolbarActionItem[] = [];
        const certLowAncestor = findClosestCertLowAncestor(state)
        if (certLowAncestor) {
            if (!hasCertLow(certLowAncestor)) {
                contextItems.push({
                    type: "action",
                    id: "context-item-cert-low-add",
                    label: "( ? )",
                    action: (view) => {
                        addCertLow(view, certLowAncestor)
                    }
                })
            } else {
                const label = document.createElement("span")
                label.innerHTML = `
                    <span style="position: relative; display: inline-block;">
                        ( ? ) 
                        <svg viewBox="0 0 100 100" style="
                          position: absolute;
                          top: 0;
                          left: 0;
                          width: 100%;
                          height: 100%;
                          pointer-events: none;
                        ">
                            <!--suppress CssUnresolvedCustomProperty -->
                            <line x1="0" y1="100" x2="100" y2="0" stroke-width="20" stroke-linecap="round" style="
                                stroke: var(--cm-panel-bg-color);
                            "/>
                            <line x1="0" y1="100" x2="100" y2="0" stroke-width="8" stroke-linecap="round" stroke="currentColor"/>
                        </svg>
                   </span>`

                contextItems.push({
                    type: "action",
                    id: "context-item-cert-low-remove",
                    label,
                    action: (view) => {
                        removeCertLow(view, certLowAncestor)
                    }
                })
            }
        }

        return ({
            items: [
                // MARKUP top-level menu
                {
                    type: "menu",
                    id: "markup",
                    label: "Markup",
                    items: [
                        abbreviationsMenu,
                        apparratusMenu,
                        deletionsMenu,
                        docDivisionsMenu,
                        foreignLanguageMenu,
                        gapsMenu,
                        nonTranscribedMenu,
                        insertionsMenu,
                        lineNumbersMenu,
                        numbersMenu,
                        suppliedMenu,
                        textualFeaturesMenu,
                        otherMenu
                    ]
                },

                // SYMBOLS top-level menu
                {
                    type: "menu",
                    id: "symbols",
                    label: "Symbols",
                    items: [
                        ...createMenuItemsFor(["figure", "filler", "glyph"]),
                        ancientDiacriticalsMenu,
                        milestoneMenu
                    ]
                },

                {type: "divider"},

                // SHORTCUT BUTTONS
                {
                    type: "split",
                    id: "supplied-lost",
                    label: "[abc]",
                    tooltip: "Supplied text, lost in lacuna",
                    menuTooltip: "More supplied text markup",
                    action: (view) => applySnippet(view, snippets.suppliedLost),
                    items: createMenuItemsFor(["suppliedLostParallel", "suppliedParallel", "suppliedOmitted"]),
                    active: inlineAllowed
                },
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
                            active: inlineAllowed
                        }
                    ],
                    active: inlineAllowed
                },
                {
                    type: "split",
                    id: "split-illegibles",
                    label: ".1",
                    tooltip: "Illegible chars., known quantity",
                    menuTooltip: "More illegible markup",
                    action: (view) => applySnippet(view, snippets.illegibleChars),
                    items: createMenuItemsFor(["illegibleCharsRange", "illegibleCharsCa",
                        "illegibleCharsUnknown", "illegibleLines", "illegibleLinesRange",
                        "illegibleLinesCa"]),
                    active: inlineAllowed
                }, {
                    type: "split",
                    id: "split-lacunae",
                    label: "[.1]",
                    tooltip: "Lacuna, known quantity of chars.",
                    menuTooltip: "More markup for lacunae",
                    action: (view) => applySnippet(view, snippets.gapLostChars),
                    items: createMenuItemsFor(["gapLostCharsCa", "gapLostCharsRange", "gapLostCharsUnknown",
                        "gapLostLines", "gapLostLinesRange", "gapLostLinesCa", "gapLostLinesUnknown"]),
                    active: inlineAllowed
                },
                {
                    type: "split",
                    id: "split-deletions",
                    label: "⟦abc⟧",
                    tooltip: "Deleted text",
                    menuTooltip: "More deletion markup",
                    action: (view) => applySnippet(view, snippets.deletion),
                    items: createMenuItemsFor(["deletionSlashes", "deletionCrossStrokes"]),
                    active: inlineAllowed
                },
                {
                    type: "split",
                    id: "split-numbers",
                    label: "№",
                    tooltip: "Number",
                    menuTooltip: "More number markup",
                    action: (view) => {
                        applySnippet(view, snippets.number);
                    },
                    items: createMenuItemsFor([
                        "numberFraction",
                        "numberFractionUnknown",
                        "numberRange",
                        "numberRangeUnknownEnd",
                        "numberTick",
                        "numberTickFraction",
                        "numberTickFractionUnknown"
                    ],),
                    active: inlineAllowed
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
            ],
            contextItems
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