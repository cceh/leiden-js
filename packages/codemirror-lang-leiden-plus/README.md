# @leiden-js/codemirror-lang-leiden-plus

> Part of [leiden-js](https://github.com/cceh/leiden-js), a set of packages for working with the Leiden notation systems
> used in epigraphic digital editing within JavaScript environments.

CodeMirror 6 language support for [Leiden+](https://papyri.info/docs/leiden_plus) notation, providing syntax
highlighting and language features.

## Installation

```bash
npm install @leiden-js/codemirror-lang-leiden-plus
```

## Usage

```typescript
import {leidenPlusLanguage} from "@leiden-js/codemirror-lang-leiden-plus";
import {EditorView} from "@codemirror/view";

const view = new EditorView({
    extensions: [
        leidenPlusLanguage()
    ]
});
```

## API

### `leidenPlusLanguage(config?: LeidenPlusLanguageConfig): LanguageSupport`

Creates a CodeMirror language support extension for Leiden+ notation.

#### Configuration Options

```typescript
interface LeidenPlusLanguageConfig {
    topNode?: "Document" | "InlineContent" | "SingleDiv" | "SingleAb" | "BlockContent";
    leidenHighlightStyle?: "light" | "dark" | "none";
}
```

### Additional Exports

- **`snippets`** – Autocomplete snippets for common Leiden+ patterns
- **`inlineContentAllowed`**, **`atomicRules`**, **`wrappingRules`** - Syntax rule sets
- CertLow utilities – Functions for working with certainty markers:
    - `acceptsCertLow`, `hasCertLow`, `getCertLow`, `addCertLow`, `removeCertLow`

## Features

- Syntax highlighting with light/dark themes
- Auto-indentation for structural elements
- Code folding for nested structures
- Bracket matching
- Autocomplete snippets

## Related Packages

- [`@leiden-js/parser-leiden-plus`](https://github.com/cceh/leiden-js/tree/main/packages/parser-leiden-plus) - Underlying parser
- [`@leiden-js/codemirror-leiden-plus`](https://github.com/cceh/leiden-js/tree/main/packages/codemirror-leiden-plus) - Complete set of editor extensions with all features