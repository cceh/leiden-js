import { NodeProp } from "@lezer/common";

export const unitProp = new NodeProp({
    deserialize: value => value,
});

export const rendProp = new NodeProp({
    deserialize: value => value,
});