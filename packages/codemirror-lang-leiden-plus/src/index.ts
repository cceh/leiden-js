import {LanguageSupport, LRLanguage, syntaxHighlighting} from "@codemirror/language";
import { Extension } from "@codemirror/state"
import {parser} from "@leiden-plus/parser-leiden-plus";
import {leidenPlusHighlighting} from "./syntaxHighlight.js";
import {leidenPlusLinterExtension} from "@leiden-plus/linter-leiden-plus";
import {highlightActiveNode, leidenHighlightStyle} from "@leiden-plus/lib/language";
import {
    completeFromList, Completion,
    CompletionContext,
    CompletionResult, CompletionSource,
    ifNotIn,
    snippetCompletion
} from "@codemirror/autocomplete";
import {snippets} from "./snippets.js";

// // Helper function to escape regex special characters in a string
// function escapeRegExp(str: string): string {
//     return str.replace(/[.*+?^${}()|[\]\\\-]/g, '\\$&');
// }
//
// // Convert a label with placeholders to a regex pattern
// function labelToRegex(label: string): RegExp {
//     // Replace <num> with \d+ (one or more digits)
//     const regexStr = label.replace(/<num>/g, '\\d+');
//     // Escape other characters to treat them literally
//     return new RegExp(`^${escapeRegExp(regexStr)}$`);
// }
//
// // Generate a regex pattern to match the prefix of the labels
// function prefixMatch(options: readonly Completion[]): [RegExp, RegExp] {
//     let first = Object.create(null), rest = Object.create(null);
//     for (let { label } of options) {
//         // Replace <num> with \d for the first character
//         const firstChar = label.replace(/<num>/g, '\\d')[0];
//         first[firstChar] = true;
//         // Replace <num> with \d for the rest of the characters
//         for (let i = 1; i < label.length; i++) {
//             const char = label.replace(/<num>/g, '\\d')[i];
//             rest[char] = true;
//         }
//     }
//     // Create regex patterns for the first and rest characters
//     const firstSet = Object.keys(first).map(escapeRegExp).join('');
//     const restSet = Object.keys(rest).map(escapeRegExp).join('');
//     const source = `[${firstSet}][${restSet}]*$`;
//     return [new RegExp(`^${source}`), new RegExp(source)];
// }
//
// // Main function to create a completion source
// export function completeFromPatternList(list: readonly (string | Completion)[]): CompletionSource {
//     // Normalize the list into an array of Completion objects
//     const options = list.map(o => typeof o === 'string' ? { label: o } : o) as Completion[];
//
//     // Generate regex patterns for matching
//     const [validFor, match] = prefixMatch(options);
//     console.log(validFor, match)
//
//     return (context: { matchBefore: (regex: RegExp) => any, pos: number, explicit: boolean }) => {
//         // Match the current input against the regex pattern
//         const token = context.matchBefore(match);
//         if (token || context.explicit) {
//             // Filter options based on the input
//             const filteredOptions = options.filter(option => {
//                 const regex = labelToRegex(option.label);
//                 return regex.test(token?.text || '');
//             });
//             return {
//                 from: token ? token.from : context.pos,
//                 options: filteredOptions,
//                 validFor,
//             };
//         }
//         return null;
//     };
// }


export const leidenPlusLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [leidenPlusHighlighting]
    }),
    languageData: {
        autocomplete: (context: CompletionContext) => {
            return completeFromList(
                Object.values(snippets).map(
                    snippetDef =>
                        snippetCompletion(snippetDef.template, snippetDef.completion)
                )
            )(context)
        }
    }
})

export function leidenPlus(): Extension[] {
    return [
        new LanguageSupport(leidenPlusLanguage),
        syntaxHighlighting(leidenHighlightStyle),
        leidenPlusLinterExtension,
        highlightActiveNode
    ]
}

export { snippets } from "./snippets.js"