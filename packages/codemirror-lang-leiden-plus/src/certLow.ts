import {CommandTarget, insertBeforeEndBracket, deleteRange} from "@leiden-plus/lib/language";
import {SyntaxNode} from "@lezer/common";

const certLowNodes = [
    "OrthoRegReg", "OrthoRegOrig", "AlternateReadingLemma", "AlternateReadingReading", "ScribalCorrectionAdd",
    "ScribalCorrectionDel", "SpellingCorrectionCorr", "SpellingCorrectionSic", "EditorialCorrectionLemma",
    "EditorialCorrectionReading", "SuppliedOmitted", "GapOmitted", "SuppliedParallel", "SuppliedParallelLost",
    "SuppliedLost", "Gap", "Deletion", "AbbrevUnresolved", "AbbrevInnerEx", "AbbrevInnerSuppliedLost", "Surplus",
    "InsertionAbove", "InsertionBelow", "InsertionMargin", "InsertionMarginSling", "InsertionMarginUnderline",
    "TextSubscript", "NumberSpecial", "NumberSpecialTick", "Diacritical", "Handshift", "OmittedLanguage",
    "Untranscribed", "Illegible", "Vestige", "LostLines", "Vacat"
]

const addCertLowToWrappingNode = (target: CommandTarget, wrappingNode: SyntaxNode): boolean => {
    if (wrappingNode.name === "AbbrevInnerEx") {
        return insertBeforeEndBracket(target, wrappingNode, "?")
    } else {
        return insertBeforeEndBracket(target, wrappingNode, "(?)")
    }
}

export const removeCertLow = (target: CommandTarget, parentNode: SyntaxNode) => {
    const certLow = getCertLow(parentNode)
    if (!certLow) {
        console.error("No certLow node found")
        return false
    }

    return deleteRange(target, certLow)
}

export const acceptsCertLow = (node: SyntaxNode) => certLowNodes.includes(node.name)

export const getCertLow = (parentNode: SyntaxNode) => parentNode.name === "AbbrevInnerEx"
    ? parentNode.getChild("AbbrevInnerExContent")?.getChild("QuestionMark")
    : parentNode.getChild("CertLow")

export const hasCertLow = (parentNode: SyntaxNode) => !!getCertLow(parentNode)