import * as chai from 'chai';
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { JSDOM } from "jsdom";

interface IgnoreReasons {
    [key: string]: string;
}

// Types for the hook functions that can skip tests
export type BeforeProcessHook = (this: Mocha.Context, textFilePath: string, textFileContent: string) => void;
export type BeforeXmlCompareHook = (this: Mocha.Context, textFilePath: string, myXml: string, origXml: string) => void;

function getTextFiles(dir: string): string[] {
    const textPaths: string[] = [];

    function traverse(currentDir: string): void {
        try {
            const entries = readdirSync(currentDir, { withFileTypes: true });

            for (const entry of entries) {
                const path = join(currentDir, entry.name);

                if (entry.isDirectory()) {
                    traverse(path);
                } else if (entry.isFile() && entry.name.endsWith('.txt')) {
                    textPaths.push(path);
                }
            }
        } catch (error) {
            console.error(`Error traversing directory ${currentDir}:`, error);
            throw error;
        }
    }

    traverse(dir);
    return textPaths;
}

export function processDir(
    sourceDir: string,
    dir: string,
    toXml: (text: string) => string,
    fromXml: (xml: Element) => string,
    ignoreReasons: IgnoreReasons,
    beforeProcess: BeforeProcessHook,
    beforeXmlCompare: BeforeXmlCompareHook
): void {
    const ignore = Object.keys(ignoreReasons);
    const path = join(sourceDir, dir);

    console.log(`Processing ${path}`);

    const textFiles = getTextFiles(path);

    textFiles.forEach(textFile => {
        it(textFile, function () {
            const fileName = textFile.split('/').pop() || '';
            const basename = fileName.substring(0, fileName.lastIndexOf('.'));

            // Check ignore list first
            if (ignore.includes(basename)) {
                console.log(`Ignoring ${textFile}, reason:\n${ignoreReasons[basename]}`);
                this.skip();
                return;
            }

            // Read file content once
            const textContent = readFileSync(textFile, 'utf-8');

            // Run the content hook
            beforeProcess.call(this, textFile, textContent);

            if (this.pending === false) {
                console.log(this)
            }

            // If the test wasn't skipped, continue processing
            const xmlFilePath = textFile.replace('.txt', '.roundtrip.xml');
            const origXml = readFileSync(xmlFilePath, 'utf-8')
                .replace(` xmlns:xml="http://www.w3.org/XML/1998/namespace"`, "");
            const myXml = toXml(textContent);

            const myXmlNorm = myXml.normalize();
            const origXmlNorm = origXml.normalize();

            // Run the XML hook
            beforeXmlCompare.call(this, textFile, myXml, origXml);

            chai.expect(myXmlNorm).to.equal(origXmlNorm, `\n${textContent}\n`);

            const dom = new JSDOM(origXmlNorm, {
                contentType: 'text/xml',
                url: 'http://localhost'
            });

            global.Element = dom.window.Element;
            global.Node = dom.window.Node;

            const myLeiden = fromXml(dom.window.document.documentElement);

            chai.expect(myLeiden.normalize()).to.equal(textContent.normalize());
        });
    });
}
