# @leiden-js/parser-leiden-plus

> Part of [leiden-js](https://github.com/cceh/leiden-js), a set of packages for working with the Leiden notation systems
> used in epigraphic digital editing within JavaScript environments.

Lezer-based parser for Leiden+ notation, generating syntax trees for the [Leiden+](https://papyri.info/docs/leiden_plus)
epigraphic notation system.

## Installation

```bash
npm install @leiden-js/parser-leiden-plus
```

## Usage

```typescript
import { parser } from "@leiden-js/parser-leiden-plus";

const text = "1. example [text]";
const tree = parser.parse(text);

// With custom top node
const tree = parser.configure({ top: "InlineContent" }).parse(text);

console.log(tree.toString());
```

## Top Node Options

The parser supports different entry points:
- `Document` (default) - Complete document structure
- `BlockContent` - Block-level content only
- `InlineContent` - Inline content only
- `SingleAb` - Single paragraph
- `SingleDiv` - Single division

## Related Packages

- [`@leiden-js/codemirror-lang-leiden-plus`](https://github.com/cceh/leiden-js/tree/main/packages/codemirror-lang-leiden-plus) - CodeMirror language integration
- [`@leiden-js/linter-leiden-plus`](https://github.com/cceh/leiden-js/tree/main/packages/linter-leiden-plus) - Linting for syntax trees produces by this parser
- [`@leiden-js/transformer-leiden-plus`](https://github.com/cceh/leiden-js/tree/main/packages/transformer-leiden-plus) - Transformations using this parser