import { parser } from "../../parser-leiden-plus/dist/index.js";
import { lintLeidenPlus } from "../dist/index.js";
import { LeidenDiagnostic } from "../../common/dist/linter/index.js";

export function getLintErrors(text: string): LeidenDiagnostic[] {
    const tree = parser.configure({ top: "InlineContent" }).parse(text);
    return lintLeidenPlus(text, tree);
}