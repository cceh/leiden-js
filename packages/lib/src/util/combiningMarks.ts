export function processCombiningMarks(text: string, add: boolean = true, ...combiningCharacters: number[]) {
    const output = []
    for (let i = 0; i < text.length; i++) {
        const codepoint = text.codePointAt(i);

        if (codepoint) {
            const char = String.fromCodePoint(codepoint);
            output.push(char);

            // Handle surrogate pairs
            if (codepoint >= 0x10000) {
                i++;
            }

            while (i + 1 < text.length) {
                const nextCodepoint = text.codePointAt(i + 1);
                if (!nextCodepoint || !/\p{M}/u.test(String.fromCodePoint(nextCodepoint))) {
                    break;
                }
                i++;
                if (!combiningCharacters.includes(nextCodepoint)) {
                    output.push(String.fromCodePoint(nextCodepoint));
                }
            }

            if (add) {
                output.push(...combiningCharacters.map(c => String.fromCodePoint(c)));
            }
        }
    }

    return output.join("");
}

export function addCombiningMarks(text: string, ...combiningCharacters: number[]) {
    return processCombiningMarks(text, true, ...combiningCharacters);
}

export function removeCombiningMarks(text: string, ...combiningCharacters: number[]) {
    return processCombiningMarks(text, false, ...combiningCharacters);
}