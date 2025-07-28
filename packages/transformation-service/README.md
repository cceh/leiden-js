# @leiden-js/transformation-service

> Part of [leiden-js](https://github.com/cceh/leiden-js), a set of packages for working with the Leiden notation systems
> used in epigraphic digital editing within JavaScript environments.

REST API service for bidirectional transformation between Leiden notation and XML.

## Installation & Usage

### As a standalone service

```bash
# Install globally from NPM
npm install -g @leiden-js/transformation-service

# Start the service
leiden-transformation-service

# Show available options
leiden-transformation-service --help

# Run on a specific port and host
leiden-transformation-service --port 8080 --host 127.0.0.1
```

The service will be available at http://localhost:8080 (or whatever port you specify).

### In a Node.js application

```bash
# Install as a dependency
npm install @leiden-js/transformation-service
```

```javascript
import { startServer } from '@leiden-js/transformation-service';

// Start with custom port and host
const server = startServer(8080, '127.0.0.1');

// Stop the server when needed
server.close();
```

### For development or testing

```bash
# From root of the monorepo
pnpm install

# Run the service (from this package directory)
pnpm start

# Development server with auto-restart
pnpm dev
```

By default, the service runs on port 3000 or the port specified in the `PORT` environment variable.

## API Documentation

API documentation is available at the `/api-docs` endpoint when the service is running.

### Endpoints

| Method | Endpoint                         | Description                           |
|--------|----------------------------------|---------------------------------------|
| GET    | `/`                              | API information                       |
| POST   | `/transform/leiden-plus/to-xml`  | Convert Leiden+ to XML                |
| POST   | `/transform/xml/to-leiden-plus`  | Convert XML to Leiden+                |
| POST   | `/transform/leiden-trans/to-xml` | Convert Leiden Trans to XML           |
| POST   | `/transform/xml/to-leiden-trans` | Convert XML to Leiden Trans           |

### Request Format

```json
{
  "content": "The content to transform",
  "topNode": "Document" // Optional, defaults to "Document"
}
```

The `topNode` parameter is only available for Leiden-to-XML transformations.

### Response Format

Successful response:
```json
{
  "success": true,
  "content": "Transformed content",
  "parseErrors": [] // Optional array of non-fatal parsing errors
}
```

Error response:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {} // Optional error-specific details
  }
}
```

## Related Packages

- [`@leiden-js/transformer-leiden-plus`](https://github.com/cceh/leiden-js/tree/main/packages/transformer-leiden-plus) - Leiden+ transformer used in this package
- [`@leiden-js/transformer-leiden-trans`](https://github.com/cceh/leiden-js/tree/main/packages/transformer-leiden-trans) - Leiden Translation transformer used in this package