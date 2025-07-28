# @leiden-js/codemirror-leiden-plus

> Part of [leiden-js](https://github.com/cceh/leiden-js), a set of packages for working with the Leiden notation systems
> used in epigraphic digital editing within JavaScript environments.

Full CodeMirror 6 setup for [Leiden+](https://papyri.info/docs/leiden_plus) notation editing with syntax highlighting,
linting, toolbar, and all features included.

## Installation

```bash
npm install @leiden-js/codemirror-leiden-plus
```

## Usage

```typescript
import {leidenPlus} from "@leiden-js/codemirror-leiden-plus";
import {EditorView} from "@codemirror/view";

const view = new EditorView({
    extensions: [
        leidenPlus({
            lint: true,           // Enable linting (default: true)
            toolbar: true,        // Enable toolbar (default: true)
            highlightActiveNode: true,  // Highlight active node (default: true),
            languageConfig: {
                // Optional language configuration 
            }
        })
    ]
});
```

## Configuration

The `leidenPlus()` function accepts a configuration object with options for customizing the editor behavior, including
language settings, linting configuration, and UI features. See the 
[`codemirror-lang-leiden-plus`](https://github.com/cceh/leiden-js/tree/main/packages/codemirror-lang-leiden-plus)
package for language configuration options.

## Related Packages

- [`@leiden-js/codemirror-lang-leiden-plus`](https://github.com/cceh/leiden-js/tree/main/packages/codemirror-lang-leiden-plus) - Language support only
- [`@leiden-js/linter-leiden-plus`](https://github.com/cceh/leiden-js/tree/main/packages/linter-leiden-plus) - Linting only
- [`@leiden-js/toolbar-leiden-plus`](https://github.com/cceh/leiden-js/tree/main/packages/toolbar-leiden-plus) - Toolbar only