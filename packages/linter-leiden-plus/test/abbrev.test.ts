import { expect } from "chai";
import { getLintErrors } from "./utils.js";
import { ABBREV_ERROR_CODES } from "../src/abbrev.js";

describe("Abbrev rules", () => {
    describe("Incomplete abbreviations", () => {
        it("should detect incomplete abbreviation with no inner elements", () => {
            const text = "(test)";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].code).to.equal(ABBREV_ERROR_CODES.INCOMPLETE);
        });

        it("should detect incomplete abbreviation with just text", () => {
            const text = "(simple text content)";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].code).to.equal(ABBREV_ERROR_CODES.INCOMPLETE);
        });

        it("should detect incomplete abbreviation with whitespace only", () => {
            const text = "(   )";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].code).to.equal(ABBREV_ERROR_CODES.INCOMPLETE);
        });
    });

    describe("Invalid supplied lost", () => {
        it("should detect invalid complex content in simple supplied lost", () => {
            const text = "(prefix[text<nested>content])";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].code).to.equal(ABBREV_ERROR_CODES.INVALID_SUPPLIED_LOST);
        });

        it("should detect invalid illegible characters in supplied lost", () => {
            const text = "(test[content.5more])";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].code).to.equal(ABBREV_ERROR_CODES.INVALID_SUPPLIED_LOST);
        });

        it("should detect invalid nested supplied elements", () => {
            const text = "(word[text[nested]content])";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].code).to.equal(ABBREV_ERROR_CODES.INVALID_SUPPLIED_LOST);
        });

        it("should focus error on the supplied lost element", () => {
            const text = "(abc[problematic<content>])";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(text.slice(errors[0].from, errors[0].to)).to.include("[problematic<content>]");
        });
    });

    describe("Invalid supplied parallel", () => {
        it("should detect invalid supplied parallel without inner expansion", () => {
            const text = "(text|_simple_|more)";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].code).to.equal(ABBREV_ERROR_CODES.INVALID_SUPPLIED_PARALLEL);
        });

        it("should detect supplied parallel missing required inner expansion", () => {
            const text = "(start|_middle[complex]_|end)";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].code).to.equal(ABBREV_ERROR_CODES.INVALID_SUPPLIED_PARALLEL);
        });

        it("should focus error on the supplied parallel element", () => {
            const text = "(prefix|_invalid_|suffix)";
            const errors = getLintErrors(text);
            expect(errors).to.have.lengthOf(1);
            expect(text.slice(errors[0].from, errors[0].to)).to.include("|_invalid_|");
        });
    });
});