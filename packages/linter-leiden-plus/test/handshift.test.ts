import * as chai from "chai";
import { HANDSHIFT_ERROR_CODES } from "../src/handshift.js";
import { getLintErrors } from "./utils.js";

describe("Handshift rules", () => {
    describe("Missing trailing space", () => {
        it("should detect missing trailing space after handshift", () => {
            const text = "$m1abc";
            const errors = getLintErrors(text);
            
            chai.expect(errors).to.have.lengthOf(1);
            chai.expect(errors[0].code).to.equal(HANDSHIFT_ERROR_CODES.MISSING_TRAILING_SPACE);
            chai.expect(errors[0].message).to.include("$m1");
        });

        it("should detect missing trailing space with complex trailing content", () => {
            const text = "$m2<abc>";
            const errors = getLintErrors(text);
            
            chai.expect(errors).to.have.lengthOf(1);
            chai.expect(errors[0].code).to.equal(HANDSHIFT_ERROR_CODES.MISSING_TRAILING_SPACE);
        });

        it("should provide fix action for missing trailing space", () => {
            const text = "$m1abc";
            const errors = getLintErrors(text);
            
            chai.expect(errors[0].code).to.equal(HANDSHIFT_ERROR_CODES.MISSING_TRAILING_SPACE);
            chai.expect(errors[0].actions).to.have.lengthOf(1);
            chai.expect(errors[0].actions?.[0]?.name).to.equal("Insert space");
        });
    });
});