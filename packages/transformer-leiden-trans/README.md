# @leiden-js/transformer-leiden-trans

> Part of [leiden-js](https://github.com/cceh/leiden-js), a set of packages for working with the Leiden notation systems used
in epigraphic digital editing within JavaScript environments.

Bidirectional transformer for converting between [Leiden Translation](https://papyri.info/docs/leiden_plus_translation)
notation and [EpiDoc XML](https://epidoc.stoa.org/).

## Installation

```bash
npm install @leiden-js/transformer-leiden-trans
```

## Usage

### Leiden Translation to XML

```typescript
import { leidenTransToXml } from "@leiden-js/transformer-leiden-trans";

const translationText = "<T=.en <D=.n <= ((1)) example 〚translation〛 => =D>";
const xml = leidenTransToXml(translationText);
```

### XML to Leiden Translation

```typescript
import { xmlToLeidenTrans } from "@leiden-js/transformer-leiden-trans";

const xml = `
    <div xml:lang="en" type="translation" xml:space="preserve">
        <div n="n" type="textpart">
            <p> <milestone unit="line" n="1"/> example <del>translation</del></p>
        </div>
    </div>`;

const leiden = xmlToLeidenTrans(xml);
```

## Features

- Bidirectional transformation between Leiden Translation and XML
- Support for translation-specific markup patterns
- Configurable document structure
- Error handling and validation

## Related Packages

- [`@leiden-js/parser-leiden-trans`](https://github.com/cceh/leiden-js/tree/main/packages/parser-leiden-trans) - Required parser for Leiden Translation input
- [`@leiden-js/transformation-service`](https://github.com/cceh/leiden-js/tree/main/packages/transformation-service) - REST API using these transformers