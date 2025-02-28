import {Ref} from "lit-html/directives/ref.js";
import {html, nothing, TemplateResult} from "lit-html";
import {ActionCapableItem, MenuItem} from "../config.js";


export function menu(triggerItem: { id: string, label: string, items: MenuItem[] }, actionCallback: (item: ActionCapableItem) => void, ref?: Ref) {
    return html`
        <div
                ${ref ?? nothing}
                id="menu-${triggerItem.id}"
                class="cm-ljs-toolbar-menu"
                role="menu"
                aria-label="${triggerItem.label}"
        >
            ${triggerItem.items.map(item => menuItem(item, actionCallback))}
        </div>
    `
}

function menuItem(item: MenuItem, actionCallback: (item: ActionCapableItem) => void): TemplateResult {
    const isMenuTrigger = item.type === "menu"
    return html`
        ${isMenuTrigger ? menu(item, actionCallback) : ""}
        <button
                aria-haspopup=${isMenuTrigger ? "true" : nothing}
                aria-expanded=${isMenuTrigger ? "false" : nothing}
                aria-controls=${isMenuTrigger ? `menu-${item.id}` : nothing}
                tabindex="-1"
                class="cm-ljs-toolbar-menu-item"
                role="menuitem"
                id="menu-item-${item.id}"
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