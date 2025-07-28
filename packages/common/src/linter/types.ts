import { Diagnostic, linter } from "@codemirror/lint";

export type CodemirrorLintConfig = Parameters<typeof linter>[1];

export interface LeidenDiagnostic extends Diagnostic {
    code: string;
}