# @leiden-js/codemirror-leiden-trans

> Part of [leiden-js](https://github.com/cceh/leiden-js), a set of packages for working with the Leiden notation systems used in epigraphic digital editing within JavaScript environments.

Complete CodeMirror 6 setup for [Leiden Translation](https://papyri.info/docs/leiden_plus_translation) notation editing
with syntax highlighting, linting, toolbar, and all features included.

## Installation

```bash
npm install @leiden-js/codemirror-leiden-trans
```

## Usage

```typescript
import { leidenTranslation } from "@leiden-js/codemirror-leiden-trans";
import { EditorView } from "@codemirror/view";

const view = new EditorView({
  extensions: [
    leidenTranslation({
      lint: true,           // Enable linting (default: true)
      toolbar: true,        // Enable toolbar (default: true)
      highlightActiveNode: true  // Highlight active node (default: true)
    })
  ]
});
```

## Configuration

The `leidenTranslation()` function accepts a configuration object with options for customizing the editor behavior,
including language settings, linting configuration, and UI features. See the
[`codemirror-lang-leiden-trans`](https://github.com/cceh/leiden-js/tree/main/packages/codemirror-lang-leiden-trans)
package for language configuration options.

## Related Packages

- [`@leiden-js/codemirror-lang-leiden-trans`](https://github.com/cceh/leiden-js/tree/main/packages/codemirror-lang-leiden-trans) - Language support only
- [`@leiden-js/linter-leiden-trans`](https://github.com/cceh/leiden-js/tree/main/packages/linter-leiden-trans) - Linting only
- [`@leiden-js/toolbar-leiden-trans`](https://github.com/cceh/leiden-js/tree/main/packages/toolbar-leiden-trans) - Toolbar only