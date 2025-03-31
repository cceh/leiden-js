import { TransformationError } from "@leiden-plus/lib/transformer";

function transformElem(elem: Element, output: string[]) {
    for (let i = 0; i < elem.childNodes.length; i++) {
        transform(elem.childNodes[i], output);
    }
}

function transform(node: Node|null, output: string[]) {
    if (!node) {
        return;
    }

    switch (node.nodeType) {
        case Node.DOCUMENT_NODE:
        case Node.DOCUMENT_FRAGMENT_NODE:
            transform((<DocumentFragment>node).firstElementChild, output);
            break;
        case Node.ELEMENT_NODE: {

            const elem = <Element>node;
            switch (elem.localName) {
                case "body":
                    transformElem(elem, output);
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

                            transformElem(elem, output);
                            output.push("=D>");
                            break;
                        }
                        case "translation": {
                            const lang = elem.getAttribute("xml:lang");
                            if (!lang) {
                                throw new TransformationError("div needs a xml:lang attribute", elem);
                            }
                            output.push(`<T=.${lang}`);
                            transformElem(elem, output);
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
                        transformElem(elem, output);
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
                    transformElem(elem, output);
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
                    transformElem(elem, output);
                    output.push("*/");
                    break;

                case "term": {
                    output.push("<");
                    transformElem(elem, output);

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
                    transformElem(elem, output);
                    const foreignLang = elem.getAttribute("xml:lang");
                    if (!foreignLang) {
                        throw new TransformationError("foreign needs a xml:lang attribute", elem);
                    }
                    output.push(`|~${foreignLang} `);
                    break;

                }
                case "app": {
                    output.push("<:");
                    transformElem(elem, output);

                    // Handle editor note (type and resp)
                    output.push("|");
                    const appType = elem.getAttribute("type");
                    if (appType) {
                        output.push(appType);
                    }
                    output.push(":");

                    // Get resp from lem element
                    const lem = elem.querySelector("lem");
                    if (lem) {
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
                    transformElem(elem, output);
                    break;

                default:
                    throw new TransformationError(`Cannot transform element ${elem.localName} to Leiden Translation`, elem);
            }
            break;
        }
        case Node.TEXT_NODE:
            output.push(node.nodeValue || "");
            break;
    }
}

export function fromXml(root: Node): string {
    const output: string[] = [];
    transform(root, output);
    return output.join("");
}