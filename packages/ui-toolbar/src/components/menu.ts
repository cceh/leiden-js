import {Ref} from "lit-html/directives/ref.js";
import {html, nothing} from "lit-html";
import {ActionItemBase, MenuItem} from "../config.js";
import {createMenuItem} from "./menuItem.js";


export function createMenu(triggerItem: { id: string, items: MenuItem[] }, actionCallback: (item: ActionItemBase) => void, ref?: Ref) {
    return html`
        <div
                ${ref ?? nothing}
                id="menu-${triggerItem.id}" class="cm-ljs-toolbar-menu" role="menu"
                aria-label="Format options"
               
        >
            ${triggerItem.items.map(item => createMenuItem(item, actionCallback))}
        </div>
    `
}
//
// @mouseenter=${() => clearTimeout(this.closeTimeout)}
// @mouseleave=${(e: MouseEvent) => {
//     this.closeTimeout = setTimeout(() => closeMenu(e.target), 100)
// }}