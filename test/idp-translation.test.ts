import {BeforeProcessHook, processDir, BeforeXmlCompareHook} from "./scripts/idp-test";
import {toXml, fromXml} from "../packages/transformer-leiden-trans/src";

const sourceDir = "test/data/roundtrips";
const ignoreReasons = {}

const beforeProcess: BeforeProcessHook = function(textFilePath, textFileContent) {
    if (textFileContent.startsWith('<body')) {
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

const process = (title: string) =>
    processDir(sourceDir, title, toXml, fromXml, ignoreReasons, beforeProcess, beforeCompare);

describe("HGV_trans_EpiDoc", function() { process(this.title); })


