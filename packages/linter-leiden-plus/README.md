# @leiden-js/linter-leiden-plus

> Part of [leiden-js](https://github.com/cceh/leiden-js), a set of packages for working with the Leiden notation systems
> used in epigraphic digital editing within JavaScript environments.

Linter for Leiden+ notation, providing syntax validation and error detection for
the [Leiden+](https://papyri.info/docs/leiden_plus) epigraphic notation system.

## Installation

```bash
npm install @leiden-js/linter-leiden-plus
```

## Usage

### Standalone Usage

Use the linting function for server-side or custom implementations:

```typescript
import {lintLeidenPlus} from "@leiden-js/linter-leiden-plus";
import {parser} from "@leiden-js/parser-leiden-plus";

const text = "example [unclosed";
const tree = parser.parse(text, {topNode: "InlineContent"});
const errors = lintLeidenPlus(text, tree);

console.log(errors);
// [{ from: 8, to: 17, severity: "error", message: "...", code: "..." }]
```

### CodeMirror Integration

For CodeMirror 6 integration, use the pre-configured extension:

```typescript
import {leidenPlusLinter} from "@leiden-js/linter-leiden-plus";
import {EditorView} from "@codemirror/view";

const view = new EditorView({
    extensions: [
        // ... other extensions
        leidenPlusLinter(),
        // With custom configuration
        leidenPlusLinter({
            delay: 1000,        // Delay before linting (ms)
            autoPanel: true,    // Auto-open lint panel
        })
    ]
});
```

## API

### `lintLeidenPlus(doc: string, syntaxTree: Tree): LeidenDiagnostic[]`

Linting function for Leiden+ text.

- **doc**: The document text to lint
- **syntaxTree**: Parsed syntax tree from `@leiden-js/parser-leiden-plus`
- **Returns**: Array of diagnostic objects with error locations and messages, and unique error codes for programmatic
  handling and testing

### `leidenPlusLinter(config?: LintConfig): Extension`

CodeMirror extension that integrates the linter.

- **config**: Optional [CodeMirror lint configuration](https://codemirror.net/docs/ref/#lint.linter^config)
- **Returns**: CodeMirror extension

## Related Packages

- [`@leiden-js/parser-leiden-plus`](../parser-leiden-plus) - Required parser
- [`@leiden-js/codemirror-leiden-plus`](../codemirror-leiden-plus) - Complete set of editor extensions with linting
  included