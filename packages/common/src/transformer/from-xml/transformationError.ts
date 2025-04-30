export class TransformationError extends Error {

    public tagName: string;
    public source: string;

    constructor(
        message: string,
        public element: Element
    ) {
        super(message);
        this.name = "TransformationError";
        this.tagName = element.tagName;
        this.source = element.outerHTML;
        Object.setPrototypeOf(this, TransformationError.prototype);
    }

    get path(): [name: string, index: number][] {
        const path: [name: string, index: number][] = [];
        let current: Element | null = this.element;

        while (current) {
            const parent: Element | null = current.parentElement;
            // Get index among siblings of same type
            const siblings = parent && Array.from(parent.children).filter(
                child => child.tagName === current!.tagName
            );
            const index = siblings ? siblings.indexOf(current) : 0;
            path.unshift([current.tagName, index]);
            current = parent;
        }

        return path;
    }
}