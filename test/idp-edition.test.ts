import { BeforeProcessHook, BeforeXmlCompareHook, processDir, skipWithReason } from "./utils/idp-utils";
import { xmlToLeidenPlus, leidenPlusToXml } from "../packages/transformer-leiden-plus/src";

const sourceDir = "test/leiden-js-idp-test-data/roundtrips/DDB_EpiDoc_XML";
const ignoreReasons = {
    "analpap.28.31_1": "lb attribute order in IDP XML wrong",
    "apf.63.167": "XSugar produces wrong XML: `(θ̄(ε)ῷ̄)` produces `<hi rend=\"supraline\">ῶ</hi>`ͅ with accent on the `>`",
    "apf.68.121": "`lb` attribute order in IDP XML wrong",
    "bacps.33.38_1": "`lb` attribute order in IDP XML wrong",
    "bgu.1.14": "`lost.ca.6lin`: wrong attribute order in IDP XML",
    "bgu.1.68": "Contains Editorial Correction with single Reg but multi-marker `||ed||`. IN Xsugar this is handled through round-trip conversion.",
    "bgu.11.2019": "Xsugar produces wrong XML due to supraline character with combining diacrit",
    "bgu.12.2139": "Xsugar produces wrong XML due to supraline character with combining diacrit (lb 11)",
    "bgu.16.2592": "Wrong attribute order in IDP XML, lbs 7 and 10",
    "bgu.2.630": "Wrong attribute order in IDP XML, edition div and several gaps",
    "bgu.5.1210": "lb 170 – `ὰ̣̓̀ `: three combining characters AND unclear! XSugar produces wrong XML.",
    "bgu.6.1219": "Wrong attribute order in IDP XML, gap in `lb` 41",
    "bgu.7.1664": "Wrong attribute order in IDP XML, gap in `lb` 11",
    "bgu.8.1759": "Wrong attribute order in IDP XML, gap in `lb` 11",
    "bgu.20.2859": "Invalid Leiden from XSugar: there's a underdot on the newline/lf character (`lb` 8/9)!",
    "c.ep.lat.2": "Outdated / wrong XML in IDP",
    "c.ep.lat.219": "Outdated / wrong XML in IDP",
    "chla.11.505": "Outdated / wrong XML in IDP",
    "chla.41.1203": "Wrong attribute order in IDP XML",
    "chla.9.383": "Wrong attribute order in IDP XML: milestones",
    "chr.wilck.134": "editorial correction inside reg of editorial correction (`lb` 8, `<:πατριδιαθεσιν|ed|<:πατρι διάθεσιν, l. πατρικῇ διαθέσει:>=PN C. Balamoshev:>`). Xsugar does not error but produces a SuppliedOmitted with contents wrapped in colons instead.",
    // "apf.58.236": "Illegible inside SuppliedLost, does not really make sense, also probably typo: [.7 ]. What is probably meant is [.7]",
    // "apf.62.110": "Illegible inside SuppliedLost: [.2,]",
    "chr.wilck.228": "Outdated / wrong XML in IDP",
    "cpr.13.4": "Wrong attribute order in IDP XML (edition `div`)",
    "cpr.15.29": "Wrong attribute order in IDP XML (many instances)",
    "cpr.18.20": "Outdated / wrong XML in IDP",
    "cpr.4.79": "Outdated / wrong XML in IDP",
    "cpr.4.87": "Outdated / wrong XML in IDP",
    "cpr.4.52": "error in XML/Leiden: Editorial correction without infix",
    "o.amst.11": "Wrong attribute order in IDP XML (edition `div`, `gap` in `lb` 1)",
    "o.berenike.2.178": "Wrong attribute order in IDP XML (supplied in lb 4)",
    "o.bodl.2.1913": "Wrong attribute order in IDP XML (gap in lb 1)",
    "o.bodl.2.1918": "Wrong attribute order in IDP XML (gap in lb 1)",
    "o.bodl.2.426": "Outdated / wrong XML in IDP (lb 7)",
    "o.claud.1.33": "Outdated / wrong XML in IDP (lb 4)",
    "o.deiss.11": "Wrong attribute order in IDP XML (edition `div`)",
    "o.deiss.12": "Wrong attribute order in IDP XML (edition `div`)",
    "o.did.63": "Outdated / wrong XML in IDP (lb 8, lb 9)",
    "o.dime.1.86": "Outdated / wrong XML in IDP (lb 2)",
    "o.dime.1.88": "Outdated / wrong XML in IDP (lb 2)",
    "o.frange.704": "Error in IDP: reg in `3. ⲁ̅ⲣⲓ ⲧ<:ἀγάπη=grc|reg|ⲁⲅⲁⲡⲏ||reg||ⲁⲕⲁⲡⲏ:>`",
    "o.krok.1.41": "Wrong XSugar output: renders `[--------]` as supplied-lost `----` + paragrphos, should be supplied-lost horizontal rule",
    "p.bad.2.42": "error in XML/Leiden: Editorial correction without infix (`<:προσωπί̣τ̣ι̣[ο]ν:>`)",
    "p.bas.2.43": "Xsugar produces wrong XML due to supraline character with combining diacrit (lb 21)",
    "p.berl.sarisch.19": "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 2, `Κ̣̄ύ̣̄ρ̣̄ο̄ῡ`)",
    "p.cair.masp.2.67141": "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 14)",
    "p.cair.masp.1.67110": "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 37)",
    "p.cair.masp.1.67006v": "Xsugar cannot parse it, very long and complex document",
    "p.count.1": "error in IDP: Editorial Correction with two `|ed|` infixes (lb 45).",
    "p.count.30": "error in IDP: underdot under dot (lb 85, `.̣`)",
    "p.flor.3.321": "error in IDP: underdots under dots (lb 32, `ο̣ν̣.̣.̣ῦ̣`)",
    "p.hamb.3.222": "error in IDP: correction without infix (lb 19, `<:περισκάψιν, l. περισκάψειν:>`)",
    "p.heid.11.488": "Xsugar produces wrong XML due to supraline character with combining diacrit (lb 1)",
    "p.heid.kopt.21": "In IDP XML, there is a add above nested inside add above. XSugar converts this to one add below (`// xyz \\\\`), and back to XML as one add below. So probably outdated XML and what is meant is one add below.",
    "p.herm.landl.I": "Wrong attribute order in IDB XML (gaps in lb 51, lb 476)",
    "p.koeln.14.579a": "XSugar breaks a supraline sequence after the greek one half sign (`𐅵`). This is probably a bug in XSugar.",
    "p.kru.92": "error in IDP: correction without infix (lb 46)",
    "p.lips.1.27": "error in IDP: Editorial Correction with two `|ed|` infixes (lb 27)",
    "p.lips.1.57r": "error in IDP: Editorial Correction with two `|ed|` infixes (lb 28)",
    "p.lond.2.480": "error in IDP: Editorial Correction with two `|ed|` infixes (lb 9)",
    "p.lond.5.1692b": "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 5, Ἑ̣̄)",
    "p.mich.13.659": "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 296, ῳ̣̣̣̄)",
    "p.michael.45": "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 19)",
    "p.mon.apollo.1.24": "In IDP XML (lb 10), there is a add above nested inside add above. XSugar converts this to one add below (`// xyz \\\\`), and back to XML as one add below. So probably outdated XML and what is meant is one add below.",
    "p.muench.1.11": "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 3)",
    "p.oxy.3.475": "error in IDP: Editorial Correction with two `|ed|` infixes (lb 20)",
    "p.panop.31": "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 4, lb 9)",
    "p.pintaudi.32": "error in IDP: correction without infix (lb 15)",
    "p.rain.unterricht.112": "error in IDP: correction without infix (lb 38, lb 39)",
    "p.select.16": "error in IDP: Editorial Correction with two `|ed|` infixes (lb 16)",
    "p.vat.aphrod.1": "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 35)",
    "sb.26.16570": "error in IDP: correction without infix (lb 66)",
    "sb.26.16813": "Xsugar error: milestone `----` inside add right note recognized (lb 22, lb 26)",
    "sb.28.17044": "Xsugar produces wrong XML due to supraline character with combining diacrits (lb 15)",
    "stud.pal.3(2).1.63": "error in IDP: macron on line feed character",
    "stud.pal.22.55r": "error in IDP: Editorial Correction with two `|ed|` infixes (lb 1)",
    "o.waqfa.76": "XSugar produces incorrect Leiden: the `ε͂` in `<hi rend=\"supraline\">χε͂</hi>` is rendered as `χ̄ε̄͂̄͂` (the χ̄ gets the perispomeni and the ε gets three macrons)",
    "p.koeln.17.654": "Xsugar roundtrip produces incorrect XML (`<add place=\"above\"><add place=\"above\">`) instead of `<add place=\"below\">`)",
    "p.louvre.3.239": "XSugar produces incorrect XML for `δ̣̄ύ̣̄ο̣̄` (splits up underline unclear sequence)",
};

const beforeProcess: BeforeProcessHook = function(textFilePath, textFileContent) {
    if (textFileContent.startsWith("<div")) {
        skipWithReason(this, textFilePath, "starts with `<div>`, invalid");
    } else if (textFileContent.includes("ῷ̄")) {
        skipWithReason(this, textFilePath, "contains `ῷ̄` (small omega + perispomeni + macron/supraline + ypogegrammeni for which XSugar produces invalid output");
    } else if (textFileContent.includes("\n\u0323")) {
        skipWithReason(this, textFilePath, "underdot on newline character");
    }
};

const beforeCompare: BeforeXmlCompareHook = function(textFilePath, _myXml, origXml) {
    if (origXml.includes("break=\"no\" rend=\"indent\"")) {
        skipWithReason(this, textFilePath, "(xml->leiden) `lb` attribute order in IDP XML wrong");
    } else if (/>\p{Mark}+/u.test(origXml)) {
        skipWithReason(this, textFilePath, "(xml->leiden) contains combing mark on non-word character (XSugar problem with diacritics)");
    } else if (/\u2028/.test(origXml)) {
        skipWithReason(this, textFilePath, "(xml->leiden) contains line separator character (XSugar problem with line separator)");
    }

};


const process = (title: string) =>
    processDir(sourceDir, title, leidenPlusToXml, xmlToLeidenPlus, ignoreReasons, beforeProcess, beforeCompare);


describe("aegyptus", function() { process(this.title); });
describe("analpap", function() { process(this.title); });
describe("ancsoc", function() { process(this.title); });
describe("apf", function() { process(this.title); });
describe("arctos", function() { process(this.title); });
describe("bacps", function() { process(this.title); });
describe("basp", function() { process(this.title); });
describe("bgu", function() { process(this.title); });
describe("bifao", function() { process(this.title); });
describe("c.ep.lat", function() { process(this.title); });
describe("c.etiq.mom", function() { process(this.title); });
describe("c.illum.pap", function() { process(this.title); });
describe("c.jud.syr.eg", function() { process(this.title); });
describe("c.pap.gr", function() { process(this.title); });
describe("c.pap.jud", function() { process(this.title); });
describe("c.pap.lat", function() { process(this.title); });
describe("cde", function() { process(this.title); });
describe("chiron", function() { process(this.title); });
describe("chla", function() { process(this.title); });
describe("chr.mitt", function() { process(this.title); });
describe("chr.wilck", function() { process(this.title); });
// describe("cpl", function() { process(this.title); }); (removed in current idp.data)
describe("cpr", function() { process(this.title); });
describe("crai", function() { process(this.title); });
describe("ddbdp", function() { process(this.title); });
describe("gr.med.pap", function() { process(this.title); });
describe("grbs", function() { process(this.title); });
describe("iej", function() { process(this.title); });
describe("iwnw", function() { process(this.title); });
describe("jcoptstud", function() { process(this.title); });
describe("jjp", function() { process(this.title); });
describe("jra", function() { process(this.title); });
describe("jra.suppl", function() { process(this.title); });
describe("jur.pap", function() { process(this.title); });
describe("mper", function() { process(this.title); });
describe("mper.ns", function() { process(this.title); });
describe("o.abu.mina", function() { process(this.title); });
describe("o.amst", function() { process(this.title); });
describe("o.ashm", function() { process(this.title); });
describe("o.ashm.shelt", function() { process(this.title); });
describe("o.bankes", function() { process(this.title); });
describe("o.bawit.fribourg", function() { process(this.title); });
describe("o.bawit.ifao", function() { process(this.title); });
describe("o.berenike", function() { process(this.title); });
describe("o.berl", function() { process(this.title); });
describe("o.bir.shawish", function() { process(this.title); });
describe("o.blemmyes", function() { process(this.title); });
describe("o.bodl", function() { process(this.title); });
describe("o.brux", function() { process(this.title); });
describe("o.bu.njem", function() { process(this.title); });
describe("o.buch", function() { process(this.title); });
describe("o.cair", function() { process(this.title); });
describe("o.camb", function() { process(this.title); });

describe("o.claud", function() { process(this.title); });
describe("o.cret.chers", function() { process(this.title); });
describe("o.deiss", function() { process(this.title); });
describe("o.did", function() { process(this.title); });
describe("o.dime", function() { process(this.title); });
describe("o.douch", function() { process(this.title); });
describe("o.edfou", function() { process(this.title); });
describe("o.elkab", function() { process(this.title); });
describe("o.erem", function() { process(this.title); });
describe("o.fay", function() { process(this.title); });
describe("o.florida", function() { process(this.title); });
describe("o.frange", function() { process(this.title); });
describe("o.heid", function() { process(this.title); });
describe("o.joach", function() { process(this.title); });
describe("o.kell", function() { process(this.title); });
describe("o.krok", function() { process(this.title); });
describe("o.leid", function() { process(this.title); });
describe("o.lund", function() { process(this.title); });
describe("o.masada", function() { process(this.title); });
describe("o.medin.madi", function() { process(this.title); });
describe("o.mich", function() { process(this.title); });
describe("o.minor", function() { process(this.title); });
describe("o.narm", function() { process(this.title); });
describe("o.nyu", function() { process(this.title); });
describe("o.oasis", function() { process(this.title); });
describe("o.ont.mus", function() { process(this.title); });
describe("o.oslo", function() { process(this.title); });
describe("o.paris", function() { process(this.title); });
describe("o.petr", function() { process(this.title); });
describe("o.petr.mus", function() { process(this.title); });
describe("o.sarga", function() { process(this.title); });
describe("o.stras", function() { process(this.title); });
describe("o.tebt", function() { process(this.title); });
describe("o.tebt.pad", function() { process(this.title); });
describe("o.theb", function() { process(this.title); });
describe("o.theb.taxes", function() { process(this.title); });
describe("o.trim", function() { process(this.title); });
describe("o.vleem", function() { process(this.title); });
describe("o.wadi.hamm", function() { process(this.title); });
describe("o.waqfa", function() { process(this.title); });
describe("o.wilb", function() { process(this.title); });
describe("o.wilck", function() { process(this.title); });
describe("p.aberd", function() { process(this.title); });
describe("p.abinn", function() { process(this.title); });
describe("p.achm", function() { process(this.title); });
describe("p.adl", function() { process(this.title); });
describe("p.aegyptus.cent", function() { process(this.title); });
describe("p.aktenbuch", function() { process(this.title); });
describe("p.alex", function() { process(this.title); });
describe("p.alex.giss", function() { process(this.title); });
describe("p.amh", function() { process(this.title); });
describe("p.ammon", function() { process(this.title); });
describe("p.amst", function() { process(this.title); });
describe("p.anag", function() { process(this.title); });
describe("p.ant", function() { process(this.title); });
describe("p.aphrod.reg", function() { process(this.title); });
describe("p.apoll", function() { process(this.title); });
describe("p.ashm", function() { process(this.title); });
describe("p.athen", function() { process(this.title); });
describe("p.athen.xyla", function() { process(this.title); });
describe("p.aust.herr", function() { process(this.title); });
describe("p.babatha", function() { process(this.title); });
describe("p.bacch", function() { process(this.title); });
describe("p.bad", function() { process(this.title); });
describe("p.bagnall", function() { process(this.title); });
describe("p.bal", function() { process(this.title); });
describe("p.bas", function() { process(this.title); });
describe("p.bastianini", function() { process(this.title); });
describe("p.batav", function() { process(this.title); });
describe("p.bawit.clackson", function() { process(this.title); });
describe("p.benaki", function() { process(this.title); });
describe("p.berl.bibl", function() { process(this.title); });
describe("p.berl.bork", function() { process(this.title); });
describe("p.berl.brash", function() { process(this.title); });
describe("p.berl.cohen", function() { process(this.title); });
describe("p.berl.frisk", function() { process(this.title); });
describe("p.berl.leihg", function() { process(this.title); });
describe("p.berl.moeller", function() { process(this.title); });
describe("p.berl.monte", function() { process(this.title); });
describe("p.berl.salmen", function() { process(this.title); });
describe("p.berl.sarisch", function() { process(this.title); });
describe("p.berl.thun", function() { process(this.title); });
describe("p.berl.zill", function() { process(this.title); });
describe("p.bingen", function() { process(this.title); });
describe("p.bodl", function() { process(this.title); });
describe("p.bon", function() { process(this.title); });
describe("p.bour", function() { process(this.title); });
describe("p.brem", function() { process(this.title); });
describe("p.brook", function() { process(this.title); });
describe("p.brux", function() { process(this.title); });
describe("p.brux.bawit", function() { process(this.title); });
describe("p.bub", function() { process(this.title); });
describe("p.cair.arab", function() { process(this.title); });
describe("p.cair.gad", function() { process(this.title); });
describe("p.cair.goodsp", function() { process(this.title); });
describe("p.cair.isid", function() { process(this.title); });
describe("p.cair.masp", function() { process(this.title); });
describe("p.cair.mich", function() { process(this.title); });
describe("p.cair.preis", function() { process(this.title); });
describe("p.cair.preis.2", function() { process(this.title); });
describe("p.cair.salem", function() { process(this.title); });
describe("p.cair.zen", function() { process(this.title); });
describe("p.capasso", function() { process(this.title); });
describe("p.charite", function() { process(this.title); });
describe("p.chic.haw", function() { process(this.title); });
describe("p.christ.musl", function() { process(this.title); });
describe("p.clackson", function() { process(this.title); });
describe("p.col", function() { process(this.title); });
describe("p.col.teeter", function() { process(this.title); });
describe("p.coles", function() { process(this.title); });
describe("p.coll.youtie", function() { process(this.title); });
describe("p.congr.xv", function() { process(this.title); });
describe("p.corn", function() { process(this.title); });
describe("p.count", function() { process(this.title); });
describe("p.customs", function() { process(this.title); });
describe("p.daris", function() { process(this.title); });
describe("p.david", function() { process(this.title); });
describe("p.dime", function() { process(this.title); });
describe("p.diog", function() { process(this.title); });
describe("p.dion", function() { process(this.title); });
describe("p.dion.herm", function() { process(this.title); });
describe("p.diosk", function() { process(this.title); });
describe("p.dryton", function() { process(this.title); });
describe("p.dubl", function() { process(this.title); });
describe("p.dura", function() { process(this.title); });
describe("p.edfou", function() { process(this.title); });
describe("p.eirene", function() { process(this.title); });
describe("p.eleph", function() { process(this.title); });
describe("p.eleph.wagner", function() { process(this.title); });
describe("p.enteux", function() { process(this.title); });
describe("p.erasm", function() { process(this.title); });
describe("p.erl", function() { process(this.title); });
describe("p.erl.diosp", function() { process(this.title); });
describe("p.euphrates", function() { process(this.title); });
describe("p.fam.tebt", function() { process(this.title); });
describe("p.fay", function() { process(this.title); });
describe("p.flor", function() { process(this.title); });
describe("p.fouad", function() { process(this.title); });
describe("p.frankf", function() { process(this.title); });
describe("p.freer", function() { process(this.title); });
describe("p.freib", function() { process(this.title); });
describe("p.fuad.i.univ", function() { process(this.title); });
describe("p.gascou", function() { process(this.title); });
describe("p.gen", function() { process(this.title); });
describe("p.gen.2", function() { process(this.title); });
describe("p.genova", function() { process(this.title); });
describe("p.giss", function() { process(this.title); });
describe("p.giss.apoll", function() { process(this.title); });
describe("p.giss.univ", function() { process(this.title); });
describe("p.got", function() { process(this.title); });
describe("p.grad", function() { process(this.title); });
describe("p.graux", function() { process(this.title); });
describe("p.grenf", function() { process(this.title); });
describe("p.gron", function() { process(this.title); });
describe("p.gur", function() { process(this.title); });
describe("p.hal", function() { process(this.title); });
describe("p.hamb", function() { process(this.title); });
describe("p.harr", function() { process(this.title); });
describe("p.harrauer", function() { process(this.title); });
describe("p.haun", function() { process(this.title); });
describe("p.heid", function() { process(this.title); });
describe("p.heid.arab", function() { process(this.title); });
describe("p.heid.kopt", function() { process(this.title); });
describe("p.hels", function() { process(this.title); });
describe("p.herakl.bank", function() { process(this.title); });
describe("p.herm", function() { process(this.title); });
describe("p.herm.landl", function() { process(this.title); });
describe("p.hever", function() { process(this.title); });
describe("p.hib", function() { process(this.title); });
describe("p.hombert", function() { process(this.title); });
describe("p.hoogendijk", function() { process(this.title); });
describe("p.horak", function() { process(this.title); });
describe("p.iand", function() { process(this.title); });
describe("p.iand.inv.653", function() { process(this.title); });
describe("p.iand.zen", function() { process(this.title); });
describe("p.ifao", function() { process(this.title); });
describe("p.ital", function() { process(this.title); });
describe("p.jena", function() { process(this.title); });
describe("p.joerdens", function() { process(this.title); });
describe("p.jud.des.misc", function() { process(this.title); });
describe("p.kar.goodsp", function() { process(this.title); });
describe("p.kell", function() { process(this.title); });
describe("p.koeln", function() { process(this.title); });
describe("p.koelnaegypt", function() { process(this.title); });
describe("p.koelnland", function() { process(this.title); });
describe("p.koelnsarapion", function() { process(this.title); });
describe("p.kramer", function() { process(this.title); });
describe("p.kroll", function() { process(this.title); });
describe("p.kron", function() { process(this.title); });
describe("p.kru", function() { process(this.title); });
describe("p.laur", function() { process(this.title); });
describe("p.leeds.mus", function() { process(this.title); });
describe("p.leid.inst", function() { process(this.title); });
describe("p.leipz", function() { process(this.title); });
describe("p.leit", function() { process(this.title); });
describe("p.lille", function() { process(this.title); });
describe("p.lips", function() { process(this.title); });
describe("p.lond", function() { process(this.title); });
describe("p.lond.herm", function() { process(this.title); });
describe("p.louvre", function() { process(this.title); });
describe("p.louvre.bawit", function() { process(this.title); });
describe("p.lund", function() { process(this.title); });
describe("p.marm", function() { process(this.title); });
describe("p.masada", function() { process(this.title); });
describe("p.matr", function() { process(this.title); });
describe("p.mert", function() { process(this.title); });
describe("p.messeri", function() { process(this.title); });
describe("p.meyer", function() { process(this.title); });
describe("p.mich", function() { process(this.title); });
describe("p.mich.aphrod", function() { process(this.title); });
describe("p.mich.mchl", function() { process(this.title); });
describe("p.michael", function() { process(this.title); });
describe("p.mil", function() { process(this.title); });
describe("p.mil.congr.xiv", function() { process(this.title); });
describe("p.mil.congr.xix", function() { process(this.title); });
describe("p.mil.congr.xvii", function() { process(this.title); });
describe("p.mil.congr.xviii", function() { process(this.title); });
describe("p.mil.vogl", function() { process(this.title); });
describe("p.mon.apollo", function() { process(this.title); });
describe("p.mon.epiph", function() { process(this.title); });
describe("p.monts.roca", function() { process(this.title); });
describe("p.muench", function() { process(this.title); });
describe("p.mur", function() { process(this.title); });
describe("p.nag.hamm", function() { process(this.title); });
describe("p.naqlun", function() { process(this.title); });
describe("p.narm.2006", function() { process(this.title); });
describe("p.nekr", function() { process(this.title); });
describe("p.neph", function() { process(this.title); });
describe("p.ness", function() { process(this.title); });
describe("p.nyu", function() { process(this.title); });
describe("p.oslo", function() { process(this.title); });
describe("p.oxf", function() { process(this.title); });
describe("p.oxy", function() { process(this.title); });
describe("p.oxy.descr", function() { process(this.title); });
describe("p.oxy.hels", function() { process(this.title); });
describe("p.oxyrhyncha", function() { process(this.title); });

describe("p.palaurib", function() { process(this.title); });
describe("p.panop", function() { process(this.title); });
describe("p.panop.beatty", function() { process(this.title); });
describe("p.paramone", function() { process(this.title); });
describe("p.paris", function() { process(this.title); });
describe("p.petaus", function() { process(this.title); });
describe("p.petr", function() { process(this.title); });
describe("p.petr.2", function() { process(this.title); });
describe("p.petr.cahier", function() { process(this.title); });
describe("p.petr.kleon", function() { process(this.title); });
describe("p.petra", function() { process(this.title); });
describe("p.phil", function() { process(this.title); });
describe("p.pintaudi", function() { process(this.title); });
describe("p.poethke", function() { process(this.title); });
describe("p.polit.iud", function() { process(this.title); });
describe("p.pommersf", function() { process(this.title); });
describe("p.prag", function() { process(this.title); });
describe("p.prag.varcl", function() { process(this.title); });
describe("p.princ", function() { process(this.title); });
describe("p.princ.roll", function() { process(this.title); });
describe("p.quseir", function() { process(this.title); });
describe("p.rain.cent", function() { process(this.title); });
describe("p.rain.unterricht", function() { process(this.title); });
describe("p.rein", function() { process(this.title); });
describe("p.rev", function() { process(this.title); });
describe("p.ross.georg", function() { process(this.title); });
describe("p.ryl", function() { process(this.title); });
describe("p.ryl.copt", function() { process(this.title); });
describe("p.sakaon", function() { process(this.title); });
describe("p.sarap", function() { process(this.title); });
describe("p.scholl", function() { process(this.title); });
describe("p.schoyen", function() { process(this.title); });
describe("p.sel.warga", function() { process(this.title); });
describe("p.select", function() { process(this.title); });
describe("p.sijp", function() { process(this.title); });
describe("p.sorb", function() { process(this.title); });
describe("p.soter", function() { process(this.title); });
describe("p.stras", function() { process(this.title); });
describe("p.tarich", function() { process(this.title); });
describe("p.tebt", function() { process(this.title); });
describe("p.tebt.pad", function() { process(this.title); });
describe("p.tebt.quen", function() { process(this.title); });
describe("p.tebt.tait", function() { process(this.title); });
describe("p.tebt.wall", function() { process(this.title); });
describe("p.theon", function() { process(this.title); });
describe("p.thmouis", function() { process(this.title); });
describe("p.thomas", function() { process(this.title); });
describe("p.tor", function() { process(this.title); });
describe("p.tor.amen", function() { process(this.title); });
describe("p.tor.choach", function() { process(this.title); });
describe("p.trier", function() { process(this.title); });
describe("p.turku", function() { process(this.title); });
describe("p.turner", function() { process(this.title); });
describe("p.ups.frid", function() { process(this.title); });
describe("p.van.minnen", function() { process(this.title); });
describe("p.vars", function() { process(this.title); });
describe("p.vat.aphrod", function() { process(this.title); });
describe("p.vet.aelii", function() { process(this.title); });
describe("p.vind.bosw", function() { process(this.title); });
describe("p.vind.pher", function() { process(this.title); });
describe("p.vind.sal", function() { process(this.title); });
describe("p.vind.sijp", function() { process(this.title); });
describe("p.vind.tand", function() { process(this.title); });
describe("p.vind.worp", function() { process(this.title); });
describe("p.warr", function() { process(this.title); });
describe("p.wash.univ", function() { process(this.title); });
describe("p.wisc", function() { process(this.title); });
describe("p.worp", function() { process(this.title); });
describe("p.wuerzb", function() { process(this.title); });
describe("p.yale", function() { process(this.title); });
describe("p.zauzich", function() { process(this.title); });
describe("p.zen.pestm", function() { process(this.title); });
describe("pap.agon", function() { process(this.title); });
describe("pap.biling", function() { process(this.title); });
describe("pap.choix", function() { process(this.title); });
describe("pap.congr.26", function() { process(this.title); });
describe("pap.congr.27", function() { process(this.title); });
describe("pap.congr.xxiii", function() { process(this.title); });
describe("pap.congr.xxv", function() { process(this.title); });
describe("paplup", function() { process(this.title); });
describe("psi", function() { process(this.title); });
describe("psi.com", function() { process(this.title); });
describe("psi.congr.xi", function() { process(this.title); });
describe("psi.congr.xvii", function() { process(this.title); });
describe("psi.congr.xx", function() { process(this.title); });
describe("psi.congr.xxi", function() { process(this.title); });
describe("psi.corr", function() { process(this.title); });
describe("pylon", function() { process(this.title); });
describe("reac", function() { process(this.title); });
describe("rom.mil.rec", function() { process(this.title); });
describe("sb", function() { process(this.title); });
describe("sb.kopt", function() { process(this.title); });
describe("short.texts", function() { process(this.title); });
describe("simblos", function() { process(this.title); });
// describe("sosol", function() { process(this.title); }); (currently empty)
describe("stud.pal", function() { process(this.title); });
describe("symboslo", function() { process(this.title); });
describe("t.alb", function() { process(this.title); });
describe("t.bm.arlt", function() { process(this.title); });
describe("t.mom.louvre", function() { process(this.title); });
describe("t.varie", function() { process(this.title); });
describe("t.vindol", function() { process(this.title); });
describe("t.vindon", function() { process(this.title); });
describe("travmem", function() { process(this.title); });
describe("tyche", function() { process(this.title); });
describe("upz", function() { process(this.title); });
describe("vdi", function() { process(this.title); });
describe("zpe", function() { process(this.title); });
describe("zrg", function() { process(this.title); });