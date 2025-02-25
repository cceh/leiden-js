import {html, nothing} from "lit-html";
import {ActionCapableItem, HoverActionCapableItem, ToolbarActionItem, ToolbarSplitItem} from "../config.js";

export const actionButton = (
    item: ToolbarActionItem | ToolbarSplitItem,
    tabIndex = -1,
    actionCallback: (item: ActionCapableItem) => void,
    hoverEnterCallback?: (item: HoverActionCapableItem) => void,
    hoverLeaveCallback?: (item: HoverActionCapableItem) => void,
) => html`
        <button class="cm-ljs-toolbar-button"
                id="button-${item.id}"
                title=${item.tooltip}
                tabindex="${tabIndex}"
                role="button"
                ?disabled="${item.active !== undefined && !item.active}"
                @click="${(e: Event) => {
                    e.preventDefault();
                    actionCallback(item)
                }}"
                @mouseenter="${hoverEnterCallback ? () => {
                    hoverEnterCallback(item)
                }: nothing}"
                @mouseleave="${hoverLeaveCallback ? () => {
                    hoverLeaveCallback(item)
                } : nothing}"
        >${item.label}
        </button>
`