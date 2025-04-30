import { NodeIterator, SyntaxNode } from "@lezer/common";
import { EditorState } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { applySnippet, CommandTarget } from "@leiden-js/common/language";
import { snippets } from "./snippets.js";
import { insertNewlineKeepIndent } from "@codemirror/commands";

export const atomicRules = [
    "LanguageId", "N", "SubType", "LineNum", "LineNumBreak", "Gap", "Definition", "AppType"
];

export const wrappingRules: string[] = [
    "P", "Div", "Erasure", "Note", "Term", "Foreign", "App"
];

export function inlineContentAllowed(state: EditorState) {
    const tree = syntaxTree(state);
    let iter: NodeIterator | null = tree.resolveStack(state.selection.ranges[0].from);
    if (iter.node.type.is("Delims")) {
        return false;
    }

    while (iter) {
        if (atomicRules.some(name => iter?.node.type.name === name)) {
            return false;
        }
        iter = iter.next;
    }

    return true;
}

export type TranslationSnippetKey = Extract<keyof typeof snippets, "translation" | "translationEnglish" | "translationGerman" | "translationWithLanguage">;

export function addTranslation(target: CommandTarget, snippetKey: TranslationSnippetKey) {
    const tree = syntaxTree(target.state);
    const translationNodes = tree.topNode.getChildren("Translation");
    let insertPos = 0;
    if (translationNodes.length > 0) {
        insertPos = translationNodes[translationNodes.length - 1].to;
    }
    target.dispatch({ selection: { anchor: insertPos, head: insertPos } });
    // TODO: don't insert newline when on first line and first line only contains whitespace
    insertNewlineKeepIndent(target);
    applySnippet(target, snippets[snippetKey]);
}


export type DivisionSnippetKey = Extract<keyof typeof snippets, "divisionRecto" | "divisionVerso" | "divisionColumn" | "divisionFragment" | "divisionOtherType" | "division">;

function findAncestorNode(state: EditorState, ancestorName: string): SyntaxNode | null {
    let iter: NodeIterator | null = syntaxTree(state).resolveStack(state.selection.main.head);
    while (iter && iter.node.type.name !== ancestorName) {
        iter = iter.next;
    }

    return iter?.node ?? null;
}

export function canAddDivision(state: EditorState): boolean {
    const ancestorTranslation = findAncestorNode(state, "Translation");
    if (!ancestorTranslation) {
        return false;
    }
    
    const directParagraphChildren = ancestorTranslation?.getChildren("P");
    return directParagraphChildren?.length === 0;
}

export function addDivision(target: CommandTarget, snippetKey: DivisionSnippetKey) {
    const translationNode = findAncestorNode(target.state, "Translation");
    if (!translationNode) {
        console.log("Cannot add division outside of Translation block");
        return;
    }
    
    const pNodes = translationNode.getChildren("P");
    if (pNodes.length > 0) {
        console.log("Cannot add division to Translation block with direct Paragraph children");
    }

    const divisionNodes = translationNode.getChildren("Div");
    const insertPos = divisionNodes.length > 0
        ? divisionNodes[divisionNodes.length - 1].to
        : translationNode.lastChild!.from;

    target.dispatch({ selection: { anchor: insertPos, head: insertPos } });
    insertNewlineKeepIndent(target);
    applySnippet(target, snippets[snippetKey]);
}

