import {ToolbarMenuTrigger} from "../config.js";
import {html} from "lit-html";

export const menuButton = (item: ToolbarMenuTrigger, tabIndex = -1) =>
    html`
        <button
                class="cm-ljs-toolbar-button"
                id="${item.id}"
                aria-haspopup="true"
                aria-expanded="false"
                aria-controls="menu-${item.id}"
                tabindex="${tabIndex}"
                title="${item.tooltip}"
                role="button"
        >${item.label}
        </button>
    `