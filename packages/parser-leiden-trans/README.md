# @leiden-js/parser-leiden-trans

> Part of [leiden-js](https://github.com/cceh/leiden-js), a set of packages for working with the Leiden notation systems
> used in epigraphic digital editing within JavaScript environments.

Lezer-based parser for Leiden Translation notation, generating syntax trees for
[Leiden Translation](https://papyri.info/docs/leiden_plus_translation) notation system used in translations of
ancient texts.

## Installation

```bash
npm install @leiden-js/parser-leiden-trans
```

## Usage

```typescript
import { parser } from "@leiden-js/parser-leiden-trans";

const text = "((1)) example translation〚text〛";
const tree = parser.parse(text);

// With custom top node
const tree = parser.configure({ top: "InlineContent" }).parse(text);

console.log(tree.toString());
```

## Top Node Options

The parser supports different entry points:
- `Document` (default) - Complete document structure
- `BlockContent` - Block-level content only
- `SingleTranslation` - Single translation block
- `SingleDiv` - Single division
- `SingleP` - Single paragraph
- `InlineContent` - Inline content only

## Related Packages

- [`@leiden-js/codemirror-lang-leiden-trans`](https://github.com/cceh/leiden-js/tree/main/packages/codemirror-lang-leiden-trans) - CodeMirror language integration
- [`@leiden-js/linter-leiden-trans`](https://github.com/cceh/leiden-js/tree/main/packages/linter-leiden-trans) - Linting for syntax trees produces by this parser
- [`@leiden-js/transformer-leiden-trans`](https://github.com/cceh/leiden-js/tree/main/packages/transformer-leiden-trans) - Transformations using this parser