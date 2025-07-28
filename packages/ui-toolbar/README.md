# @leiden-js/ui-toolbar

> Part of [leiden-js](https://github.com/cceh/leiden-js), a set of packages for working with the Leiden notation systems used in epigraphic digital editing within JavaScript environments.

Base UI components and utilities for building syntax-aware, accessible toolbars in CodeMirror editors, providing
reusable components for buttons, menus, and toolbar layouts.

## Installation

```bash
npm install @leiden-js/ui-toolbar
```

## Usage

[Example on StackBlitz](https://stackblitz.com/edit/leiden-js-toolbar?file=src%2Fmain.ts)

```typescript
import { toolbar, toolbarConfig } from "@leiden-js/ui-toolbar";
import { EditorView } from "@codemirror/view";

// Basic toolbar with action buttons and menus
const view = new EditorView({
  extensions: [
    toolbar([
      toolbarConfig.facet.of((state) => ({
        items: [
          // Action button
          {
            type: "action",
            id: "bold",
            label: "Bold",
            tooltip: "Make text bold (Ctrl+B)",
            action: (view) => {
              // Insert bold markup or toggle bold state
              console.log("Bold clicked");
            }
          },
          
          // Visual separator
          { type: "divider" },
          
          // Menu button with dropdown
          {
            type: "menu",
            id: "insert",
            label: "Insert",
            tooltip: "Insert elements",
            items: [
              {
                type: "action",
                id: "link",
                label: "Link",
                info: "Ctrl+K",  // Keyboard shortcut hint
                action: (view) => console.log("Insert link")
              },
              {
                type: "menu",
                id: "special",
                label: "Special Characters",
                items: [
                  { type: "action", id: "ndash", label: "– En Dash", action: (view) => view.dispatch({ changes: { from: view.state.selection.main.from, insert: "–" } }) },
                  { type: "action", id: "mdash", label: "— Em Dash", action: (view) => view.dispatch({ changes: { from: view.state.selection.main.from, insert: "—" } }) }
                ]
              }
            ]
          },
          
          // Split button (primary action + dropdown menu)
          {
            type: "split",
            id: "heading",
            label: "H1",
            tooltip: "Insert heading",
            menuTooltip: "More heading options",
            action: (view) => console.log("Insert H1"),
            items: [
              { type: "action", id: "h2", label: "Heading 2", action: (view) => console.log("Insert H2") },
              { type: "action", id: "h3", label: "Heading 3", action: (view) => console.log("Insert H3") }
            ],
            // Preview on hover
            hoverAction: {
              enter: (view) => console.log("Show heading preview"),
              leave: (view) => console.log("Clear preview")
            }
          },
          
          // State-aware button (active when text is selected)
          {
            type: "action", 
            id: "clear-formatting",
            label: "Clear Format",
            tooltip: "Remove formatting from selected text",
            // Active state based on editor state
            active: state.selection.main.from !== state.selection.main.to,
            action: (view) => {
              // Clear formatting from selection
              console.log("Clear formatting");
            }
          }
        ]
      }))
    ])
  ]
});
```

### Helper Functions

```typescript
import { createMenuItemFromSnippet, createMenuItemsFromSnippets, setPreviewHighlights } from "@leiden-js/ui-toolbar";
import { snippetCompletion } from "@codemirror/autocomplete";

// Create menu items from autocomplete snippets
const snippets = {
  bold: snippetCompletion("**${text}**", { label: "Bold" }),
  italic: snippetCompletion("*${text}*", { label: "Italic" })
};

const menuItems = createMenuItemsFromSnippets(snippets);

// Set preview highlights on hover
const button = {
  type: "action",
  id: "highlight",
  label: "Highlight",
  hoverAction: {
    enter: (view) => setPreviewHighlights(view, [{ from: 0, to: 10, className: "preview-highlight" }]),
    leave: (view) => setPreviewHighlights(view, [])
  }
};
```

## Components

- **`toolbar`** - Main toolbar container
- **`actionButton`** - Simple action buttons
- **`menuButton`** - Dropdown menu buttons
- **`splitButton`** - Split buttons with primary action and dropdown
- **`divider`** - Visual separators

## Related Packages

- [`@leiden-js/toolbar-leiden-plus`](https://github.com/cceh/leiden-js/tree/main/toolbar-leiden-plus) - Leiden+ specific toolbar
- [`@leiden-js/toolbar-leiden-trans`](https://github.com/cceh/leiden-js/tree/main/toolbar-leiden-trans) - Leiden Translation specific toolbar