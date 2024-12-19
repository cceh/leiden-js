import {styleTags, tags as t} from "@lezer/highlight";
import {NodePropSource} from "@lezer/common";

export const leidenTranslationHighlighting: NodePropSource =  styleTags({
    "Div": t.string,
    "P": t.meta,
    "LineNum/... LineNumBreak/... ": [t.string],
    "LineNum/Number LineNumBreak/Number": [t.strong],
    "Deletion! Deletion/Content/Inline/Text!": t.regexp,
    "Gap": t.comment,
    "EditorialComment! Note!": t.annotation,
    "Term/...": t.number,
    "Foreign/ForeignEnd Foreign/~| Foreign/Content/Inline/Text!": t.attributeValue,
    "LanguageId Foreign/ForeignEnd/LanguageId": [t.emphasis, t.bool],
    "App/... App/Content/Inline!": t.definition(t.propertyName),
    "AppType": [t.emphasis, t.annotation],
    "AppResp": [t.emphasis],
    "Definition!": [t.emphasis],
})