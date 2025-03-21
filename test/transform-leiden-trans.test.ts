import * as chai from 'chai';
import chaiXml from "chai-xml";
import {JSDOM} from 'jsdom';
import {toXml} from "../packages/transformer-leiden-trans/src/toXml.js";
import {fromXml} from "../packages/transformer-leiden-trans/src/fromXml.js";

chai.use(chaiXml);

const dom = new JSDOM(`<root xml:space="preserve"/>`, {
    contentType: 'text/xml',
    url: 'http://localhost'
});

global.Element = dom.window.Element;
global.Node = dom.window.Node;


function testTransform(name, leiden, xml, topNode = "InlineContent") {
    it("Leiden → XML: " + (name ?? leiden), () => {
        const resultXml = toXml(leiden, topNode);
        const wrappedXml = `<root>${resultXml}</root>`;
        const wrappedResultXml = `<root>${xml.replace(" xmlns:xml=\"http://www.w3.org/XML/1998/namespace\"", "")}</root>`;
        chai.expect(wrappedXml).to.equal(wrappedResultXml, `\n${leiden}\n`);
    });

    it("XML → Leiden: " + (name ?? xml), () => {
        dom.window.document.documentElement.innerHTML = xml;
        const resultLeiden = [...dom.window.document.documentElement.childNodes].map(child => fromXml(child)).join("");
        chai.expect(resultLeiden.normalize()).to.equal(leiden);
    });
}



describe('Translation', () => {
    testTransform("Empty document", '<T=.en<==>=T>', '<body xmlns:xml="http://www.w3.org/XML/1998/namespace"><div xml:lang="en" type="translation" xml:space="preserve"><p/></div></body>', "Document")
    testTransform("Empty document, whitespace", '<T=.en \n<=    \n=> \n =T>', "<body xmlns:xml=\"http://www.w3.org/XML/1998/namespace\"><div xml:lang=\"en\" type=\"translation\" xml:space=\"preserve\"> \n<p>    \n</p> \n </div></body>", "Document")
    testTransform("Empty document, whitespace, content", "<T=.en \n<=    \n  some content\n=> \n =T>", "<body xmlns:xml=\"http://www.w3.org/XML/1998/namespace\"><div xml:lang=\"en\" type=\"translation\" xml:space=\"preserve\"> \n<p>    \n  some content\n</p> \n </div></body>", "Document")
});

describe('Div', () => {
    testTransform("Div with text", '<T=.en<D=.r <=text=>=D>=T>', '<body xmlns:xml="http://www.w3.org/XML/1998/namespace"><div xml:lang="en" type="translation" xml:space="preserve"><div n="r" type="textpart"><p>text</p></div></div></body>', "Document")
    testTransform("Div with text, whitespace", '<T=.en  <D=.r  \n <=\n  text\n more    text =>  \n  =D> \n =T>', '<body xmlns:xml="http://www.w3.org/XML/1998/namespace"><div xml:lang="en" type="translation" xml:space="preserve">  <div n="r" type="textpart"> \n <p>\n  text\n more    text </p>  \n  </div> \n </div></body>', "Document")
})

describe('Translation Structure', () => {
    testTransform("One Div", "<D=.r <= => =D>", "<div n=\"r\" type=\"textpart\"><p> </p> </div>", "BlockContent")
    testTransform("Two Divs", "<D=.r <= => =D>\n           <D=.r <= => =D>", "<div n=\"r\" type=\"textpart\"><p> </p> </div>\n           <div n=\"r\" type=\"textpart\"><p> </p> </div>", "BlockContent")
    testTransform("Two Ps", "<= =>\n           <= =>", "<p> </p>\n           <p> </p>", "BlockContent")

    // These cases are not supported by the XSugar translation grammar but since the structures are supported by the
    // Leiden+ Grammar and also found in the wild, they need to be supported by the translation grammar too
    testTransform("One P and two Divs", "<= =>\n<D=.r <= => =D>\n<D=.r <= => =D>", "<p> </p>\n<div n=\"r\" type=\"textpart\"><p> </p> </div>\n<div n=\"r\" type=\"textpart\"><p> </p> </div>", "BlockContent")
    testTransform("Two Ps and two Divs", "<= =>\n<= =>\n<D=.r <= => =D>\n<D=.r <= => =D>", "<p> </p>\n<p> </p>\n<div n=\"r\" type=\"textpart\"><p> </p> </div>\n<div n=\"r\" type=\"textpart\"><p> </p> </div>", "BlockContent")
})

// Gap is in the XSugar grammar but it doesn't work??
// describe('Gap', () => {
//     testTransform("Gap, lost", '[...]', '<gap reason="lost" extent="unknown" unit="character"/>')
//     testTransform("Gap, lost", 'text before[...]text after', 'text before<gap reason="lost" extent="unknown" unit="character"/>text after')
//     testTransform("Gap, lost, unicode ellipsis", '[…]', '<gap reason="lost" extent="unknown" unit="character"/>')
//     testTransform("Gap, lost, unicode ellipsis", 'text before[…]text after', 'text before<gap reason="lost" extent="unknown" unit="character"/>text after')
//     testTransform("Gap, illegible", '...', '<gap reason="illegible" extent="unknown" unit="character"/>')
//     testTransform("Gap, illegible", 'text before...text after', 'text before<gap reason="illegible" extent="unknown" unit="character"/>text after')
//     testTransform("Gap, illegible, unicode ellipsis", '…', '<gap reason="illegible" extent="unknown" unit="character"/>')
//     testTransform("Gap, illegible, unicode ellipsis", 'text before…text after', 'text before<gap reason="illegible" extent="unknown" unit="character"/>text after')
//
// })

describe('Line numbering', () => {
    testTransform("Milestone line", "((11))", '<milestone unit="line" n="11"/>');
    testTransform("Milestone line, break", "(((33)))", '<milestone unit="line" n="33" rend="break"/>');
})

describe('Note', () => {
    testTransform("Note", '/*Top right sideways*/', '<note>Top right sideways</note>');
    testTransform("Note with newlines", "/*Top\n right \nsideways\n  */", "<note>Top\n right \nsideways\n  </note>");
})

describe('Term', () => {
    testTransform("Term", '<unwatered land=abrochos>', '<term target="abrochos">unwatered land</term>');
    testTransform("Term with language, la", '<vir egregius~la=hokratistos>', '<term target="hokratistos" xml:lang="la">vir egregius</term>');
    testTransform("Term with language, grc-Latn, ", '<epistrategos~grc-Latn=epistrategos>', `<term target="epistrategos" xml:lang="grc-Latn">epistrategos</term>`);
})

describe('App', () => {
    testTransform("App, resp", '<:some text|:editor note|:>', '<app><lem resp="editor note">some text</lem></app>')
    testTransform("App, no resp", '<:some text|:|:>', '<app><lem>some text</lem></app>')
    testTransform("App, type BGU, resp", '<:some text|BGU:editor note|:>', '<app type="BGU"><lem resp="editor note">some text</lem></app>')
    testTransform("App, type BGU, no resp", '<:some text|BGU:|:>', '<app type="BGU"><lem>some text</lem></app>')
    testTransform("App, type BG_DDbDP, resp", '<:some text|BGU_DDbDP:editor note|:>', '<app type="BGU_DDbDP"><lem resp="editor note">some text</lem></app>')
    testTransform("App, type BG_DDbDP, no resp", '<:some text|BGU_DDbDP:|:>', '<app type="BGU_DDbDP"><lem>some text</lem></app>')
})

describe('Foreign', () => {
    testTransform("Foreign, latin", '~|text|~la ', '<foreign xml:lang="la">text</foreign>');
    testTransform("Foreign, latin, with newlines", "~|text more\n  text|~la ", "<foreign xml:lang=\"la\">text more\n  text</foreign>");
    testTransform("Foreign, greek with latin script", '~|text|~grc-Latn ', '<foreign xml:lang="grc-Latn">text</foreign>');
})

describe('Complex content', () => {
    testTransform("App with Foreign inside", "<:text ~|foreign phrase|~la more text|:editor note|:>", "<app><lem resp=\"editor note\">text <foreign xml:lang=\"la\">foreign phrase</foreign>more text</lem></app>")

    // AI generated :) below tests might not necessarily make sense semantically.
    testTransform("Nested foreign phrases with different languages",
        "~|outer text ~|inner text|~la more outer text|~grc-Latn ",
        "<foreign xml:lang=\"grc-Latn\">outer text <foreign xml:lang=\"la\">inner text</foreign>more outer text</foreign>");

    testTransform("Term inside foreign with matching language",
        "~|some <legal term~la=ius civile> here|~la ",
        "<foreign xml:lang=\"la\">some <term target=\"ius civile\" xml:lang=\"la\">legal term</term> here</foreign>");

    testTransform("Foreign phrase inside term definition",
        "<~|dictatorem|~la =dictator>",
        "<term target=\"dictator\"><foreign xml:lang=\"la\">dictatorem</foreign></term>")

    testTransform("Complex app with multiple foreign phrases and line number",
        "<:before ((1)) ~|Latin text|~la after break (((2))) ~|Greek text|~grc-Latn end|:editor note|:>",
        "<app><lem resp=\"editor note\">before <milestone unit=\"line\" n=\"1\"/> <foreign xml:lang=\"la\">Latin text</foreign>after break <milestone unit=\"line\" n=\"2\" rend=\"break\"/> <foreign xml:lang=\"grc-Latn\">Greek text</foreign>end</lem></app>")

    testTransform("Term with nested foreign and editorial note",
        "<complex ~|latin term|~la /*with editor's note*/ <:more|:editorial comment|:>=target>",
        "<term target=\"target\">complex <foreign xml:lang=\"la\">latin term</foreign><note>with editor's note</note> <app><lem resp=\"editorial comment\">more</lem></app></term>")

    testTransform("Multiple nested apps with foreign content",
        "<:outer <:inner ~|nested|~la |:|:> content|BGU:editor note|:>",
        "<app type=\"BGU\"><lem resp=\"editor note\">outer <app><lem>inner <foreign xml:lang=\"la\">nested</foreign></lem></app> content</lem></app>")

    testTransform("Foreign with nested term and line breaks",
        "~|start <legal term~la=ius> ((1)) middle <another~la=lex> end|~la ",
        "<foreign xml:lang=\"la\">start <term target=\"ius\" xml:lang=\"la\">legal term</term> <milestone unit=\"line\" n=\"1\"/> middle <term target=\"lex\" xml:lang=\"la\">another</term> end</foreign>")

    testTransform("Complex editorial situation with multiple apps",
        "<=<:first reading|:first editor|:> /*editorial comment*/ <:second reading|BGU:second editor|:>=>",
        "<p><app><lem resp=\"first editor\">first reading</lem></app> <note>editorial comment</note> <app type=\"BGU\"><lem resp=\"second editor\">second reading</lem></app></p>",
        "SingleP")

    testTransform("Heavily annotated foreign phrase",
        "~|start ((1)) <term one~la=first> middle /*note*/ <term two~la=second> (((2))) end|~la ",
        "<foreign xml:lang=\"la\">start <milestone unit=\"line\" n=\"1\"/> <term target=\"first\" xml:lang=\"la\">term one</term> middle <note>note</note> <term target=\"second\" xml:lang=\"la\">term two</term> <milestone unit=\"line\" n=\"2\" rend=\"break\"/> end</foreign>")
})

