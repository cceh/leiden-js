import { DOMParserType, getDOMParser, getXMLSerializer, XMLSerializerType, Node } from "./dom.js";
import { ParserError } from "./errors.js";

export function xmlToLeiden(
    xml: Node | string,
    domParser: DOMParserType | undefined,
    xmlSerializer: XMLSerializerType | undefined,
    transformFn: (node: Node, output: string[], xmlSerializer?: XMLSerializerType) => void
): string {
    let root: Node | null = null;
    if (typeof xml === "string") {
        domParser = domParser ?? getDOMParser();

        if (domParser) {
            const document = new domParser().parseFromString(`<WRAP>${xml}</WRAP>`, "text/xml");
            const parserError = document.getElementsByTagName("parsererror")[0];
            if (parserError) {
                const errorText = parserError.textContent ?? "";
                const line = errorText.match(/line (\d+)/)?.[1];
                let column = errorText.match(/(?:column|character) (\d+)/)?.[1];

                // If error is on line 1, adjust column for the <WRAP> tag
                if (line && line === "1" && column) {
                    const colNum = parseInt(column) - 6; // Subtract length of "<WRAP>"
                    column = colNum > 0 ? colNum.toString() : "1";
                }

                throw new ParserError(
                    errorText.replace(/<\/?WRAP>/g, ""),
                    line ? parseInt(line) : undefined,
                    column ? parseInt(column) : undefined
                );
            }

            root = document.documentElement!.firstChild!;
        } else {
            throw new Error("A DOMParser must be provided when root is a string and no global DOMParser is available (such as in a browser environment).");
        }
    } else {
        root = xml;
    }

    xmlSerializer = xmlSerializer ?? getXMLSerializer();
    if (!xmlSerializer) {
        console.warn("No XMLSerializer provided. Parse errors will not include source strings.");
    }


    const output: string[] = [];
    while (root) {
        transformFn(root, output, xmlSerializer);
        root = root.nextSibling;
    }
    return output.join("");
}