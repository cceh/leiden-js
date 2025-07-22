import { expect } from "chai";
import { getLintErrors } from "./utils.js";
import { CERT_LOW_ERROR_CODES } from "../src/certLow";

describe("CertLow rules", () => {
    describe("Missing trailing space", () => {
        it("should detect missing trailing space after certainty marker in illegible", () => {
            const text = ".3(?)";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].code).to.equal(CERT_LOW_ERROR_CODES.MISSING_TRAILING_SPACE);
            expect(errors[0].message).to.include(".3(?)");
        });


        it("should detect missing trailing space in range pattern", () => {
            const text = ".1-3(?)";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].code).to.equal(CERT_LOW_ERROR_CODES.MISSING_TRAILING_SPACE);
        });

        it("should detect missing trailing space in line patterns", () => {
            const text = ".4lin(?)";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].code).to.equal(CERT_LOW_ERROR_CODES.MISSING_TRAILING_SPACE);
        });

        it("should provide fix action for missing trailing space", () => {
            const text = ".3(?)";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].actions).to.have.lengthOf(1);
            expect(errors[0].actions[0].name).to.equal("Insert space");
        });

        it("should handle complex range patterns with certainty", () => {
            const text = ".2-4lin(?)";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].code).to.equal(CERT_LOW_ERROR_CODES.MISSING_TRAILING_SPACE);
        });

        it("should handle circa patterns with certainty", () => {
            const text = "ca.3(?)";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].code).to.equal(CERT_LOW_ERROR_CODES.MISSING_TRAILING_SPACE);
        });
    });
});