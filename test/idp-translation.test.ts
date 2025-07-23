import { BeforeProcessHook, BeforeXmlCompareHook, processDir, skipWithReason } from "./utils/idp-utils";
import { xmlToLeidenTrans, leidenTransToXml } from "../packages/transformer-leiden-trans/src";

const sourceDir = "test/leiden-js-idp-test-data/roundtrips";
const ignoreReasons = {};

const beforeProcess: BeforeProcessHook = function(textFilePath, textFileContent) {
    if (textFileContent.startsWith("<body")) {
        skipWithReason(this, textFilePath, "starts with <body>, invalid");
    }
};

const beforeCompare: BeforeXmlCompareHook = function(filePath, myXml, _origXml) {
    if (myXml.includes("<gap")) {
        skipWithReason(this, filePath, "includes `<gap>`, does not work in XSugar");
    }
};

const process = (title: string) => {

    processDir(sourceDir, title, leidenTransToXml, xmlToLeidenTrans, ignoreReasons, beforeProcess, beforeCompare);
};

describe("HGV_trans_EpiDoc", function() { process(this.title); });


