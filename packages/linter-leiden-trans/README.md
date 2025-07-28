# @leiden-js/linter-leiden-trans

> Part of [leiden-js](https://github.com/cceh/leiden-js), a set of packages for working with the Leiden notation systems
> used in epigraphic digital editing within JavaScript environments.

Linter for Leiden Translation notation, providing syntax validation for translations of ancient texts using the
simplified Leiden notation system.

## Installation

```bash
npm install @leiden-js/linter-leiden-trans
```

## Usage

### Standalone Usage

Use the linting function for server-side or custom implementations:

```typescript
import {lintLeidenTrans} from "@leiden-js/linter-leiden-trans";
import {parser} from "@leiden-js/parser-leiden-trans";

const text = "example /*unclosed";
const tree = parser.parse(text, {topNode: "InlineContent"});
const errors = lintLeidenTrans(text, tree);

console.log(errors);
// [{ from: 8, to: 18, severity: "error", message: "..." }]
```

### CodeMirror Integration

For CodeMirror 6 integration, use the pre-configured extension:

```typescript
import {leidenTransLinter} from "@leiden-js/linter-leiden-trans";
import {EditorView} from "@codemirror/view";

const view = new EditorView({
    extensions: [
        // ... other extensions
        leidenTransLinter(),
        // With custom configuration
        leidenTransLinter({
            delay: 1000,        // Delay before linting (ms)
            autoPanel: true,    // Auto-open lint panel
        })
    ]
});
```

## API

### `lintLeidenTrans(doc: string, syntaxTree: Tree): Diagnostic[]`

Pure linting function for Leiden Translation text.

- **doc**: The document text to lint
- **syntaxTree**: Parsed syntax tree from `@leiden-js/parser-leiden-trans`
- **Returns**: Array of diagnostic objects with error locations and messages, and unique error codes for programmatic
  handling and testing

### `leidenTransLinter(config?: LintConfig): Extension`

CodeMirror extension that integrates the linter.

- **config**: [CodeMirror lint configuration](https://codemirror.net/docs/ref/#lint.linter^config)
- **Returns**: CodeMirror extension

## Features

The linter validates:

- Unclosed paragraph markers (`<P=` ... `=P>`)
- Unclosed division markers (`<D=` ... `=D>`)
- Unclosed foreign text markers (`~|` ... `|~`)
- General syntax errors

## Related Packages

- [`@leiden-js/parser-leiden-trans`](../parser-leiden-trans) - Required parser
- [`@leiden-js/codemirror-leiden-trans`](../codemirror-leiden-trans) - Complete set of editor extensions with linting
  included