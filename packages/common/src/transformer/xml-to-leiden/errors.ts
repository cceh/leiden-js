import { Element } from "./dom.js";
import { XMLSerializerType, getOuterHtml } from "./dom.js";

export class ParserError extends Error {
    constructor(message: string, public line?: number, public column?: number) {
        super(message);
        this.name = "ParserError";
        Object.setPrototypeOf(this, ParserError.prototype);
    }
}

export class TransformationError extends Error {

    public tagName: string;
    public source: string;

    constructor(
        message: string,
        public element: Element,
        serializer?: XMLSerializerType
    ) {
        super(message);
        this.name = "TransformationError";
        this.tagName = element.tagName;
        this.source = getOuterHtml(element, serializer);
        Object.setPrototypeOf(this, TransformationError.prototype);
    }

    get path(): [name: string, index: number][] {
        const path: [name: string, index: number][] = [];
        let current: Element | null | undefined = this.element;

        while (current) {
            if (current.tagName === "WRAP") {
                break;
            }
            const parent: Element | null | undefined  = current.parentElement;
            // Get index among siblings of same type
            const siblings = parent && Array.from(parent.childNodes)
                .filter(child => "tagName" in child)
                .filter(child => child.tagName === current!.tagName);
            const index = siblings ? siblings.indexOf(current) : 0;
            path.unshift([current.tagName, index]);
            current = parent;
        }

        return path;
    }
}