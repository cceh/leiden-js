import { styleTags, tags as t } from "@lezer/highlight";
import { NodePropSource } from "@lezer/common";
import { leidenTags as leiden } from "@leiden-js/common/language";

export const leidenTranslationHighlighting: NodePropSource =  styleTags({
    "Translation/Delims": leiden.blockLevel1,
    "Translation/*/LanguageId": [t.emphasis, t.strong, leiden.blockLevel1Attr, leiden.id],
    "Div/Delims": leiden.blockLevel2,
    "Div/N": [leiden.blockLevel2Attr, leiden.id],
    "P/Delims": leiden.blockLevel3,
    "LineNum/...": leiden.milestone,
    "LineNumBreak/...": leiden.milestone,
    "LineNum/Number LineNumBreak/Number": [t.strong, leiden.milestone],
    "Erasure/Delims": leiden.erasure,
    "Erasure/Content!": [leiden.erasure, leiden.erasureContent],
    "Gap/...": leiden.gap,
    "Lost/...": leiden.lost,
    "EditorialComment! Note!": leiden.editorialComment,
    "Term/Delims Term/Content/Text!": leiden.app1,
    "=": leiden.app1Equals,
    "Definition": [t.emphasis, leiden.app1Right],
    "Foreign/ForeignEnd Foreign/~| Foreign/Content/Text!": leiden.foreign,
    "LanguageId Foreign/ForeignEnd/LanguageId": [t.emphasis, leiden.foreignLanguageId],
    "App App/Delims App/Content/Text": leiden.app2,
    "AppType": [t.emphasis, leiden.app2Right],
    "AppResp": [t.emphasis, leiden.app2Left],

    "RequiredSpace": [leiden.requiredSpace]
});