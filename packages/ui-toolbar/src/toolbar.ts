import {EditorView, Panel, showPanel, ViewUpdate} from "@codemirror/view";
import {html, nothing, render} from "lit-html";
import {createRef} from "lit-html/directives/ref.js";
import {computePosition, flip, offset, Placement, shift, size} from "@floating-ui/dom";
import {menu} from "./components/menu.js";
import {actionButton} from "./components/actionButton.js";
import {splitButton} from "./components/splitButton.js";
import {menuButton} from "./components/menuButton.js";
import {divider} from "./components/divider.js";
import {previewHighlightField, previewHighlightTheme} from "./previewHighlight.js";
import {toolbarTheme} from "./theme.js";
import {EditorState} from "@codemirror/state";
import {ActionCapableItem, HoverActionCapableItem, toolbarConfigStateField, ToolbarItem} from "./config.js";


// Hack to get the colors of CodeMirror's panels
// Anyone know a better way?
const updateCMColors = (view: EditorView) => requestAnimationFrame(() => {
    const panelsEl = view.dom.querySelector<HTMLElement>(".cm-panels")
    if (!panelsEl) {
        throw new Error("Could not find CodeMirror panels element")
    }

    const panelStyles = getComputedStyle(panelsEl)

    view.dom.style.setProperty("--cm-panel-bg-color", panelStyles.backgroundColor)
    view.dom.style.setProperty("--cm-panel-text-color", panelStyles.color)
    view.dom.style.setProperty("--cm-panel-border-color", panelStyles.borderBottomColor)
})

export class Toolbar implements Panel {
    private openTimeout: number | undefined
    private menuRefs = new Map()
    private readonly menuContainer: HTMLElement

    readonly top: boolean = true
    readonly dom: HTMLElement

    constructor(readonly view: EditorView) {
        this.dom = document.createElement("div")
        this.dom.classList.add("cm-ljs-toolbar")
        this.dom.role = "toolbar"
        this.dom.ariaLabel = "Toolbar"
        this.dom.addEventListener("keydown", this.handleToolbarKeydown)
        this.dom.addEventListener("click", this.handleToolbarClick)
        this.dom.addEventListener("focusout", this.handleFocusOut)

        this.menuContainer = document.createElement('div')
        this.menuContainer.classList.add('cm-ljs-toolbar-menu-container')
        this.menuContainer.addEventListener('keydown', this.handleMenuKeydown)
        this.menuContainer.addEventListener('focusout', this.handleFocusOut)
        this.menuContainer.addEventListener('mouseover', this.handleMenuMouseOver)
        view.dom.appendChild(this.menuContainer)

        // close menu when clicking outside
        window.addEventListener("click", this.handleOutsideClick)
    }

    private makeRef = (id: string) => {
        if (!this.menuRefs.has(id)) {
            this.menuRefs.set(id, createRef())
        }
        return this.menuRefs.get(id)
    }


    mount() {
        updateCMColors(this.view)
        this.renderToolbar(this.view.state)
    }

    update(update: ViewUpdate) {
        if (update.transactions.some(tr => tr.reconfigured)) {
            updateCMColors(update.view)
        }

        const config = update.state.field(toolbarConfigStateField)
        const prevConfig = update.startState.field(toolbarConfigStateField)

        if (config !== prevConfig) {
            this.renderToolbar(update.state)
        }
    }

    destroy() {
        window.removeEventListener("click", this.handleOutsideClick)
        this.menuContainer.remove()
    }

    // Rendering

    private actionCallback = (item: ActionCapableItem) => {
        this.closeAllMenusUnder(this.menuContainer)

        item.action(this.view)
        this.view.focus()
    }

    private hoverActionEnterCallback = (item: HoverActionCapableItem) => {
        item.hoverAction && item.hoverAction.enter(this.view)
    };

    private hoverActionLeaveCallback = (item: HoverActionCapableItem) => {
        item.hoverAction && item.hoverAction.leave(this.view)
    };

    private renderToolbar(state: EditorState) {
        const config = state.field(toolbarConfigStateField)

        render(html`${
            config.items
                .filter(item => item.type === "menu" || item.type === "split")
                .map(buttonItem => menu(buttonItem, this.makeRef(buttonItem.id)))
        }`, this.menuContainer)

        render(html`
            ${config.items.map(this.renderToolbarItem)}
            ${config.contextItems ? html`<div class="cm-ljs-toolbar-context-separator">
                ${config.contextItems.map(this.renderToolbarItem)}
            </div>` : nothing}
        `, this.dom)
    }

    private renderToolbarItem = (item: ToolbarItem, index: number) => {
        const tabIndex = index === 0 ? 0 : -1;
        switch(item.type) {
            case "action": return actionButton(item, tabIndex, this.actionCallback, this.hoverActionEnterCallback, this.hoverActionLeaveCallback)
            case "split": return splitButton(item, tabIndex, this.actionCallback, this.hoverActionEnterCallback, this.hoverActionLeaveCallback)
            case "menu": return menuButton(item, this.makeRef(item.id))
            case "divider": return divider()
        }
    };



    // Event handlers

    private handleToolbarClick = (e: MouseEvent) => {
        if (!(e.target instanceof HTMLElement)) {
            return
        }

        const toolbarItem = e.target.closest<HTMLElement>("[role=button]");
        if (!toolbarItem) {
            return
        }


        e.preventDefault();

        if (this.isMenuTrigger(toolbarItem)) {
            if (this.isMenuOpen(toolbarItem)) {
                this.closeMenuOfTrigger(toolbarItem);
            } else {
                this.closeAllMenusUnder(this.menuContainer)
                void this.openMenuAndFocus(toolbarItem);
            }
        }
    };

    private handleOutsideClick = (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && !this.dom.contains(e.target)) {
            this.closeAllMenusUnder(this.menuContainer)
        }
    };

    // Toolbar keyboard navigation
    private handleToolbarKeydown = (e: KeyboardEvent) => {
        if (!(e.target instanceof HTMLElement)) {
            return
        }

        const toolbarItem = e.target.closest<HTMLElement>(".cm-ljs-toolbar-button");
        if (!toolbarItem) {
            return
        }


        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowLeft':
            case 'Home':
            case 'End':
                const items = this.getToolbarItems()
                const currentIndex = items.indexOf(toolbarItem);
                this.handleItemNavigationEvent(e, toolbarItem, items, currentIndex, true)
                break

            case 'ArrowDown': {
                e.preventDefault();
                if (this.isMenuTrigger(e.target)) {
                    void this.openMenuAndFocus(toolbarItem);
                }
                break
            }

            case 'ArrowUp': {
                e.preventDefault();
                if (this.isMenuTrigger(e.target)) {
                    void this.openMenuAndFocus(toolbarItem, false);
                }
                break;
            }

            case 'Escape': {
                this.closeAllMenusUnder(this.menuContainer)
            }
        }
    };

    // Menu keyboard navigation
    private handleMenuKeydown = (e: KeyboardEvent) => {
        if (!(e.target instanceof HTMLElement)) {
            return
        }

        const menuItemEl = e.target.closest<HTMLElement>("[role=menuitem]");
        if (!menuItemEl) {
            return
        }

        const menuEl = menuItemEl.closest<HTMLElement>("[role=menu]");
        if (!menuEl) {
            return
        }


        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowUp':
            case 'Home':
            case 'End':
                const items = this.getMenuItems(menuEl)
                const currentIndex = items.indexOf(menuItemEl)
                this.handleItemNavigationEvent(e, menuItemEl, items, currentIndex, false)
                break

            case 'Escape': {
                e.preventDefault();
                const triggerEl = this.getTriggerEl(menuEl);
                if (this.isMenuOpen(triggerEl)) {
                    this.closeMenu(menuEl);
                    triggerEl.focus();
                }
                break;
            }

            case 'ArrowRight': {
                e.preventDefault();

                if (this.isMenuTrigger(menuItemEl)) {
                    void this.openMenuAndFocus(menuItemEl);
                } else {
                    const toolbarItems = this.getToolbarItems()
                    const currentToolbarItem = this.dom.querySelector("[aria-expanded=true]");
                    if (currentToolbarItem instanceof HTMLElement) {
                        const currentToolbarIndex = toolbarItems.indexOf(currentToolbarItem)
                        this.moveToolbarFocus(currentToolbarItem, this.getNextCircularItem(currentToolbarIndex, toolbarItems));

                    }
                }
                break;
            }

            case 'ArrowLeft': {
                e.preventDefault();
                this.closeMenu(menuEl)
                const triggerThatOpenedThis = this.getTriggerEl(menuEl);

                if (triggerThatOpenedThis.role === "menuitem") {
                    triggerThatOpenedThis.focus();
                } else {
                    const toolbarItems = this.getToolbarItems();
                    const currentToolbarIndex = toolbarItems.indexOf(triggerThatOpenedThis);
                    this.moveToolbarFocus(triggerThatOpenedThis, this.getPreviousCircularItem(currentToolbarIndex, toolbarItems));
                }

                break;
            }
        }
    }

    private handleMenuMouseOver = (e: MouseEvent) => {
        if (!(e.target instanceof HTMLElement)) return;

        // Cancel pending opens
        clearTimeout(this.openTimeout);

        const menuItemEl = e.target.closest<HTMLElement>("[role=menuitem]");

        // Close open submenu whose trigger we're not hovering
        const openTriggers = this.menuContainer.querySelectorAll<HTMLElement>("[aria-expanded=true]");
        openTriggers.forEach(triggerEl => {
            // Skip if this is the item we're hovering
            if (triggerEl === menuItemEl) return;

            const submenuEl = this.getMenuEl(triggerEl);

            // Only close if not hovering the target submenu
            if (e.target instanceof Node && !submenuEl.contains(e.target)) {
                this.closeMenu(submenuEl);
            }
        });

        // Open submenu
        if (menuItemEl && this.isMenuTrigger(menuItemEl) && !this.isMenuOpen(menuItemEl)) {
            this.openTimeout = setTimeout(() => this.openMenu(menuItemEl), 100);
        }
    }

    private handleFocusOut = (e: FocusEvent) => {
        const newTarget = e.relatedTarget
        if (!(newTarget instanceof Node) || (!this.menuContainer.contains(newTarget) && !this.dom.contains(newTarget))) {
            this.closeAllMenusUnder(this.menuContainer)
        }
    }


    // Utility methods

    getMenuElId(menuName: string) {
        return `menu-${menuName}`
    }

    moveToolbarFocus(sourceItem: HTMLElement, targetItem: HTMLElement) {
        this.closeMenuOfTrigger(sourceItem)
        sourceItem.tabIndex = -1;
        targetItem.tabIndex = 0;
        targetItem.focus()
    }

    private handleItemNavigationEvent(e: KeyboardEvent, currentItem: HTMLElement, items: HTMLElement[], currentIndex: number, adjustTabIndex: boolean) {
        e.preventDefault()

        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                const nextItem = this.getNextCircularItem(currentIndex, items);
                this.focusItem(items[currentIndex], nextItem, adjustTabIndex);
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                const prevItem = this.getPreviousCircularItem(currentIndex, items);
                this.focusItem(items[currentIndex], prevItem, adjustTabIndex);
                break;
            case 'Home':
                this.focusItem(currentItem, items[0], adjustTabIndex);
                break;
            case 'End':
                this.focusItem(currentItem, items[items.length - 1], adjustTabIndex);
                break;
        }
    }


    private getNextCircularItem<T>(currentIndex: number, items: Array<T>): T {
        return items[(currentIndex + 1) % items.length];
    }

    private getPreviousCircularItem<T>(currentIndex: number, items: Array<T>): T {
        return items[(currentIndex - 1 + items.length) % items.length];
    }

    private focusItem(currentItem: HTMLElement, targetItem: HTMLElement, adjustTabIndex: boolean = false) {
        if (adjustTabIndex) {
            currentItem.tabIndex = -1;
            targetItem.tabIndex = 0;
        }
        targetItem.focus();
        return targetItem;
    }
    getToolbarItems() {
        return Array.from(this.dom.querySelectorAll<HTMLElement>(":scope .cm-ljs-toolbar-button" ))
    }

    getMenuEl(menuNameOrTriggerEl: string | HTMLElement): HTMLElement {
        const menuElId = menuNameOrTriggerEl instanceof HTMLElement
            ? menuNameOrTriggerEl.getAttribute("aria-controls")
            : this.getMenuElId(menuNameOrTriggerEl)

        const el = this.menuContainer.querySelector<HTMLElement>(`#${menuElId}`)
        if (!el) {
            throw new Error(`Menu element with id ${menuElId} not found. Please report this as a bug.`);
        }

        return el
    }

    getTriggerEl(menuEl: HTMLElement): HTMLElement {
        const triggerEl =  this.view.dom.querySelector<HTMLElement>(`[aria-controls=${menuEl.id}]`)
        if (!triggerEl) {
            throw new Error(`Trigger element for menu with id ${menuEl.id} not found. Please report this as a bug.`);
        }

        return triggerEl
    }

    isMenuOpen(triggerEl: HTMLElement): boolean {
        return triggerEl.getAttribute("aria-expanded") === "true"
    }

    isMenuTrigger(itemEl: HTMLElement): boolean {
        return itemEl.getAttribute("aria-haspopup") === "true"
    }

    async openMenu(triggerEl: HTMLElement) {
        const menuEl = this.getMenuEl(triggerEl);

        const hasParentMenu = triggerEl.role === "menuitem"
        const placement = hasParentMenu ? 'right-start' : 'bottom-start';
        const fallbackPlacements: Placement[] = hasParentMenu
            ? ['left-start', 'top-start', 'bottom-start']
            : ['top-start', 'right-start', 'left-start'];

        const { x, y } = await computePosition(triggerEl, menuEl, {
            strategy: 'fixed',
            placement,
            middleware: [
                offset(4),
                flip({
                    fallbackPlacements,
                }),
                shift({ padding: 8 }),
                size({
                    padding: 8,
                    apply({availableHeight, elements}) {
                        Object.assign(elements.floating.style, {
                            maxHeight: `${Math.max(0, availableHeight)}px`,
                        });
                    },
                }),
            ],
        });

        Object.assign(menuEl.style, {
            left: `${x}px`,
            top: `${y}px`,
        });

        triggerEl.setAttribute('aria-expanded', 'true');
        menuEl.setAttribute('data-show', '');
    }

    private setMenuClosed(menuEl: HTMLElement, triggerEl: HTMLElement) {
        triggerEl.setAttribute('aria-expanded', 'false');
        menuEl.removeAttribute('data-show');

        this.closeAllMenusUnder(menuEl);
    }

    closeMenu(menuEl: HTMLElement) {
        const triggerEl = this.getTriggerEl(menuEl)
        if (triggerEl) {
            this.setMenuClosed(menuEl, triggerEl)
        }
    }

    closeMenuOfTrigger(triggerEl: HTMLElement) {
        const menuEl = this.getMenuEl(triggerEl)
        this.closeMenu(menuEl)
    }

    closeAllMenusUnder(parentMenuEl: HTMLElement) {
        const menuEls = parentMenuEl.querySelectorAll<HTMLElement>(":scope [role=menu][data-show]");
        menuEls.forEach(el => this.closeMenu(el))
    }

    getMenuItems(menuEl: HTMLElement) {
        return Array.from(menuEl.querySelectorAll<HTMLElement>(":scope > [role=menuitem]"));
    }

    async openMenuAndFocus(triggerEl: HTMLElement, first = true) {
        if (!this.isMenuOpen(triggerEl)) {
            await this.openMenu(triggerEl);
        }

        const menuEl = this.getMenuEl(triggerEl);
        const menuItems = this.getMenuItems(menuEl)

        const focusEl = first ? menuItems[0] : menuItems[menuItems.length - 1];
        focusEl.focus();
    }
}

export const toolbar = [
     toolbarConfigStateField, previewHighlightField, previewHighlightTheme, showPanel.of((view) => new Toolbar(view)), toolbarTheme
]