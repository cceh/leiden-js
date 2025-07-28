# @leiden-js/codemirror-lang-leiden-trans

> Part of [leiden-js](https://github.com/cceh/leiden-js), a set of packages for working with the Leiden notation systems
> used in epigraphic digital editing within JavaScript environments.

CodeMirror 6 language support for [Leiden Translation](https://papyri.info/docs/leiden_plus_translation) notation,
providing syntax highlighting and language features.

## Installation

```bash
npm install @leiden-js/codemirror-lang-leiden-trans
```

## Usage

```typescript
import {leidenTransLanguage} from "@leiden-js/codemirror-lang-leiden-trans";
import {EditorView} from "@codemirror/view";

const view = new EditorView({
    extensions: [
        leidenTransLanguage()
    ]
});
```

## API

### `leidenTransLanguage(config?: LeidenTransLanguageConfig): LanguageSupport`

Creates a CodeMirror language support extension for Leiden Translation notation.

#### Configuration Options

```typescript
interface LeidenTransLanguageConfig {
    topNode?: "Document" | "SingleTranslation" | "SingleDiv" | "SingleP" | "BlockContent" | "InlineContent";
    leidenHighlightStyle?: "light" | "dark" | "none";
}
```

### Additional Exports

- **`snippets`** – Autocomplete snippets for common Leiden Translation patterns
- **`inlineContentAllowed`**, **`wrappingRules`** - Syntax rule sets
- **Translation utilities** – Functions for working with translation blocks:
    - `addTranslation`
- **Division utilities** – Functions for working with divisions:
    - `canAddDivision`, `addDivision`, `DivisionSnippetKey`

## Features

- Syntax highlighting with light/dark themes
- Auto-indentation for structural elements
- Code folding for nested structures
- Bracket matching
- Autocomplete snippets

## Related Packages

- [`@leiden-js/parser-leiden-trans`](https://github.com/cceh/leiden-js/tree/main/packages/parser-leiden-trans) - Underlying parser
- [`@leiden-js/codemirror-leiden-trans`](https://github.com/cceh/leiden-js/tree/main/packages/codemirror-leiden-trans) - Complete set of editor extensions with all features