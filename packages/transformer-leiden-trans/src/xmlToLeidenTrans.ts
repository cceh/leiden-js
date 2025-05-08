import {
    TransformationError,
    Node,
    Element,
    DocumentFragment,
    DOMParserType, XMLSerializerType, getDOMParser, ParserError, getXMLSerializer
} from "@leiden-js/common/transformer";

function transformElem(elem: Element, output: string[], serializer?: XMLSerializerType) {
    for (let i = 0; i < elem.childNodes.length; i++) {
        transform(elem.childNodes[i], output, serializer);
    }
}

function transform(node: Node | null, output: string[], serializer?: XMLSerializerType) {
    if (!node) {
        return;
    }

    switch (node.nodeType) {
        case node.DOCUMENT_NODE:
        case node.DOCUMENT_FRAGMENT_NODE: {
            // The DocumentFragment interface needs to be updated to have firstElementChild
            const firstChild = (<DocumentFragment>node).childNodes[0];
            transform(firstChild, output, serializer);
            break;
        }
        case node.ELEMENT_NODE: {

            const elem = <Element>node;
            switch (elem.localName) {
                case "body":
                    transformElem(elem, output, serializer);
                    break;

                case "div":{

                    const type = elem.getAttribute("type");
                    switch (type) {
                        case "textpart": {
                            const n = elem.getAttribute("n");
                            const subtype = elem.getAttribute("subtype");

                            output.push("<D=.");
                            if (n) output.push(n);
                            if (subtype) output.push(`.${subtype}`);
                            output.push(" ");

                            transformElem(elem, output, serializer);
                            output.push("=D>");
                            break;
                        }
                        case "translation": {
                            const lang = elem.getAttribute("xml:lang");
                            if (!lang) {
                                throw new TransformationError("div needs a xml:lang attribute", elem);
                            }
                            output.push(`<T=.${lang}`);
                            transformElem(elem, output, serializer);
                            output.push("=T>");
                            break;
                        }
                    }
                    break;
                }
                case "p":
                    if (elem.childNodes.length === 0) {
                        output.push("<==>");
                    } else {
                        output.push("<=");
                        transformElem(elem, output, serializer);
                        output.push("=>");
                    }
                    break;

                case "milestone": {
                    const n = elem.getAttribute("n");
                    const rend = elem.getAttribute("rend");
                    if (rend === "break") {
                        output.push(`(((${n})))`);
                    } else {
                        output.push(`((${n}))`);
                    }
                    break;

                }
                case "del":
                    output.push("〚");
                    transformElem(elem, output, serializer);
                    output.push("〛");
                    break;

                case "gap": {
                    const reason = elem.getAttribute("reason");
                    if (reason === "lost") {
                        output.push("[...]");
                    } else if (reason === "illegible") {
                        output.push("...");
                    } else {
                        throw new TransformationError(`Invalid gap reason: ${reason}`, elem);
                    }
                    break;
                }
                case "note":
                    output.push("/*");
                    transformElem(elem, output, serializer);
                    output.push("*/");
                    break;

                case "term": {
                    output.push("<");
                    transformElem(elem, output, serializer);

                    const lang = elem.getAttribute("xml:lang");
                    if (lang) {
                        output.push(`~${lang}`);
                    }

                    const target = elem.getAttribute("target");
                    if (!target) {
                        throw new TransformationError("term needs a target attribute", elem);
                    }
                    output.push(`=${target}>`);
                    break;
                }
                case "foreign": {
                    output.push("~|");
                    transformElem(elem, output, serializer);
                    const foreignLang = elem.getAttribute("xml:lang");
                    if (!foreignLang) {
                        throw new TransformationError("foreign needs a xml:lang attribute", elem);
                    }
                    output.push(`|~${foreignLang} `);
                    break;

                }
                case "app": {
                    output.push("<:");
                    transformElem(elem, output, serializer);

                    // Handle editor note (type and resp)
                    output.push("|");
                    const appType = elem.getAttribute("type");
                    if (appType) {
                        output.push(appType);
                    }
                    output.push(":");

                    // Get resp from lem element
                    const lems = elem.getElementsByTagName("lem");
                    if (lems.length > 0) {
                        const lem = lems[0];
                        const resp = lem.getAttribute("resp");
                        if (resp) {
                            output.push(resp);
                        }
                    }
                    output.push("|:>");
                    break;
                }
                case "lem":
                    // Content is handled by app element
                    transformElem(elem, output, serializer);
                    break;

                default:
                    throw new TransformationError(`Cannot transform element ${elem.localName} to Leiden Translation`, elem);
            }
            break;
        }
        case node.TEXT_NODE:
            output.push(node.nodeValue || "");
            break;
    }
}

export function xmlToLeidenTrans(xml: Node | string, domParser?: DOMParserType, xmlSerializer?: XMLSerializerType): string {
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
        transform(root, output, xmlSerializer);
        root = root.nextSibling;
    }
    return output.join("");
}