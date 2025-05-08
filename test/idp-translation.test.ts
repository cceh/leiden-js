import { BeforeProcessHook, BeforeXmlCompareHook, processDir } from "./utils/idp";
import { xmlToLeidenTrans, leidenTransToXml } from "../packages/transformer-leiden-trans/src";

const sourceDir = "test/leiden-js-idp-test-data/roundtrips";
const ignoreReasons = {};

const beforeProcess: BeforeProcessHook = function(textFilePath, textFileContent) {
    if (textFileContent.startsWith("<body")) {
        console.log(`Ignoring ${textFilePath}, starts with <body>, invalid`);
        this.skip();
    }
};

const beforeCompare: BeforeXmlCompareHook = function(filePath, myXml, _origXml) {
    if (myXml.includes("<gap")) {
        console.log(`Ignoring ${filePath}, includes <gap>, does not work in XSugar`);
        this.skip();
    }
};

const process = (title: string) => {

    processDir(sourceDir, title, leidenTransToXml, xmlToLeidenTrans, ignoreReasons, beforeProcess, beforeCompare);
};

describe("HGV_trans_EpiDoc", function() { process(this.title); });


