import {BeforeProcessHook, processDir, BeforeXmlCompareHook} from "./scripts/idp-test";
import {toXml, fromXml} from "../packages/transformer-leiden-plus/src";

const sourceDir = "test/data/roundtrips/DDB_EpiDoc_XML";
const ignoreReasons = {
    'analpap.28.31_1': "lb attribute order in IDP XML wrong",
    'apf.63.167': "XSugar produces wrong XML: (θ̄(ε)ῷ̄) produces <hi rend=\"supraline\">ῶ</hi>ͅ with accent on the >",
    'apf.68.121': "lb attribute order in IDP XML wrong",
    'bacps.33.38_1': "lb attribute order in IDP XML wrong",
    'bgu.1.14': "lost.ca.6lin: wrong attribute order in IDP XML",
    'bgu.1.68': "Contains Editorial Correction with single Reg but multi-marker ||ed||. IN Xsugar this is handled through round-trip conversion.",
    'bgu.11.2019': "Xsugar produces wrong XML due to supraline character with combining diacrit",
    'bgu.12.2139': "Xsugar produces wrong XML due to supraline character with combining diacrit (lb 11)",
    'bgu.16.2592': "Wrong attribute order in IDP XML, lbs 7 and 10",
    'bgu.2.630': "Wrong attribute order in IDP XML, edition div and several gaps",
    'bgu.5.1210': "lb 170 – ὰ̣̓̀  : three combining characters AND unclear! XSugar produces wrong XML.",
    'bgu.6.1219': "Wrong attribute order in IDP XML, gap in lb 41",
    'bgu.7.1664': "Wrong attribute order in IDP XML, gap in lb 11",
    'bgu.8.1759': "Wrong attribute order in IDP XML, gap in lb 11",
    'bgu.20.2859': "Invalid Leiden from XSugar: there's a underdot on the newline/lf character (lb 8/9)!",
    'c.ep.lat.2': "Outdated / wrong XML in IDP",
    'c.ep.lat.219': "Outdated / wrong XML in IDP",
    'chla.11.505': "Outdated / wrong XML in IDP",
    'chla.41.1203': 'Wrong attribute order in IDP XML',
    'chla.9.383': 'Wrong attribute order in IDP XML: milestones',
    'chr.wilck.134': 'editorial correction inside reg of editorial correction (lb 8, <:πατριδιαθεσιν|ed|<:πατρι διάθεσιν, l. πατρικῇ διαθέσει:>=PN C. Balamoshev:>). Xsugar does not error but produces a SuppliedOmitted with contents wrapped in colons instead.',
    // "apf.58.236": "Illegible inside SuppliedLost, does not really make sense, also probably typo: [.7 ]. What is probably meant is [.7]",
    // "apf.62.110": "Illegible inside SuppliedLost: [.2,]",
    'chr.wilck.228': 'Outdated / wrong XML in IDP',
    'cpr.13.4': 'Wrong attribute order in IDP XML (edition div)',
    'cpr.15.29': 'Wrong attribute order in IDP XML (many instances)',
    'cpr.18.20': 'Outdated / wrong XML in IDP',
    'cpr.4.79': 'Outdated / wrong XML in IDP',
    'cpr.4.87': 'Outdated / wrong XML in IDP',
    'cpr.4.52': "error in XML/Leiden: Editorial correction without infix",
    'o.amst.11': 'Wrong attribute order in IDP XML (edition div, gap in lb 1)',
    'o.berenike.2.178': 'Wrong attribute order in IDP XML (supplied in lb 4)',
    'o.bodl.2.1913': 'Wrong attribute order in IDP XML (gap in lb 1)',
    'o.bodl.2.1918': 'Wrong attribute order in IDP XML (gap in lb 1)',
    'o.bodl.2.426': "Outdated / wrong XML in IDP (lb 7)",
    'o.claud.1.33': "Outdated / wrong XML in IDP (lb 4)",
    'o.deiss.11': 'Wrong attribute order in IDP XML (edition div)',
    'o.deiss.12': 'Wrong attribute order in IDP XML (edition div)',
    'o.did.63': 'Outdated / wrong XML in IDP (lb 8, lb 9)',
    'o.dime.1.86': 'Outdated / wrong XML in IDP (lb 2)',
    'o.dime.1.88': 'Outdated / wrong XML in IDP (lb 2)',
    'o.frange.704': 'Error in IDP: reg in 3. ⲁ̅ⲣⲓ ⲧ<:ἀγάπη=grc|reg|ⲁⲅⲁⲡⲏ||reg||ⲁⲕⲁⲡⲏ:>',
    'o.krok.1.41': 'Wrong XSugar output: renders [--------] as supplied-lost ---- + paragrphos, should be supplied-lost horizontal rule',
    'p.bad.2.42': "error in XML/Leiden: Editorial correction without infix (<:προσωπί̣τ̣ι̣[ο]ν:>)",
    'p.bas.2.43': "Xsugar produces wrong XML due to supraline character with combining diacrit (lb 21)",
    'p.berl.sarisch.19': "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 2, Κ̣̄ύ̣̄ρ̣̄ο̄ῡ)",
    'p.cair.masp.2.67141': "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 14)",
    'p.cair.masp.1.67110': "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 37)",
    'p.cair.masp.1.67006v': "Xsugar cannot parse it, very long and complex document",
    'p.count.1': "error in IDP: Editorial Correction with two '|ed|' infixes (lb 45).",
    'p.count.30': "error in IDP: underdot under dot (lb 85, .̣)",
    'p.flor.3.321': "error in IDP: underdots under dots (lb 32, ο̣ν̣.̣.̣ῦ̣)",
    'p.hamb.3.222': "error in IDP: correction without infix (lb 19, <:περισκάψιν, l. περισκάψειν:>)",
    'p.heid.11.488': "Xsugar produces wrong XML due to supraline character with combining diacrit (lb 1)",
    'p.heid.kopt.21': "In IDP XML, there is a add above nested inside add above. XSugar converts this to one add below (// xyz \\\\), and back to XML as one add below. So probably outdated XML and what is meant is one add below.",
    'p.herm.landl.I': "Wrong attribute order in IDB XML (gaps in lb 51, lb 476)",
    'p.koeln.14.579a': "XSugar breaks a supraline sequence after the greek one half sign (𐅵). This is probably a bug in XSugar.",
    'p.kru.92': "error in IDP: correction without infix (lb 46)",
    'p.lips.1.27': "error in IDP: Editorial Correction with two '|ed|' infixes (lb 27)",
    'p.lips.1.57r': "error in IDP: Editorial Correction with two '|ed|' infixes (lb 28)",
    'p.lond.2.480': "error in IDP: Editorial Correction with two '|ed|' infixes (lb 9)",
    'p.lond.5.1692b': "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 5, Ἑ̣̄)",
    'p.mich.13.659': "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 296, ῳ̣̣̣̄)",
    'p.michael.45': "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 19)",
    'p.mon.apollo.1.24': "In IDP XML (lb 10), there is a add above nested inside add above. XSugar converts this to one add below (// xyz \\\\), and back to XML as one add below. So probably outdated XML and what is meant is one add below.",
    'p.muench.1.11': "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 3)",
    'p.oxy.3.475': "error in IDP: Editorial Correction with two '|ed|' infixes (lb 20)",
    'p.panop.31': "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 4, lb 9)",
    'p.pintaudi.32': "error in IDP: correction without infix (lb 15)",
    'p.rain.unterricht.112': "error in IDP: correction without infix (lb 38, lb 39)",
    'p.select.16': "error in IDP: Editorial Correction with two '|ed|' infixes (lb 16)",
    'p.vat.aphrod.1': "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 35)",
    'sb.26.16570': "error in IDP: correction without infix (lb 66)",
    'sb.26.16813': "Xsugar error: milestone ---- inside add right note recognized (lb 22, lb 26)",
    'sb.28.17044': "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 15)",
    'stud.pal.3(2).1.63': "error in IDP: macron on line feed character",
    'stud.pal.22.55r': "error in IDP: Editorial Correction with two '|ed|' infixes (lb 1)",
    'o.waqfa.76': "XSugar produces incorrect Leiden: the ε͂ <hi rend=\"supraline\">χε͂</hi> is rendered as χ̄ε̄͂̄͂ (the χ̄ gets the perispomeni and the ε gets three macrons)",
    'p.koeln.17.654': "Xsugar roundtrip produces incorrect XML (<add place=\"above\"><add place=\"above\">) instead of <add place=\"below\">)",
    'p.louvre.3.239': "XSugar produces incorrect XML for δ̣̄ύ̣̄ο̣̄ (splits up underline unclear sequence)",
}

const beforeProcess: BeforeProcessHook = function(textFilePath, textFileContent) {
    if (textFileContent.startsWith('<div')) {
        console.log(`Ignoring ${textFilePath}, starts with <div>, invalid`);
        this.skip();
    } else if (textFileContent.includes("ῷ̄")) {
        console.log(`Ignoring ${textFilePath}, reason: Contains ῷ̄ (small omega + perispomeni + macron/supraline + ypogegrammeni for which XSugar produces invalid output`);
        this.skip();
    } else if (textFileContent.includes("\n\u0323")) {
        console.log(`Ignoring ${textFilePath}, reason: underdot on newline character`);
        this.skip();
    }
};

const beforeCompare: BeforeXmlCompareHook = function(textFilePath, _myXml, origXml) {
    if (origXml.includes("break=\"no\" rend=\"indent\"")) {
        console.log(`Ignoring ${textFilePath}, reason: lb attribute order in IDP XML wrong`)
        this.skip();
    } else if (/>\p{Mark}+/u.test(origXml)) {
        console.log(`Ignoring ${textFilePath} (xml->leiden), reason: contains combing mark on non-word character (XSugar problem with diacritics)`)
        this.skip();
    }

}


const process = (title: string) =>
    processDir(sourceDir, title, toXml, fromXml, ignoreReasons, beforeProcess, beforeCompare);

describe("aegyptus", function() { process(this.title); })
describe("analpap", function() { process(this.title); })
describe("ancsoc", function() { process(this.title); })
describe("apf", function() { process(this.title); })
describe("bacps", function() { process(this.title); })

