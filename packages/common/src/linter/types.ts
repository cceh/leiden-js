import { Diagnostic } from "@codemirror/lint";

// Extended CodeMirror Diagnostic interface that includes an error code
// for better error identification in tests
export interface LeidenDiagnostic extends Diagnostic {
    code: string;
}