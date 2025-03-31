import { applySnippet, Snippets } from "@leiden-plus/lib/language";
import { MenuItem } from "./config.js";

export function createMenuItemFromSnippet<T extends Snippets>(
    snippets: T,
    snippetKey: keyof T,
    isActive: boolean
): MenuItem {
    const snippetDef = snippets[snippetKey];
    return {
        type: "action",
        id: String(snippetKey),
        label: `${snippetDef.completion.displayLabel}${"detail" in snippetDef.completion ? ", " + snippetDef.completion.detail : ""}`,
        action: (view) => applySnippet(view, snippetDef),
        active: isActive,
        info: snippetDef.completion.info
    };
}

export function createMenuItemsFromSnippets<T extends Snippets>(
    snippets: T,
    snippetKeys: (keyof T)[],
    isActive: boolean
): MenuItem[] {
    return snippetKeys.map<MenuItem>(key =>
        createMenuItemFromSnippet(snippets, key, isActive)
    );
}