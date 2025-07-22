import * as chai from "chai";
import { FOREIGN_ERROR_CODES } from "../src/foreign.js";
import { getLintErrors } from "./utils.js";

describe("Foreign rules", () => {
    describe("Missing language ID", () => {
        it("should detect missing language ID after |~", () => {
            const text = "~|foreign text|~";
            const errors = getLintErrors(text);
            
            chai.expect(errors).to.have.lengthOf(1);
            chai.expect(errors[0].code).to.equal(FOREIGN_ERROR_CODES.MISSING_LANGUAGE_ID);
        });

        it("should detect missing language ID after |~ with trailing space", () => {
            const text = "~|foreign text|~ ";
            const errors = getLintErrors(text);

            chai.expect(errors).to.have.lengthOf(1);
            chai.expect(errors[0].code).to.equal(FOREIGN_ERROR_CODES.MISSING_LANGUAGE_ID);
        });

        it("should detect missing language ID after |~ with trailing content", () => {
            const text = "~|foreign text|~ <bla>";
            const errors = getLintErrors(text);

            chai.expect(errors).to.have.lengthOf(1);
            chai.expect(errors[0].code).to.equal(FOREIGN_ERROR_CODES.MISSING_LANGUAGE_ID);
        });
    });

    describe("Missing trailing space", () => {
        it("should detect missing trailing space after language ID", () => {
            const text = "~|foreign text|~la";
            const errors = getLintErrors(text);

            chai.expect(errors).to.have.lengthOf(1);
            chai.expect(errors[0].code).to.equal(FOREIGN_ERROR_CODES.MISSING_TRAILING_SPACE);
        });

        it("should detect missing trailing space after language ID with trailing content", () => {
            const text = "~|foreign text|~grc<bla>";
            const errors = getLintErrors(text);

            chai.expect(errors).to.have.lengthOf(1);
            chai.expect(errors[0].code).to.equal(FOREIGN_ERROR_CODES.MISSING_TRAILING_SPACE);
        });
    });
});