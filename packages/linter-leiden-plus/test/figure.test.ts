import { expect } from "chai";
import { getLintErrors } from "./utils.js";
import { FIGURE_ERROR_CODES } from "../src/figure";

describe("Figure rules", () => {
    describe("Missing trailing space", () => {
        it("should detect missing trailing space after figure", () => {
            const text = "#seal";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].code).to.equal(FIGURE_ERROR_CODES.MISSING_TRAILING_SPACE);
            expect(errors[0].message).to.include("#seal");
        });



        it("should provide fix action for missing trailing space", () => {
            const text = "#stamp";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].actions).to.have.lengthOf(1);
        });

        it("should handle figure at end of text", () => {
            const text = "some text #image";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].code).to.equal(FIGURE_ERROR_CODES.MISSING_TRAILING_SPACE);
        });
    });
});