import { SyntaxNode } from "@lezer/common";
import { findDescendant, LeidenDiagnostic } from "@leiden-js/common/linter";

// Error codes for Abbreviation linting
export const ABBREV_ERROR_CODES = {
    INVALID_SUPPLIED_LOST: "ABBREV_INVALID_SUPPLIED_LOST",
    INVALID_SUPPLIED_PARALLEL: "ABBREV_INVALID_SUPPLIED_PARALLEL", 
    INCOMPLETE: "ABBREV_INCOMPLETE"
} as const;

export function lintAbbrev(node: SyntaxNode): LeidenDiagnostic[] | undefined {
    // Only report error if the Abbreviation has been closed
    if (node.node.lastChild?.type.name !== ")") return;

    const inner = node.node.getChild("AbbrevInner");
    if (!inner) {
        const suppliedLost = findDescendant(node, "SuppliedLost");

        if (suppliedLost) {
            return [{
                from: suppliedLost.from,
                to: suppliedLost.to,
                severity: "error",
                message: "A single supplied (lost) inside an abbreviation can only have pure character content inside the square brackets, e.g.: (a[bc]), or needs an inner expansion such as (ā[ε̄(f)]d).",
                code: ABBREV_ERROR_CODES.INVALID_SUPPLIED_LOST
            }];
        }

        const suppliedParallel = findDescendant(node, "SuppliedParallel");
        if (suppliedParallel) {
            return [{
                from: suppliedParallel.from,
                to: suppliedParallel.to,
                severity: "error",
                message: "A single supplied (parallel) inside an abbreviation needs an inner expansion, e.g.: (exp|_an(si)_|on).",
                code: ABBREV_ERROR_CODES.INVALID_SUPPLIED_PARALLEL
            }];
        }

        return [{
            from: node.from,
            to: node.to,
            severity: "error",
            message: `Incomplete abbreviation. 
Abbreviation needs at least one 
- inner expansion: (exp(ansi)on)
- supplied (lost): (exp[ansi]on) or (exp[an(si)]on)
- supplied (parallel): (exp|_an(si)_|on)`,
            code: ABBREV_ERROR_CODES.INCOMPLETE
        }];

    }
}