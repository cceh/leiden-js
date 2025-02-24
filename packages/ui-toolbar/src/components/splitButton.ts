import {html, nothing} from "lit-html";
import {actionButton} from "./actionButton.js";
import {ActionItemBase, ToolbarHoverActionBase, ToolbarSplitItem} from "../config.js";

export const splitButton = (
    item: ToolbarSplitItem,
    tabIndex = -1,
    actionCallback: (item: ActionItemBase) => void,
    hoverEnterCallback?: (item: ToolbarHoverActionBase) => void,
    hoverLeaveCallback?: (item: ToolbarHoverActionBase) => void,
) => {
    return html`
            <div class="cm-ljs-toolbar-split-button-container">
                ${actionButton(item, tabIndex, actionCallback, hoverEnterCallback, hoverLeaveCallback)}
                <button 
                        class="cm-ljs-toolbar-button cm-ljs-toolbar-more-button" 
                        id="more-${item.id}"
                        aria-haspopup="true"
                        aria-expanded="false"
                        aria-controls="menu-${item.id}"
                        tabindex="${tabIndex}"
                        title="${item.menuTooltip ?? nothing}"
                ></button>
            </div>
        `
}