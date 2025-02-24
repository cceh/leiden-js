import {ActionItemBase, MenuItem} from "../config.js";
import {html, nothing, TemplateResult} from "lit-html";
import {createMenu} from "./menu.js";

export function createMenuItem(item: MenuItem, actionCallback: (item: ActionItemBase) => void): TemplateResult {
    const isMenuTrigger = item.type === "menu"
    return html`
        ${isMenuTrigger ? createMenu(item, actionCallback) : ""}
        <button
                aria-haspopup=${isMenuTrigger ? "true" : nothing}
                aria-expanded=${isMenuTrigger ? "false" : nothing}
                aria-controls=${isMenuTrigger ? `menu-${item.id}` : nothing}
                tabindex="-1"
                class="cm-ljs-toolbar-menu-item" role="menuitem" id="menu-item-${item.id}"
                ?disabled="${item.active !== undefined && !item.active}"
                @click=${item.type === "action" ? (e: MouseEvent) => {
                    e.preventDefault()
                    actionCallback(item)
                } : nothing}
        >
            <span class="cm-ljs-toolbar-label">${item.label}</span>
            ${item.info ? html`<span class="cm-ljs-toolbar-info">${item.info}</span>` : nothing}
        </button>
    `
}