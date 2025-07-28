# @leiden-js/transformer-leiden-plus

> Part of [leiden-js](https://github.com/cceh/leiden-js), a set of packages for working with the Leiden notation systems
> used in epigraphic digital editing within JavaScript environments.

Bidirectional transformer for converting between [Leiden+](https://papyri.info/docs/leiden_plus) notation
and [EpiDoc XML](https://epidoc.stoa.org/).

## Installation

```bash
npm install @leiden-js/transformer-leiden-plus
```

## Usage

### Leiden+ to XML

```typescript
import {leidenPlusToXml} from "@leiden-js/transformer-leiden-plus";

const leidenText = "<S=.grc <D=.r <= 1. Ἰωάννης, (υ(ἱὸς)) Ἀντωνίου => =D>";
const xml = leidenPlusToXml(leidenText);
```

### XML to Leiden+

```typescript
import {xmlToLeidenPlus} from "@leiden-js/transformer-leiden-plus";

const xml = `
    <div xml:lang="grc" type="edition" xml:space="preserve">
        <div n="r" type="textpart">
            <ab> <lb n="1"/>Ἰωάννης, <expan>υ<ex>ἱὸς</ex></expan> Ἀντωνίου</ab>
        </div>
    </div>`;

const leiden = xmlToLeidenPlus(xml);
```

## Related Packages

- [`@leiden-js/parser-leiden-plus`](https://github.com/cceh/leiden-js/tree/main/packages/parser-leiden-plus) - Parser for Leiden+ input
- [`@leiden-js/transformation-service`](https://github.com/cceh/leiden-js/tree/main/packages/transformation-service) - REST API using his transformer