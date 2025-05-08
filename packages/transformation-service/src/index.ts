import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { parser as leidenPlusParser } from "@leiden-js/parser-leiden-plus";
import { parser as leidenTransParser } from "@leiden-js/parser-leiden-trans";
import { lintLeidenPlus } from "@leiden-js/linter-leiden-plus";
import { lintLeidenTrans } from "@leiden-js/linter-leiden-trans";
import { leidenPlusToXml, xmlToLeidenPlus } from "@leiden-js/transformer-leiden-plus";
import { leidenTransToXml, xmlToLeidenTrans } from "@leiden-js/transformer-leiden-trans";
import { DOMParser, XMLSerializer } from "slimdom";
import { ParserError, TransformationError } from "@leiden-js/common/transformer";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { z } from "zod";

/**
 * @openapi
 * info:
 *   title: Leiden Transformation Service API
 *   version: 1.0.0
 *   description: |
 *     API for transforming between Leiden+ notation, Leiden Trans notation, and XML formats.
 *
 *     This service provides bidirectional conversion between:
 *     - Leiden+ (epigraphic notation) and XML
 *     - Leiden Trans (translation notation) and XML

 * components:
 *   schemas:
 *     BaseRequest:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: The content to transform
 *       example:
 *         content: "<ab>Sample content</ab>"
 *
 *     LeidenPlusToXmlRequest:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseRequest'
 *         - type: object
 *           properties:
 *             topNode:
 *               type: string
 *               enum: [Document, InlineContent, SingleDiv, SingleAb, BlockContent]
 *               default: Document
 *               description: The top-level node type to use for parsing
 *
 *     LeidenTransToXmlRequest:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseRequest'
 *         - type: object
 *           properties:
 *             topNode:
 *               type: string
 *               enum: [Document, SingleTranslation, SingleDiv, SingleP, BlockContent, InlineContent]
 *               default: Document
 *               description: The top-level node type to use for parsing
 *       example:
 *         content: "Example Leiden Trans content"
 *         topNode: "Document"
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         content:
 *           type: string
 *           description: The transformed content
 *           example: "<ab>Transformed content</ab>"
 *         parseErrors:
 *           type: array
 *           description: Optional array of parsing errors that didn't prevent transformation
 *           items:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   from:
 *                     type: integer
 *                   to:
 *                     type: integer
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: "INVALID_REQUEST"
 *             message:
 *               type: string
 *               example: "Invalid input"
 *     
 *     XMLErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ErrorResponse'
 *         - type: object
 *           properties:
 *             error:
 *               type: object
 *               properties:
 *                 details:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/XMLParseErrorDetails'
 *                     - $ref: '#/components/schemas/XMLTransformationErrorDetails'
 *                   description: XML-specific error details
 *     
 *     XMLParseErrorDetails:
 *       type: object
 *       properties:
 *         location:
 *           type: object
 *           properties:
 *             line:
 *               type: integer
 *             column:
 *               type: integer
 *
 *     XMLTransformationErrorDetails:
 *       type: object
 *       properties:
 *         path:
 *           type: array
 *           description: Path in the document where the error occurred
 *           items:
 *             type: array
 *             items:
 *               oneOf:
 *                 - type: string
 *                 - type: integer
 *         source:
 *           type: string
 *
 *   responses:
 *     SuccessResponse:
 *       description: Successful transformation
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SuccessResponse'
 *
 *     ErrorResponse:
 *       description: Error response
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     
 *     XMLErrorResponse:
 *       description: XML-specific error response
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/XMLErrorResponse'
 */


// Zod Schemas for Request Validation
const baseRequestSchema = z.object({ content: z.string() });
const xmlToLeidenRequestSchema = baseRequestSchema;

const leidenPlusToXmlRequestSchema = baseRequestSchema.extend({
    topNode: z.enum([
        "Document", "InlineContent", "SingleDiv", "SingleAb", "BlockContent"
    ]).optional().default("Document")
});

const leidenTransToXmlRequestSchema = baseRequestSchema.extend({
    topNode: z.enum([
        "Document", "SingleTranslation", "SingleDiv", "SingleP", "BlockContent", "InlineContent"
    ]).optional().default("Document")
});

// API Response Types
interface SuccessResponse {
    success: true;
    content: string;
    parseErrors?: Array<{
        message: string;
        location: {
            from: number;
            to: number;
        };
    }>;
}

interface XMLTransformationErrorDetails {
    path: [name: string, index: number][];
    source: string;
}

interface XMLParseErrorDetails {
    location?: {
        line?: number;
        column?: number;
    };
}

type ErrorDetails = XMLParseErrorDetails | XMLTransformationErrorDetails | undefined;

interface ErrorResponse<D extends ErrorDetails = undefined> {
    success: false;
    error: {
        code: string;
        message: string;
        details?: D
    }
}


const app = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Leiden Transformation Service API",
            version: "1.0.0",
            description: "API for transforming between Leiden Plus/Trans notation and XML"
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: "Development server"
            }
        ]
    },
    apis: ["./src/index.ts"] // Path to files containing annotations
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

function createErrorResponse<D extends ErrorDetails>(res: Response, status: number, code: string, message: string, details?: D) {
    return res.status(status).json({
        success: false,
        error: {
            code, message, ...details
        }
    } as ErrorResponse<D>);
}

function validateRequest<T>(schema: z.ZodSchema<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return createErrorResponse(res, 400, "INVALID_REQUEST", result.error.message);
        }

        req.body = result.data;
        next();
    };
}

function leidenToXml(
    req: Request,
    res: Response,
    parser: typeof leidenPlusParser | typeof leidenTransParser,
    transform: typeof leidenPlusToXml | typeof leidenTransToXml,
    lint: typeof lintLeidenPlus | typeof lintLeidenTrans,
) {
    const { content, topNode } = req.body;

    let parseTree;
    try {
        parseTree = parser.configure({ top: topNode }).parse(content);
    } catch (error) {
        if (error instanceof RangeError) {
            return createErrorResponse(res, 422, "INVALID_REQUEST", error.message);
        }

        const message = error instanceof Error ? error.message : "An unexpected error occurred during parsing";
        return createErrorResponse(res, 500, "INTERNAL_ERROR", message);
    }

    try {
        const lintResult = lint(content, parseTree.cursor());
        const transformedContent = transform(content, topNode ?? "Document", parseTree);

        // Always return a success response with the transformed content
        // If there are lint issues, include them in the response
        const response: SuccessResponse = {
            success: true,
            content: transformedContent
        };

        if (lintResult.length > 0) {
            response.parseErrors = lintResult.map(({ message, from, to }) => ({
                message,
                location: { from, to }
            }));
        }

        return res.status(200).json(response);
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred during transformation";
        return createErrorResponse(res, 500, "INTERNAL_ERROR", message);
    }
}

function xmlToLeiden(
    req: Request,
    res: Response,
    transform: typeof xmlToLeidenPlus | typeof xmlToLeidenTrans,
) {
    const { content } = req.body;
    try {
        const result = transform(content, DOMParser, XMLSerializer);
        return res.status(200).json({
            success: true,
            content: result
        } as SuccessResponse);
    } catch (error) {
        if (error instanceof TransformationError) {
            return createErrorResponse<XMLTransformationErrorDetails>(res, 422, "TRANSFORMATION_ERROR", error.message, {
                path: error.path,
                source: error.source
            });
        } else if (error instanceof ParserError) {
            return createErrorResponse<XMLParseErrorDetails>(res, 422, "XML_PARSE_ERROR", error.message, {
                location: {
                    line: error.line,
                    column: error.column
                }
            });
        }

        const message = error instanceof Error ? error.message : "An unexpected error occurred during transformation";
        return createErrorResponse(res, 500, "INTERNAL_ERROR", message);
    }
}


app.get("/", (_, res) => {
    res.json({
        name: "Leiden Transformation Service API",
        version: "1.0.0",
        documentation: "/api-docs"
    });
});

// Transformation Endpoints

/**
 * @openapi
 * /transform/leiden-plus/to-xml:
 *   post:
 *     summary: Transform Leiden+ notation to XML
 *     tags:
 *       - Transformation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeidenPlusToXmlRequest'
 *           examples:
 *             document:
 *               summary: Full Leiden document
 *               value:
 *                 content: <S= <D.n= <= 1. Example Leiden+ text => =D>
 *             inline:
 *               summary: Inline content
 *               value:
 *                 content: 1. Example Leiden+ text
 *                 topNode: InlineContent
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/ErrorResponse'
 *         description: Invalid request format
 *       422:
 *         $ref: '#/components/responses/ErrorResponse'
 *         description: Unable to parse the input
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 *         description: Server error during transformation
 */
app.post(
    "/transform/leiden-plus/to-xml",
    validateRequest(leidenPlusToXmlRequestSchema),
    (req: Request, res: Response) => {
        return leidenToXml(req, res, leidenPlusParser, leidenPlusToXml, lintLeidenPlus);
    }
);

/**
 * @openapi
 * /transform/xml/to-leiden-plus:
 *   post:
 *     summary: Transform XML to Leiden+ notation
 *     tags:
 *       - Transformation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BaseRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/ErrorResponse'
 *         description: Invalid request format
 *       422:
 *         $ref: '#/components/responses/XMLErrorResponse'
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 *         description: Server error during transformation
 */
app.post(
    "/transform/xml/to-leiden-plus",
    validateRequest(xmlToLeidenRequestSchema),
    (req: Request, res: Response) => {
        return xmlToLeiden(req, res, xmlToLeidenPlus);
    }
);

/**
 * @openapi
 * /transform/leiden-trans/to-xml:
 *   post:
 *     summary: Transform Leiden Trans notation to XML
 *     tags:
 *       - Transformation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeidenTransToXmlRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/ErrorResponse'
 *         description: Invalid request format
 *       422:
 *         $ref: '#/components/responses/ErrorResponse'
 *         description: Unable to parse the input
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 *         description: Server error during transformation
 */
app.post(
    "/transform/leiden-trans/to-xml",
    validateRequest(leidenTransToXmlRequestSchema),
    (req: Request, res: Response) => {
        return leidenToXml(req, res, leidenTransParser, leidenTransToXml, lintLeidenTrans);
    }
);

/**
 * @openapi
 * /transform/xml/to-leiden-trans:
 *   post:
 *     summary: Transform XML to Leiden Trans notation
 *     tags:
 *       - Transformation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BaseRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/ErrorResponse'
 *         description: Invalid request format
 *       422:
 *         $ref: '#/components/responses/XMLErrorResponse'
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 *         description: Server error during transformation
 */
app.post(
    "/transform/xml/to-leiden-trans",
    validateRequest(xmlToLeidenRequestSchema),
    (req: Request, res: Response) => {
        return xmlToLeiden(req, res, xmlToLeidenTrans);
    }
);

/**
 * Start the server on the specified port
 * @param port Port number to listen on
 * @param host Host to bind to (defaults to all interfaces)
 * @returns The HTTP server instance
 */
export function startServer(port = PORT, host = "0.0.0.0") {
    return app.listen(Number(port), host, () => {
        console.log(`Transformation service running on port ${port}`);
        console.log(`API documentation available at http://localhost:${port}/api-docs`);
    });
}

// Support direct execution for npm scripts
if (import.meta.url && process.argv[1] === fileURLToPath(import.meta.url)) {
    startServer();
}

export default app;