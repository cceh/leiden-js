import {EditorView} from "@codemirror/view";

export const toolbarTheme = EditorView.baseTheme({
    "&": {
        "--chevron-down": "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 122.88 66.91\"><path fill=\"black\" d=\"M11.68 1.95a6.884 6.884 0 0 0-9.73.13 6.884 6.884 0 0 0 .13 9.73l54.79 53.13 4.8-4.93-4.8 4.95a6.9 6.9 0 0 0 9.75-.15c.08-.08.15-.16.22-.24l53.95-52.76a6.875 6.875 0 0 0 .14-9.73c-2.65-2.72-7.01-2.79-9.73-.13L61.65 50.41z\"/></svg>')",
        "--chevron-size": "0.33em",

        /* Spacing */
        "--toolbar-padding": "0.25rem",
        "--button-padding": "0.25rem 0.5rem",
        "--button-gap": "0.4rem",
        "--divider-margin": "0.25rem",

        /* Icons */
        "--icon-size": "0.5rem",
        "--icon-size-more": "0.75rem",
        "--icon-chevron": "var(--chevron-down)",

        /* Visual */
        "--border-radius": "0.25rem",
        "--focus-ring-width": "2px",
        "--focus-ring-offset": "2px",
        "--divider-width": "1px",

        /* Colors */
        "--color-focus": "#0066cc",
        "--color-divider": "var(--cm-panel-border-color)", // set dynamically by default
        "--color-button-bg": "var(--cm-panel-bg-color)",
        "--color-button-text": "currentColor",
        "--color-menu-border": "var(--cm-panel-border-color)", // set dynamically by default
        "--color-menu-bg": "var(--cm-panel-bg-color)", // set dynamically by default
        "--color-menu-text": "var(--cm-panel-text-color)",// set dynamically by default


        /* Typography */
        "--font-family": "system-ui, sans-serif"
    },

    "&light": {
        "--menu-shadow": "rgba(0, 0, 0, 0.1)",
        "--color-hover-bg": "color-mix(in srgb, var(--color-button-bg), black 10%)",
        "--color-menu-secondary-text": "color-mix(in srgb, currentColor, white 50%)",
        "--color-button-text-disabled": "color-mix(in srgb, currentColor, white 70%)",
        "--color-menu-text-disabled": "color-mix(in srgb, currentColor, white 70%)"
    },
    "&dark": {
        "--menu-shadow": "rgba(0, 0, 0, 0.7)",
        "--color-hover-bg": "color-mix(in srgb, var(--color-button-bg), white 10%)",
        "--color-menu-secondary-text": "color-mix(in srgb, currentColor, black 50%)",
        "--color-button-text-disabled": "color-mix(in srgb, currentColor, black 40%)",
        "--color-menu-text-disabled": "color-mix(in srgb, currentColor, black 45%)"
    },

    /* Toolbar container */
    ".cm-ljs-toolbar": {
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        padding: "var(--toolbar-padding)",
        fontFamily: "var(--font-family)"
    },

    /* Toolbar button */
    ".cm-ljs-toolbar-button": {
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        padding: "var(--button-padding)",
        border: "none",
        backgroundColor: "var(--color-button-bg)",
        borderRadius: "var(--border-radius)",
        cursor: "pointer",
        position: "relative",
        lineHeight: "1",
        color: "var(--color-button-text)"
    },

    ".cm-ljs-toolbar-button[disabled]": {
      color: "var(--color-button-text-disabled)",
    },

    ".cm-ljs-toolbar-button:hover:not([disabled]), .cm-ljs-toolbar-button[aria-expanded=\"true\"]": {
        background: "var(--color-hover-bg)"
    },

    ".cm-ljs-toolbar-button:focus-visible": {
        outline: "var(--focus-ring-width) solid var(--color-focus)",
        outlineOffset: "var(--focus-ring-offset)"
    },

    ".cm-ljs-toolbar-button[aria-haspopup=\"true\"]": {
        gap: "var(--button-gap)"
    },

    ".cm-ljs-toolbar-button[aria-haspopup=\"true\"]:after, .cm-ljs-toolbar-more-button:after": {
        content: '""',
        width: "var(--icon-size)",
        height: "var(--icon-size)",
        mask: "var(--icon-chevron)",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
        backgroundColor: "currentColor",
    },

    /* More button (with commented-out padding preserved as a JS comment) */
    ".cm-ljs-toolbar-more-button": {
        display: "flex",
        alignItems: "center"
        // paddingInlineEnd: "calc(var(--button-gap) / 2)", // Match the menu button
    },

    ".cm-ljs-toolbar-more-button:after": {
        width: "var(--icon-size-more)",
        height: "var(--icon-size-more)"
    },

    /* Divider */
    ".cm-ljs-toolbar-divider": {
        width: "var(--divider-width)",
        margin: "var(--divider-margin)",
        background: "var(--color-divider)",
        alignSelf: "stretch"
    },

    /* Split button container */
    ".cm-ljs-toolbar-split-button-container": {
        display: "flex",
        alignItems: "stretch"
    },

    ".cm-ljs-toolbar-split-button-container:hover, .cm-ljs-toolbar-split-button-container:has([aria-expanded=\"true\"])": {
        boxSizing: "border-box",
        boxShadow: "0 0 0 var(--divider-width) var(--color-hover-bg) inset",
        borderRadius: "var(--border-radius)"
    },

    ".cm-ljs-toolbar-split-button-container button:first-child": {
        borderEndEndRadius: "0",
        borderStartEndRadius: "0",
        paddingInlineEnd: "calc(var(--button-gap) / 2)" // Match the menu button
    },

    ".cm-ljs-toolbar-split-button-container button:nth-child(2)": {
        borderEndStartRadius: "0",
        borderStartStartRadius: "0",
        paddingInline: "calc(var(--button-gap) / 2)" // Match the menu button
    },

    /* Menu container */
    ".cm-ljs-toolbar-menu-container": {
        position: "relative",
        zIndex: "1000",
        pointerEvents: "none"
    },

    /* Keyframes for menu fade-in */
    "@keyframes menu-fade-in": {
        from: { opacity: "0" },
        to: { opacity: "1" }
    },

    /* Toolbar menu */
    ".cm-ljs-toolbar-menu": {
        position: "fixed",
        background: "var(--color-menu-bg, var(--cm-panel-bg-color))",
        border: "1px solid var(--color-divider, var(--cm-panel-border-color))",
        borderRadius: "4px",
        padding: "4px",
        boxShadow: "0 2px 8px var(--menu-shadow)",
        zIndex: "1000",
        minWidth: "160px",
        marginTop: "-6px",
        marginLeft: "-6px",
        display: "none",
        pointerEvents: "none",
        overflow: "auto",
        opacity: "0"
    },

    ".cm-ljs-toolbar-menu[data-show]": {
        display: "block",
        pointerEvents: "auto",
        animation: "menu-fade-in 0.1s ease-out forwards"
    },

    /* Menu item */
    ".cm-ljs-toolbar-menu-item": {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 12px",
        border: "none",
        background: "none",
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        borderRadius: "2px",
        color: "var(--color-menu-text, var(--cm-panel-text-color))"
    },

    ".cm-ljs-toolbar-menu-item[disabled]": {
        color: "var(--color-menu-text-disabled)"
    },

    ".cm-ljs-toolbar-menu-item .cm-ljs-toolbar-info": {
        color: "var(--color-menu-secondary-text)",
    },

    ".cm-ljs-toolbar-menu-item .cm-ljs-toolbar-info:not(:empty)": {
        paddingInlineStart: "1em"
    },

    ".cm-ljs-toolbar-menu-item:hover:not([disabled]), .cm-ljs-toolbar-menu-item:focus-visible, .cm-ljs-toolbar-menu-item[aria-expanded=true]": {
        background: "var(--color-hover-bg)"
    },

    ".cm-ljs-toolbar-menu-item:focus-visible": {
        outline: "2px solid #0066cc",
        outlineOffset: "-2px"
    },

    ".cm-ljs-toolbar-menu-item[aria-haspopup=true]::after": {
        content: '"→"',
        marginLeft: "8px"
    },

    /* Context items */
    ".cm-ljs-toolbar-context-items": {
        marginLeft: "auto",
        border: "1px solid var(--menu-border)"
    }
});