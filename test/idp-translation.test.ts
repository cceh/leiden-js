import { BeforeProcessHook, BeforeXmlCompareHook, processDir } from "./utils/idp";
import { fromXml, toXml } from "../packages/transformer-leiden-trans/src";
import { JSDOM } from "jsdom";

const sourceDir = "test/data/roundtrips";
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

const dom = new JSDOM("<root/>", {
    contentType: "text/xml",
    url: "http://localhost"
});

const process = (title: string) =>
    processDir(sourceDir, title, toXml, fromXml, ignoreReasons, beforeProcess, beforeCompare, dom);

describe("HGV_trans_EpiDoc", function() { process(this.title); });


