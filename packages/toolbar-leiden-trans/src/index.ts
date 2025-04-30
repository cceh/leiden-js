import {
    ActionItem,
    createMenuItemFromSnippet,
    createMenuItemsFromSnippets,
    MenuTrigger,
    toolbar,
    ToolbarActionItem,
    toolbarConfig
} from "@leiden-js/ui-toolbar";
import { Extension } from "@codemirror/state";
import {
    addDivision,
    addTranslation,
    canAddDivision,
    DivisionSnippetKey,
    inlineContentAllowed,
    snippets,
    TranslationSnippetKey
} from "@leiden-js/codemirror-lang-leiden-trans";
import { applySnippet } from "@leiden-js/common/language";


export const leidenTranslationToolbar: Extension[] = [
    toolbarConfig.of((state) => {
        const inlineAllowed = inlineContentAllowed(state);

        const createMenuItemsFor = (keys: (keyof typeof snippets)[]) =>
            createMenuItemsFromSnippets(snippets, keys, inlineAllowed);
        const createMenuItemFor = (key: keyof typeof snippets) => createMenuItemFromSnippet(snippets, key, inlineAllowed);

        const createActionFor = (key: keyof typeof snippets, id: string, label?: string): ToolbarActionItem => {
            const snippetDef = snippets[key];
            return {
                type: "action",
                id,
                label: label ?? snippetDef.completion.info,
                tooltip: `${snippetDef.completion.displayLabel}${"detail" in snippetDef.completion ? ", " + snippetDef.completion.detail : ""}`,
                action: (view) => applySnippet(view, snippetDef),
                active: inlineAllowed
            };
        };

        const lineNumbersMenu: MenuTrigger = {
            type: "menu",
            id: "line-numbers",
            label: "Milestone line number",
            items: createMenuItemsFor(["milestoneLineNumber", "milestoneLineNumberBreak"])
        };

        const gapsMenu: MenuTrigger = {
            type: "menu",
            id: "gaps",
            label: "Gap",
            items: createMenuItemsFor(["lacuna", "illegible"])
        };

        const termMenu: MenuTrigger = {
            type: "menu",
            id: "term",
            label: "Term",
            items: createMenuItemsFor(["termGreek", "termLatin", "termGreekLatin", "termWithLanguage", "term"])
        };

        const foreignMenu: MenuTrigger = {
            type: "menu",
            id: "foreign",
            label: "Foreign text",
            items: createMenuItemsFor(["foreignLatin", "foreignGreek", "foreign"])
        };

        const appMenu: MenuTrigger = {
            type: "menu",
            id: "app",
            label: "Apparatus entry",
            items: createMenuItemsFor([
                "apparatusEntryBGU", "apparatusEntryBGUDDbDP", "apparatusEntryNoRef", "apparatusEntry"
            ])
        };


        const translationKeys: TranslationSnippetKey[] = [
            "translationEnglish", "translationGerman", "translationWithLanguage", "translation"
        ];
        const translationMenuItems: ActionItem[] = translationKeys
            .map(key => ({ key, snippet: snippets[key] }))
            .map(({ key, snippet }) => ({
                type: "action",
                id: "entry-translation-" + key,
                label: `${snippet.completion.displayLabel}, ${snippet.completion.detail}`,
                info: snippet.completion.info,
                action: (view) => addTranslation(view, key),
                active: true
            }));


        const divisionKeys: DivisionSnippetKey[] = [
            "divisionRecto", "divisionVerso", "divisionColumn", "divisionFragment", "divisionOtherType", "division"
        ];
        const divisionMenuItems: ActionItem[] = divisionKeys
            .map(key => ({ key, snippet: snippets[key] }))
            .map(({ key, snippet }) => ({
                type: "action",
                id: "entry-division-" + key,
                label: `${snippet.completion.displayLabel}, ${snippet.completion.detail}`,
                info: snippet.completion.info,
                action: (view) => addDivision(view, key),
                active: canAddDivision(state)
            }));


        const documentStructureMenu: MenuTrigger = {
            type: "menu",
            id: "structure",
            label: "Document structure",
            items: [
                {
                    type: "menu",
                    id: "translations",
                    label: "Translation",
                    items: translationMenuItems
                },
                {
                    type: "menu",
                    id: "divisions",
                    label: "Divisions",
                    items: divisionMenuItems,
                },
                createMenuItemFor("block")
            ]
        };

        return ({
            items: [
                // MARKUP top-level menu
                {
                    type: "menu",
                    id: "markup",
                    label: "Markup",
                    items: [
                        documentStructureMenu,
                        lineNumbersMenu,
                        gapsMenu,
                        termMenu,
                        foreignMenu,
                        appMenu,
                        createMenuItemFor("deletion"),
                        createMenuItemFor("note")
                    ],
                },
                {
                    type: "menu",
                    id: "add-translation",
                    label: "+ Translation",
                    items: translationMenuItems
                },
                {
                    type: "menu",
                    id: "add-division",
                    label: "+ Division",
                    items: divisionMenuItems
                },
                { type: "divider" },
                createActionFor("lacuna", "btn-lacuna"),
                createActionFor("illegible", "btn-illegible"),
                { type: "divider" },
                createActionFor("deletion", "btn-deletion"),
                { type: "divider" },
                createActionFor("milestoneLineNumber", "btn-milestoneLineNumber"),
                createActionFor("milestoneLineNumberBreak", "btn-milestoneLineNumberBreak")

            ]
        });
    }),
    toolbar
];