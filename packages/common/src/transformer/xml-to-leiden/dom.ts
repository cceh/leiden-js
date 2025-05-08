// Minimal DOM interfaces

export interface Node {
    nodeType: number;
    nodeValue: string | null;
    textContent: string | null;
    childNodes: {
        length: number;
        [index: number]: Node;
    } & Iterable<Node>;
    parentElement: Element | null;
    nodeName: string;
    outerHTML?: string;
    firstChild: Node | null;
    nextSibling: Node | null;

    ELEMENT_NODE: number
    TEXT_NODE: number
    DOCUMENT_NODE: number
    DOCUMENT_FRAGMENT_NODE: number
}

export interface Element extends Node {
    localName: string;
    tagName: string;

    getAttribute(name: string): string | null;

    getElementsByTagName(name: string): ArrayLike<Element> & Iterable<Element>;
}

export interface Document extends Node {
    documentElement: Element | null;

    getElementsByTagName(name: string): ArrayLike<Element> & Iterable<Element>;
}

export type DocumentFragment = Node;

export interface XMLSerializerType {
    new(): { serializeToString(node: Node): string }
}

export interface DOMParserType {
    new(): { parseFromString(source: string, mimeType: string): Document }
}

// Helper functions

export function getDOMParser(): DOMParserType | undefined {
    if (typeof globalThis.DOMParser === "function") {
        return globalThis.DOMParser as unknown as DOMParserType;
    }
}

export function getXMLSerializer(): XMLSerializerType | undefined {
    if (typeof globalThis.XMLSerializer === "function") {
        return globalThis.XMLSerializer as unknown as XMLSerializerType;
    }
}

export function getOuterHtml(node: Node, serializer?: XMLSerializerType) {
    if ("outerHTML" in node) {
        return node.outerHTML as string;
    }

    if (!serializer) {
        return "[source not available]";
    }

    return new serializer().serializeToString(node);
}

export function getChildElements(element: Element | Document | DocumentFragment, name?: string) {
    const matches: Element[] = [];
    for (const child of element.childNodes) {
        if (child.nodeType === child.ELEMENT_NODE && (name === undefined || (<Element>child).localName === name)) {
            matches.push(child as Element);
        }
    }
    return matches;
}