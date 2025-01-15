import {computePosition, flip, offset, shift, size} from "@floating-ui/dom";
import {snippets} from "@leiden-plus/codemirror-lang-leiden-plus";
import {snippet} from "@codemirror/autocomplete";

const css = `
    :root {
      /*--toolbar-bg: #f5f5f5;*/
      /*--toolbar-border: #ddd;*/
      --button-hover: #e5e5e5;
      --menu-bg: #ffffff;
      --menu-border: #ddd;
      --menu-shadow: rgba(0, 0, 0, 0.1);
      --chevron-down: url('data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iY3VycmVudENvbG9yIj4KICA8cGF0aCBkPSJNNyAxMGw1IDUgNS01IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==');
    }

    .toolbar {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding: 4px;
      font-family: system-ui, sans-serif;
    }

    .toolbar-button {
      box-sizing: border-box;
      border: none;
      padding: 3px 6px;
      background: none;
      border-radius: 4px;
      cursor: pointer;
      position: relative;
    }
    
    .toolbar > .toolbar-button, .menu-button-container {
        margin-inline-end: 4px;
    }
    
    .toolbar > .toolbar-button[aria-haspopup="true"] {
        padding-right: 1.1em;
    }
    
     .toolbar > .toolbar-button[aria-haspopup="true"]:after {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        margin-left: 6px;
        text-align: center;
        width: 1em;
        content: "";
        background: var(--chevron-down);
        background-size: contain;
        background-position: right;
        background-repeat: no-repeat;
    }

    .toolbar-button:hover,
    .toolbar-button[aria-expanded="true"] {
      background: var(--button-hover);
    }

    .toolbar-button:focus-visible {
      outline: 2px solid #0066cc;
      outline-offset: 2px;
    }
    
    .more-button {
        background: var(--chevron-down);
        background-size: contain;
        background-position: right;
        background-repeat: no-repeat;
    }
    
    
    .menu-button-container:hover,
    .menu-button-container:has([aria-expanded="true"]) {
        box-sizing: border-box;
        box-shadow: 0 0 0 1px var(--button-hover) inset;
        border-radius: 4px;
    }
    
     .menu-button-container button:first-child {
        border-end-end-radius: 0;
        border-start-end-radius: 0;
    }
    
    .menu-button-container button:nth-child(2) {
        border-end-start-radius: 0;
        border-start-start-radius: 0;
    }

    .menu {
      position: absolute;
      background: var(--menu-bg);
      border: 1px solid var(--menu-border);
      border-radius: 4px;
      padding: 4px;
      box-shadow: 0 2px 8px var(--menu-shadow);
      z-index: 1000;
      min-width: 160px;
      margin-top: -6px;
      margin-left: -6px;
      visibility: hidden;
      pointer-events: none;
      opacity: 0;
      transition: opacity 100ms ease-out, visibility 0s 100ms;
      overflow: auto;
    }

    .menu[data-show] {
      visibility: visible;
      pointer-events: auto;
      opacity: 1;
      transition: opacity 100ms ease-out;
    }

    .menu-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 12px;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      border-radius: 2px;
    }

    .menu-item:hover,
    .menu-item:focus-visible {
      background: var(--button-hover);
    }

    .menu-item:focus-visible {
      outline: 2px solid #0066cc;
      outline-offset: -2px;
    }

    .menu-item[aria-haspopup="true"]::after {
      content: "→";
      margin-left: 8px;
    }
`;


class Menu {
    constructor(triggerEl, menuEl, parentMenu = null) {
        this.triggerEl = triggerEl;
        this.menuEl = menuEl;
        this.parentMenu = parentMenu;
        this.items = [];
        this.submenus = new Map();
        this.closeTimeout = null;

        this.setupEvents();
    }

    get isOpen() {
        return this.triggerEl.getAttribute('aria-expanded') === 'true';
    }

    set isOpen(value) {
        if (value) {
            this.menuEl.setAttribute('data-show', '');
            this.triggerEl.setAttribute('aria-expanded', 'true');
        } else {
            this.menuEl.removeAttribute('data-show');
            this.triggerEl.setAttribute('aria-expanded', 'false');
        }
    }

    setupEvents() {
        // Click and hover handling
        if (this.parentMenu) {
            // For submenus
            let isTouch = false;

            this.triggerEl.addEventListener('touchstart', () => {
                isTouch = true;
            }, { passive: true });

            this.triggerEl.addEventListener('click', (e) => {
                if (isTouch) {
                    e.preventDefault();
                    this.toggle();
                }
            });

            // Only add hover for non-touch
            this.triggerEl.addEventListener('mouseenter', (e) => {
                if (!isTouch) {
                    this.open();
                }
            });

            this.menuEl.addEventListener('mouseenter', () => {
                clearTimeout(this.closeTimeout);
            });

            this.triggerEl.addEventListener('mouseleave', (e) => {
                if (!isTouch && !this.menuEl.contains(e.relatedTarget)) {
                    this.closeTimeout = setTimeout(() => this.close(), 100);
                }
            });

            this.menuEl.addEventListener('mouseleave', (e) => {
                if (!isTouch && !this.triggerEl.contains(e.relatedTarget) && !this.menuEl.contains(e.relatedTarget)) {
                    this.closeTimeout = setTimeout(() => this.close(), 100);
                }
            });
        } else {
            // For root menu
            this.triggerEl.addEventListener('click', () => this.toggle());
        }

        // Keyboard navigation
        this.triggerEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.open();
                this.items[0]?.focus();
            } else if (e.key === 'ArrowDown') {
                this.items[0]?.focus();
            } else if (e.key === 'ArrowUp') {
                this.items[this.items.length - 1]?.focus();
            }
        });

        this.menuEl.addEventListener('keydown', (e) => {
            const target = e.target;
            const currentIndex = this.items.indexOf(target);

            if (!document.activeElement?.contains(target)) {
                return
            }

            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.items[(currentIndex + 1) % this.items.length]?.focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex - 1 < 0 ? this.items.length - 1 : currentIndex - 1;
                    this.items[prevIndex]?.focus();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.close();
                    this.triggerEl.focus();
                    break;
                case 'ArrowRight':
                    if (target.getAttribute('aria-haspopup') === 'true') {
                        e.preventDefault();
                        const submenu = this.submenus.get(target);
                        if (submenu) {
                            submenu.open();
                            submenu.items[0]?.focus();
                        }
                    }
                    break;
                case 'ArrowLeft':
                    if (this.parentMenu) {
                        e.preventDefault();
                        this.close();
                        this.triggerThatOpenedThis.focus();
                    }
                    break;
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.menuEl.contains(e.target) && !this.triggerEl.contains(e.target)) {
                this.close();
            }
        });
    }

    async updatePosition() {
        if (!this.isOpen) return;

        const placement = this.parentMenu ? 'right-start' : 'bottom-start';
        const fallbackPlacements = this.parentMenu
            ? ['left-start', 'top-start', 'bottom-start']
            : ['top-start', 'right-start', 'left-start'];

        const { x, y } = await computePosition(this.triggerEl, this.menuEl, {
            placement,
            middleware: [
                offset(4),
                flip({
                    fallbackPlacements,
                }),
                shift({ padding: 8 }),
                size({
                    padding: 8,
                    apply({availableWidth, availableHeight, elements}) {
                        console.log({ availableWidth, availableHeight, elements})
                        // Change styles, e.g.
                        Object.assign(elements.floating.style, {
                            // maxWidth: `${Math.max(0, availableWidth)}px`,
                            maxHeight: `${Math.max(0, availableHeight)}px`,
                        });
                    },
                }),
            ],
        });

        Object.assign(this.menuEl.style, {
            left: `${x}px`,
            top: `${y}px`,
        });



        this.submenus.forEach(submenu => submenu.updatePosition());
    }

    addSubmenu(triggerEl, submenuEl) {
        const submenu = new Menu(triggerEl, submenuEl, this);
        submenu.triggerThatOpenedThis = triggerEl;
        this.submenus.set(triggerEl, submenu);
        return submenu;
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        if (this.isOpen) return;

        this.isOpen = true;
        this.updatePosition();

        // Close other menus at the same level
        if (this.parentMenu) {
            for (const [trigger, submenu] of this.parentMenu.submenus) {
                if (submenu !== this) {
                    submenu.close();
                }
            }
        }
    }

    close() {
        if (!this.isOpen) return;

        this.isOpen = false;

        // Close all submenus
        for (const submenu of this.submenus.values()) {
            submenu.close();
        }
    }
}



export function toolbarPanel(view) {
    const menus = new Set()

    const style = document.createElement('style');
    style.innerText = css
    const panel = document.createElement('div');
    panel.classList.add('toolbar')
    panel.role = "toolbar"
    panel.ariaLabel = "Toolbar"
    panel.appendChild(style);
    const menuParent = view.dom

    const createMenuEl = (id) => {
        const menuEl = document.createElement('div');
        menuEl.id = id;
        menuEl.className = 'menu';
        menuEl.role = 'menu';
        menuEl.ariaLabel = 'Format options';
        menuParent.appendChild(menuEl);
        return menuEl;
    }

    const createMenuItem = (parent, menu, {id, label, action, items}) => {

        const itemEl = document.createElement('button');
        itemEl.className = 'menu-item';
        itemEl.role = 'menuitem';
        itemEl.innerText = label;
        itemEl.id = `menu-item-${id}`;

        parent.appendChild(itemEl);
        menu.items.push(itemEl);

        if (action) {
            itemEl.addEventListener('click', (e) => {
                action();
                view.focus();
                menus.values().forEach(menu => menu.close());
            })
        } else if (items) {
            const menuId = `menu-${id}`;
            itemEl.ariaHasPopup = 'true';
            itemEl.ariaExpanded = 'false';
            itemEl.setAttribute("aria-controls", menuId);

            const subMenuEl = createMenuEl(menuId);
            // parent.appendChild(subMenuEl);
            const subMenu = menu.addSubmenu(itemEl, subMenuEl);
            for (const item of items) {
                createMenuItem(subMenuEl, subMenu, item);
            }

        }

        return itemEl
    }

    const createButton = (parent, {id, label, action, items, tooltip, menuTooltip}) => {
        const button = document.createElement('button');
        button.className = 'toolbar-button';
        button.textContent = label;
        button.id = `button-${id}`;

        if (tooltip) {
            button.title = tooltip;
        }

        if (action) {
            button.addEventListener('click', (e) => {
                action();
                view.focus();
            })
            if (!items) {
                parent.appendChild(button);
            }
        }

        if (items) {
            const menuId = `menu-${id}`;

            const menuEl =  createMenuEl(menuId)
            // parent.appendChild(menuEl);


            if (action) {
                const containerEl = document.createElement('div');
                containerEl.className = 'menu-button-container';
                containerEl.appendChild(button);
                parent.appendChild(containerEl);

                const moreButton = document.createElement('button');
                moreButton.className = 'toolbar-button more-button';
                moreButton.id = `more-${id}`;
                moreButton.setAttribute('aria-haspopup', 'true');
                moreButton.setAttribute('aria-expanded', 'false');
                moreButton.setAttribute('aria-controls', menuId);
                moreButton.innerHTML = '&nbsp;'
                if (menuTooltip) {
                    moreButton.title = menuTooltip;
                }
                containerEl.appendChild(moreButton);
                const menu = new Menu(moreButton, menuEl)
                menus.add(menu)
                for (const item of items) {
                    createMenuItem(menuEl, menu, item)
                }
            } else {
                const menu = new Menu(button, menuEl)
                menus.add(menu)
                for (const item of items) {
                    createMenuItem(menuEl, menu, item)
                }
                button.setAttribute('aria-haspopup', 'true');
                button.setAttribute('aria-expanded', 'false');
                button.setAttribute('aria-controls', menuId);
                parent.appendChild(button);
            }
        }

        return button;
    }

    const applySnippet = (view, snippetDef) => {
        const { to, from } = view.state.selection.ranges[0]
        snippet(snippetDef.template)(view, null, from, to);
    }

    const buttons = [
        {
            id: "vestiges",
            label: "Vestiges",
            items: Object.entries(snippets).map(([id, value]) => ({
                id: id,
                label: value.completion.label + " " + value.completion.detail,
                action: () => applySnippet(view, value)
            }))
        },
        {
            id: "abbreviation",
            label: "(a(bc))",
            action: () => applySnippet(view, snippets.abbreviation),
            tooltip: snippets.abbreviation.completion.label + " " + snippets.abbreviation.completion.detail,
            menuTooltip: "More abbreviation markup",
            items: [
                {
                    id: "abbreviation-unresolved",
                    label: "Abbreviation, not resolved (|abc|)",
                    action: () => applySnippet(view, snippets.abbreviationUnresolved)
                }
            ]
        },
        {
            id: "supplied-lost",
            label: "[abc]",
            tooltip: "Lost text, supplied/restored",
            menuTooltip: "More lost text markup",
            action: () => applySnippet(view, snippets.suppliedLost),
            items: (() => {
                const {gapLostChars, gapLostCharsCa, gapLostCharsRange, gapLostCharsUnknown} = snippets;
                return Object.entries({gapLostChars, gapLostCharsCa, gapLostCharsRange, gapLostCharsUnknown}).map(([id, snippet]) => ({
                    id,
                    label: snippet.completion.label + ", " + snippet.completion.detail,
                    action: () => applySnippet(view, snippet)
                }))
            })()
        },
        {
            id: "deletion",
            label: "〚abc〛",
            tooltip: "Deleted text",
            menuTooltip: "More deletion markup",
            action: () => applySnippet(view, snippets.deletion),
            items: (() => {
                const { deletionSlashes, deletionCrossStrokes} = snippets;
                return Object.entries({deletionSlashes, deletionCrossStrokes}).map(([id, snippet]) => ({
                    id,
                    label: snippet.completion.label + ", " + snippet.completion.detail,
                    action: () => applySnippet(view, snippet)
                }))
            })()
        },
        {
            id: "unclear",
            label: "ạ",
            tooltip: "Mark as unclear",
            action: () => {}
        },
        {
            id: "unclear",
            label: "ā",
            tooltip: "Supraline",
            action: () => {}
        },
        {
            id: "number",
            label: "№",
            tooltip: "Number",
            action: () => {
                applySnippet(view, snippets.number);
            },
            items: (() => {
                const {number, numberFraction, numberFractionUnknown, numberRange, numberRangeUnknownEnd, numberTick, numberTickFraction, numberTickFractionUnknown, } = snippets;
                return Object.entries({number, numberFraction, numberFractionUnknown, numberRange, numberRangeUnknownEnd, numberTick, numberTickFraction, numberTickFractionUnknown}).map(([id, snippet]) => ({
                    id,
                    label: snippet.completion.label + ", " + snippet.completion.detail,
                    action: () => applySnippet(view, snippet)
                }))
            })()
        },
        {
            id: "format",
            label: "Format",
            items: [{
                id: "heading",
                label: "Heading 1",
                action: () => console.log("be2!")
            }, {
                id: "quote",
                label: "Quote",
                items: [
                    {
                        id: "left",
                        label: "Left",
                        action: () => console.log("be3!")
                    },
                    {
                        id: "center",
                        label: "Center",
                        action: () => console.log("be4!")
                    },
                    {
                        id: "right",
                        label: "Right",
                        items: [
                            {
                                id: "left",
                                label: "Left",
                                action: () => console.log("be5!")
                            },
                            {
                                id: "center",
                                label: "Center",
                                action: () => console.log("be6!")
                            },
                        ]
                    }
                ]
            }]
        }
    ]

    for (const button of buttons) {
        createButton(panel, button);
    }

    return {
        dom: panel,
        top: true,
        mount() {

            // Update positions on scroll and resize
            window.addEventListener('scroll', () => {
                menus.values().forEach(menu => menu.updatePosition());
            });

            window.addEventListener('resize', () => {
                menus.values().forEach(menu => menu.updatePosition());
            });
        },
        update(update) {
            const panelBg = getComputedStyle(update.view.dom.querySelector('.cm-panels')).backgroundColor
            this.dom.querySelectorAll('[role=menu]').forEach(menu => menu.style.backgroundColor = panelBg)
        }

    }
}