import {ExternalTokenizer} from "@lezer/lr";
import {
    chars as lp_chars,
    latinChars,
    multiUnclear,
    num,
    single_char,
    single_latinChar,
    single_num,
    singleUnclear,
    SupralineMacronContent,
    SupralineUnclear,
} from "./parser.terms.js";

const COMBINING_GRAVE_ACCENT = 0x0300, COMBINING_ACUTE_ACCENT = 0x0301,
    COMBINING_DIAERESIS = 0x0308, COMBINING_COMMA_ABOVE = 0x0313,
    COMBINING_REVERSED_COMMA_ABOVE = 0x0314, COMBINING_GRAVE_TONE = 0x0340,
    COMBINING_ACUTE_TONE = 0x0341, COMBINING_GREEK_PERISPOMENI = 0x0342,
    COMBINING_GREEK_KORONIS = 0x0343, COMBINING_GREEK_DIALYTIKA_TONOS = 0x0344,
    COMBINING_GREEK_YPOGEGRAMMENI = 0x0345, COMBINING_MACRON = 0x0304,
    COMBINING_DOT_BELOW = 0x0323;

const SPACE = 32, COMMA = 44, APOSTROPHE = 39, FULL_STOP = 46,
    LINE_FEED = 10, LEFT_PARENTHESIS = 40, RIGHT_PARENTHESIS = 41,
    LESS_THAN_SIGN = 60, GREATER_THAN_SIGN = 62, VERTICAL_LINE = 124,
    QUESTION_MARK = 63, EQUALS_SIGN = 61, LEFT_SQUARE_BRACKET = 91,
    RIGHT_SQUARE_BRACKET = 93, REVERSE_SOLIDUS = 92, SLASH = 47,
    COLON = 58, NUMBER_SIGN = 35, LOW_LINE = 95, TILDE = 126,
    CIRCUMFLEX_ACCENT = 94, MACRON = 175, LEFT_CURLY_BRACKET = 123,
    RIGHT_CURLY_BRACKET = 125, ASTERISK = 42, DOLLAR_SIGN = 36,
    QUOTATION_MARK = 34, HYPHEN_MINUS = 45, COMMERCIAL_AT = 64,
    AMPERSAND = 38, EXCLAMATION_MARK = 33, DIGIT_ZERO = 48, DIGIT_NINE = 57,
    LEFT_WHITE_WHITE_BRACKET = 0x301a,  RIGHT_WHITE_WHITE_BRACKET = 0x301b;

const END_OF_INPUT = -1;

// https://github.com/papyri/xsugar/blob/96f79e62ce4d62e223faab8fe8ba8989de1aa4bc/epidoc.xsg#L28C19-L28C85
const combiningMarks = [
    COMBINING_GRAVE_ACCENT, COMBINING_ACUTE_ACCENT, COMBINING_DIAERESIS,
    COMBINING_COMMA_ABOVE, COMBINING_REVERSED_COMMA_ABOVE, COMBINING_GRAVE_TONE,
    COMBINING_ACUTE_TONE, COMBINING_GREEK_PERISPOMENI, COMBINING_GREEK_KORONIS,
    COMBINING_GREEK_DIALYTIKA_TONOS, COMBINING_GREEK_YPOGEGRAMMENI, COMBINING_MACRON,
    COMBINING_DOT_BELOW
];

const skippedForCombiningCheck = [
    LINE_FEED, LEFT_PARENTHESIS, RIGHT_PARENTHESIS, LESS_THAN_SIGN,
    GREATER_THAN_SIGN, VERTICAL_LINE, QUESTION_MARK, EQUALS_SIGN,
    LEFT_SQUARE_BRACKET, RIGHT_SQUARE_BRACKET,
    LEFT_WHITE_WHITE_BRACKET, RIGHT_WHITE_WHITE_BRACKET,
    REVERSE_SOLIDUS, SLASH, COLON, NUMBER_SIGN, LOW_LINE, TILDE,
    CIRCUMFLEX_ACCENT, MACRON, LEFT_CURLY_BRACKET, RIGHT_CURLY_BRACKET,
    ASTERISK, DOLLAR_SIGN, QUOTATION_MARK, HYPHEN_MINUS, COMMERCIAL_AT,
    AMPERSAND, EXCLAMATION_MARK, COMBINING_MACRON, COMBINING_DOT_BELOW
];

const skipped = [...skippedForCombiningCheck, SPACE, COMMA, APOSTROPHE, FULL_STOP];


function isNumberCharCode(current) {
    return current >= DIGIT_ZERO && current <= DIGIT_NINE;
}

function lookAhead(input, string) {
    let i;
    for (i = 0; i < string.length; i++) {
        const inputCharCode = i === 0 ? input.next : input.peek(i);
        if (inputCharCode === -1 || inputCharCode !== string.charCodeAt(i)) {
            return false;
        }
    }

    // no match if the following character is a combining mark
    return !combiningMarks.includes(input.peek(i));
}

export const charsToken = new ExternalTokenizer((input) => {
    let isNumSequence = false;
    let length = 0;
    for(;;) {
        if (input.next === END_OF_INPUT) {
            break;
        }

        const current = input.next;
        if (skipped.indexOf(current) > -1) {
            break;
        }


        if (
            lookAhead(input, "ca.") ||
            lookAhead(input, "vac.") ||
            lookAhead(input, "lin") ||
            lookAhead(input, "char") ||
            lookAhead(input, "frac") ||
            lookAhead(input, "lost.") ||
            lookAhead(input, "vestig ") ||
            lookAhead(input, "vestig.") ||
            lookAhead(input, "vestig(")
        ) {
            break;
        }

        // check if the character has an underdot or macron in its combining diacritics
        // if yes, the current character belongs to an unclear or supraline segment
        const { marks, numSkipped } = checkCombiningMarks(input);
        if (marks.indexOf(COMBINING_DOT_BELOW) > -1 || marks.indexOf(COMBINING_MACRON) > -1) {
            break;
        }
        const nextPos = numSkipped;
        const nextChar = input.peek(nextPos);


        if (isNumberCharCode(current)) { // Check if current is a number (ASCII 48-57)
            isNumSequence = true;

            // huge ugly workaround for input found in cpr.7.54, should probably be removed (illegible num chars followed by line break)
            // e.g. .126.-  (XSugar consumes the 6.- as word-wrapping line break preceded by illegible 12 chars)
            let next = nextChar;
            let pos = 1;
            let isLbNoWrap = false;
            let hasSeenNonNumber = false;
            while (next !== END_OF_INPUT) {
                let isNumber = isNumberCharCode(next);
                if (/\/,a-zA-Z./.test(String.fromCharCode(next)) && (!isNumber || hasSeenNonNumber) && ![SPACE, APOSTROPHE].includes(next) || [COMMA, SLASH, FULL_STOP].includes(next)) {
                    if (!isNumber && !hasSeenNonNumber) {
                        hasSeenNonNumber = true;
                    }
                    if (next === FULL_STOP) {
                        if (input.peek(pos + 1) === HYPHEN_MINUS && input.peek(pos + 2) === SPACE) {
                            isLbNoWrap = true;
                            break;
                        }
                    }
                } else {
                    break;
                }

                pos++;
                next = input.peek(pos);
            }

            if (isLbNoWrap) {
                break;
            }
        }

        length++;
        input.advance(nextPos);

        if (isNumSequence && !isNumberCharCode(nextChar)) { // Check if nextChar is not a number
            break;
        }

        if (!isNumSequence && isNumberCharCode(nextChar)) {
            break;
        }

    }
    
    if (length > 0) {
        input.acceptToken(isNumSequence ? num : lp_chars);
    }
});

// Check for combining marks without consuming input
function checkCombiningMarks(input) {
    let pos = isHighSurrogate(input.next) ? 2 : 1;
    let peek = input.peek(pos);
    const marks = [];

    while (combiningMarks.includes(peek)) {
        marks.push(peek);
        peek = input.peek(++pos);
    }

    return { marks, numSkipped: pos };
}

function scanCombiningMarks(input, validateMarks) {
    let charCount = 0;

    for (;;) {
        if (input.next < 0 || skippedForCombiningCheck.indexOf(input.next) > -1) {
            break;
        }

        const { marks, numSkipped } = checkCombiningMarks(input);

        if (validateMarks(marks)) {
            charCount++;
            input.advance(numSkipped);
        } else {
            break;
        }
    }

    return charCount;
}

// Refactored tokenizers using the helper functions
export const unclearToken = new ExternalTokenizer(input => {
    const charCount = scanCombiningMarks(input, (marks) =>
        marks.indexOf(COMBINING_DOT_BELOW) > -1 && marks.indexOf(COMBINING_MACRON) === -1
    );

    if (charCount === 1) {
        input.acceptToken(singleUnclear);
    } else if (charCount > 1) {
        input.acceptToken(multiUnclear);
    }
});

export const supralineToken = new ExternalTokenizer(input => {
    const charCount = scanCombiningMarks(input, (marks) =>
        marks.indexOf(COMBINING_MACRON) > -1 && marks.indexOf(COMBINING_DOT_BELOW) === -1
    );

    if (charCount > 0) {
        input.acceptToken(SupralineMacronContent);
    }
});

export const supralineUnclearToken = new ExternalTokenizer(input => {
    const charCount = scanCombiningMarks(input, (marks) =>
        marks.indexOf(COMBINING_DOT_BELOW) > -1 && marks.indexOf(COMBINING_MACRON) > -1
    );

    if (charCount > 0) {
        input.acceptToken(SupralineUnclear);
    }
});


export function specializeChars(input) {
    if (input.length === 1) {
        return /[a-zA-Z]+/.test(input) ? single_latinChar : single_char;
   } else if (input.length > 1) {
        let isSingleCharWithDiacrit = true;
       for (let i = 1; i < input.length; i++) {           if (!combiningMarks.includes(input.charCodeAt(i))) {
               isSingleCharWithDiacrit = false;
               break;
           }
       }
        if (isSingleCharWithDiacrit) {
            return single_char;
        }
   }

   if (/[a-zA-Z]+/.test(input)) {
       return latinChars;
   }

   return -1;
}

export function specializeNum(input) {
    if (input.length === 1) {
        return single_num;
    }

    return -1;
}

function isHighSurrogate(code) {
    return code >= 0xD800 && code <= 0xDBFF;
}