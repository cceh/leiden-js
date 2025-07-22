import * as chai from "chai";
import { NUMBER_SPECIAL_ERROR_CODES } from "../src/numberSpecial.js";
import { getLintErrors } from "./utils.js";

describe("NumberSpecial rules", () => {
    describe("Missing space before tick", () => {
        it("should detect missing space before tick in number special", () => {
            const text = "<#ιβ'=1/12#>";
            const errors = getLintErrors(text);
            
            chai.expect(errors).to.have.lengthOf(1);
            chai.expect(errors[0].code).to.equal(NUMBER_SPECIAL_ERROR_CODES.MISSING_SPACE_BEFORE_TICK);
            chai.expect(errors[0].message).to.include("<#ιβ'=1/12#>");
        });

        it("should not report error when space exists before tick", () => {
            const text = "<#ιβ '=1/12#>";
            const errors = getLintErrors(text);

            chai.expect(errors).to.have.lengthOf(0);
        });

        it("should provide fix action for missing space", () => {
            const text = "<#α'=1#>";
            const errors = getLintErrors(text);
            
            chai.expect(errors[0].code).to.equal(NUMBER_SPECIAL_ERROR_CODES.MISSING_SPACE_BEFORE_TICK);
            chai.expect(errors[0].actions).to.have.lengthOf(1);
            chai.expect(errors[0].actions?.[0]?.name).to.equal("Insert space");
        });

        it("should handle tick at beginning of number special", () => {
            const text = "<#'=3#>";
            const errors = getLintErrors(text);
            
            chai.expect(errors).to.have.lengthOf(1);
            chai.expect(errors[0].code).to.equal(NUMBER_SPECIAL_ERROR_CODES.MISSING_SPACE_BEFORE_TICK);
        });

        it("should handle tick number special without symbol", () => {
            const text = "<# '=3#>";
            const errors = getLintErrors(text);
            
            chai.expect(errors).to.have.lengthOf(0);
        });
    });

    describe("Missing equals sign", () => {
        it("should detect missing equals sign in number special", () => {
            const text = "<#α123#>";
            const errors = getLintErrors(text);
            chai.expect(errors).to.have.lengthOf(1);
            chai.expect(errors[0].code).to.equal(NUMBER_SPECIAL_ERROR_CODES.MISSING_EQUALS);
        });

        it("should not report error when equals exists", () => {
            const text = "<#α=123#>";
            const errors = getLintErrors(text);
            
            chai.expect(errors).to.have.lengthOf(0);
        });

    });

    describe("Invalid number value", () => {
        it("should detect non-numeric value after equals", () => {
            const text = "<#α=abc#>";
            const errors = getLintErrors(text);

            chai.expect(errors).to.have.lengthOf(1);
            chai.expect(errors[0].code).to.equal(NUMBER_SPECIAL_ERROR_CODES.INVALID_VALUE);
        });
    });
});