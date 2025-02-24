import {ActionItemBase, ToolbarActionItem, ToolbarHoverActionBase, ToolbarSplitItem} from "../config.js";
import {html, nothing} from "lit-html";

export const actionButton = (
    item: ToolbarActionItem | ToolbarSplitItem,
    tabIndex = -1,
    actionCallback: (item: ActionItemBase) => void,
    hoverEnterCallback?: (item: ToolbarHoverActionBase) => void,
    hoverLeaveCallback?: (item: ToolbarHoverActionBase) => void,
) => html`
        <button class="cm-ljs-toolbar-button"
                id="button-${item.id}"
                title=${item.tooltip}
                tabindex="${tabIndex}"
                role="button"
                @click="${(e: Event) => {
                    e.preventDefault();
                    actionCallback(item)
                }}"
                ?disabled="${item.active !== undefined && !item.active}"
                @mouseenter="${hoverEnterCallback ? () => {
                    hoverEnterCallback(item)
                }: nothing}"
                @mouseleave="${hoverLeaveCallback ? () => {
                    hoverLeaveCallback(item)
                } : nothing}"
        >${item.label}
        </button>
`