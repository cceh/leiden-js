import {CommandTarget, appendContent, deleteRange, insertAt} from "@leiden-plus/lib/language";
import {SyntaxNode} from "@lezer/common";
import {EditorState} from "@codemirror/state";
import {syntaxTree} from "@codemirror/language";

const certLowWrappingNodes = [
    "OrthoRegReg", "OrthoRegOrig", "AlternateReadingLemma", "AlternateReadingReading", "ScribalCorrectionAdd",
    "ScribalCorrectionDel", "SpellingCorrectionCorr", "SpellingCorrectionSic", "EditorialCorrectionLemma",
    "EditorialCorrectionReading", "SuppliedOmitted", "SuppliedParallel", "SuppliedParallelLost",
    "SuppliedLost", "Deletion", "AbbrevUnresolved", "AbbrevInnerEx", "AbbrevInnerSuppliedLost", "Surplus",
    "InsertionAbove", "InsertionBelow", "InsertionMargin", "InsertionMarginSling", "InsertionMarginUnderline",
    "TextSubscript", "NumberSpecial", "NumberSpecialTick", "GapOmitted", "Gap", "OmittedLanguage", "Untranscribed"
]

const certLowAtomicNodes = [
    "Diacritical", "Handshift", "Illegible", "Vestige", "LostLines", "Vacat"
]

const certLowNodes = [...certLowWrappingNodes, ...certLowAtomicNodes]


function addCertLowToWrappingNode(target: CommandTarget, wrappingNode: SyntaxNode): boolean {
    if (wrappingNode.name === "AbbrevInnerEx") {
        return appendContent(target, wrappingNode, "?")
    } else {
        return appendContent(target, wrappingNode, "(?)")
    }
}

function addCertLowToAtomicNode(target: CommandTarget, atomicNode: SyntaxNode): boolean {
    if (atomicNode.name === "Handshift") {
        const handshiftHand = atomicNode.getChild("HandshiftHand")
        if (!handshiftHand) {
            return false
        }
        return appendContent(target, handshiftHand, "(?)")
    } else if (atomicNode.name === "Diacritical") {
        return appendContent(target, atomicNode, "(?)")
    } else if (atomicNode.name === "Vestige") {
        if (atomicNode.getChild("VestigStandalone")) {
            return insertAt(target, atomicNode.to - 1, "(?)")
        }

    }

    return appendContent(target, atomicNode, "(?) ")
}

export function removeCertLow(target: CommandTarget, parentNode: SyntaxNode) {
    const certLow = getCertLow(parentNode)
    if (!certLow) {
        console.error("No certLow node found")
        return false
    }

    let {from, to} = certLow
    const nodeName = parentNode.name;
    if (certLowAtomicNodes.includes(nodeName)) {
        let isStandaloneVestige = parentNode.getChild("VestigStandalone")
        if (nodeName !== "Handshift" && nodeName !== "Diacritical" && !isStandaloneVestige) {
            to = to + 1;
        }
    }

    return deleteRange(target, {from, to})
}

export function findClosestCertLowAncestor(state: EditorState) {
    const tree = syntaxTree(state);
    let current: SyntaxNode | null = tree.resolve(state.selection.ranges[0].from);
    while (current) {
        if (acceptsCertLow(state, current)) {
            break
        }
        current = current.parent
    }

    return current;
}

export function addCertLowAtCursorPosition(target: CommandTarget) {
    const availableAncestor = findClosestCertLowAncestor(target.state);
    if (availableAncestor && hasCertLow(availableAncestor)) {
        addCertLowToWrappingNode(target, availableAncestor)
    }
}

export function addCertLow(target: CommandTarget, node: SyntaxNode) {
    if (certLowWrappingNodes.includes(node.name)) {
        addCertLowToWrappingNode(target, node)
    } else {
        addCertLowToAtomicNode(target, node)
    }
}

export function acceptsCertLow(state: EditorState, node: SyntaxNode) {
    if (node.name === "Diacritical") {
        const symbolNode = node.getChild("DiacriticSymbol")
        if (!symbolNode) {
            return false
        }
        const symbol = state.doc.sliceString(symbolNode.from, symbolNode.to)
        return symbol === "¨";
    }

    return certLowNodes.includes(node.name);
}

export function getCertLow(parentNode: SyntaxNode) {
    return parentNode.name === "AbbrevInnerEx"
        ? parentNode.getChild("AbbrevInnerExContent")?.getChild("QuestionMark")
        : parentNode.getChild("CertLow");
}

export function hasCertLow(parentNode: SyntaxNode) {
    return !!getCertLow(parentNode);
}