import * as chai from "chai";
import chaiXml from "chai-xml";
import { JSDOM } from "jsdom";
import { toXml } from "../packages/transformer-leiden-plus/src/toXml.js";
import { fromXml } from "../packages/transformer-leiden-plus/src/fromXml.js";

chai.use(chaiXml);

const dom = new JSDOM("<div type=\"textpart\" n=\"wrap\" />", {
    contentType: "text/xml",
    url: "http://localhost"
});

global.Element = dom.window.Element;
global.Node = dom.window.Node;


function testTransform(name, leiden, xml, topNode = "InlineContent") {
    it("Leiden → XML: " + (name ?? leiden), () => {
        const resultXml = toXml(leiden, topNode);
        const wrappedXml = `<root>${resultXml}</root>`;
        const wrappedResultXml = `<root>${xml}</root>`;
        // chai.expect(wrappedXml, wrappedXml).xml.to.be.valid();
        chai.expect(wrappedXml).to.equal(wrappedResultXml, `\n${leiden}\n`);
    });

    it("XML → Leiden: " + (name ?? xml), () => {
        dom.window.document.documentElement.innerHTML = " " + xml;

        const resultLeiden = fromXml(dom.window.document.documentElement);
        const wrappedLeiden = `<D=.wrap ${leiden}=D>`;
        chai.expect(resultLeiden.normalize()).to.equal(wrappedLeiden.normalize());
    });
}



describe("place_generic", () => {
    testTransform(null, "||bottom:ς ἐπιστολῆς Θεοδώρου||", '<add place="bottom">ς ἐπιστολῆς Θεοδώρου</add>');
    testTransform(null, "||bottom:ς ἐπιστολῆς Θεοδώρου(?)||", '<add place="bottom">ς ἐπιστολῆς Θεοδώρου<certainty match=".." locus="name"/></add>');
    testTransform(null, "||top:ς ἐπιστολῆς Θεοδώρου||", '<add place="top">ς ἐπιστολῆς Θεοδώρου</add>');
    testTransform(null, "||left:ς ἐπιστολῆς Θεοδώρου||", '<add place="left">ς ἐπιστολῆς Θεοδώρου</add>');
    testTransform(null, "||margin:ς ἐπιστολῆς Θεοδώρου||", '<add place="margin">ς ἐπιστολῆς Θεοδώρου</add>');
    testTransform(null, "||margin:ς ἐπιστολῆς Θεοδώρου(?)||", '<add place="margin">ς ἐπιστολῆς Θεοδώρου<certainty match=".." locus="name"/></add>');
    testTransform(null, "||right:ς ἐπιστολῆς Θεοδώρου||", '<add place="right">ς ἐπιστολῆς Θεοδώρου</add>');
    testTransform(null, "||margin:ς ἐπ̣ιστολῆς Θ[εοδ]ώρου||", '<add place="margin">ς ἐ<unclear>π</unclear>ιστολῆς Θ<supplied reason="lost">εοδ</supplied>ώρου</add>');
    testTransform(null, "||bottom:ς ἐπ̣ιστολῆς Θ[εοδ]ώρου||", '<add place="bottom">ς ἐ<unclear>π</unclear>ιστολῆς Θ<supplied reason="lost">εοδ</supplied>ώρου</add>');
    testTransform(null, "||margin:ς ἐπ̣ιστολῆς Θ[εοδ]ώρου(?)||", '<add place="margin">ς ἐ<unclear>π</unclear>ιστολῆς Θ<supplied reason="lost">εοδ</supplied>ώρου<certainty match=".." locus="name"/></add>');
    testTransform(null, "||bottom:ς ἐπ̣ιστολῆς Θ[εοδ]ώρου(?)||", '<add place="bottom">ς ἐ<unclear>π</unclear>ιστολῆς Θ<supplied reason="lost">εοδ</supplied>ώρου<certainty match=".." locus="name"/></add>');

});

describe("expansions", () => {
    testTransform(null, "(a(b))", "<expan>a<ex>b</ex></expan>");

    testTransform(null, "(ab(c)def(gh)i(j))", "<expan>ab<ex>c</ex>def<ex>gh</ex>i<ex>j</ex></expan>");

    testTransform(null, "<=abc[def] ([gh]i(jk))=>", '<ab>abc<supplied reason="lost">def</supplied> <expan><supplied reason="lost">gh</supplied>i<ex>jk</ex></expan></ab>', "SingleAb");
    testTransform(null, "(a[b(cd)])", '<expan>a<supplied reason="lost">b<ex>cd</ex></supplied></expan>');
    testTransform(null, "([(eton)])", '<expan><supplied reason="lost"><ex>eton</ex></supplied></expan>');

    testTransform(null, "((abc))", "<expan><ex>abc</ex></expan>");
    testTransform(null, "((ἑπτα)κωμίας)", "<expan><ex>ἑπτα</ex>κωμίας</expan>");
    testTransform(null, "((ἑπτα)κω̣μίας)", "<expan><ex>ἑπτα</ex>κ<unclear>ω</unclear>μίας</expan>");
    testTransform(null, "((ἑπτα)κω̣μ[ία̣]ς)", '<expan><ex>ἑπτα</ex>κ<unclear>ω</unclear>μ<supplied reason="lost">ί<unclear>α</unclear></supplied>ς</expan>');

    testTransform(null, "(πωμαρ[(ί)]υ̣)", '<expan>πωμαρ<supplied reason="lost"><ex>ί</ex></supplied><unclear>υ</unclear></expan>');
    testTransform(null, "(ἀ[κρ̣ό̣δ̣(ρυα)])", '<expan>ἀ<supplied reason="lost">κ<unclear>ρόδ</unclear><ex>ρυα</ex></supplied></expan>');
    testTransform(null, "(ἀ[κ ρ̣ό̣δ̣(ρυα)])", '<expan>ἀ<supplied reason="lost">κ <unclear>ρόδ</unclear><ex>ρυα</ex></supplied></expan>');
    testTransform(null, "([(Ἑπτα)]κ̣ω̣μ̣[(ίας)])", '<expan><supplied reason="lost"><ex>Ἑπτα</ex></supplied><unclear>κωμ</unclear><supplied reason="lost"><ex>ίας</ex></supplied></expan>');
    testTransform(null, "([Κ(α)ρ]ανίδ(ος))", '<expan><supplied reason="lost">Κ<ex>α</ex>ρ</supplied>ανίδ<ex>ος</ex></expan>');
    testTransform(null, "((῾επταρούρῳ))", "<expan><ex>῾επταρούρῳ</ex></expan>");
    testTransform(null, "((ἀρταβίας᾿?))", '<expan><ex cert="low">ἀρταβίας᾿</ex></expan>');
    testTransform(null, "<:(Ἀ ι(¨)ου[λ(ίου)]) [.?] =BL 8.455|ed|(Ἰου[λ(ίου)]) [.?] :>", '<app type="editorial"><lem resp="BL 8.455"><expan>Ἀ<hi rend="diaeresis">ι</hi>ου<supplied reason="lost">λ<ex>ίου</ex></supplied></expan> <gap reason="lost" extent="unknown" unit="character"/> </lem><rdg><expan>Ἰου<supplied reason="lost">λ<ex>ίου</ex></supplied></expan> <gap reason="lost" extent="unknown" unit="character"/> </rdg></app>');
    testTransform(null, "(Ψ̣α ΐ(¨)ο(υ))", '<expan><unclear>Ψ</unclear>α<hi rend="diaeresis">ΐ</hi>ο<ex>υ</ex></expan>');
    testTransform(null, "(Ψεvac.?ν(τ))", '<expan>Ψε<space extent="unknown" unit="character"/>ν<ex>τ</ex></expan>');
    testTransform(null, "(μο̣ύ ι(¨)(α))", '<expan>μ<unclear>ο</unclear>ύ<hi rend="diaeresis">ι</hi><ex>α</ex></expan>');
    testTransform(null, "(Ψ̣α ί(¨)ο(υ))", '<expan><unclear>Ψ</unclear>α<hi rend="diaeresis">ί</hi>ο<ex>υ</ex></expan>');
    testTransform(null, "(ἔ̣πα ι(¨)(τον))", '<expan><unclear>ἔ</unclear>πα<hi rend="diaeresis">ι</hi><ex>τον</ex></expan>');
    testTransform(null, "(Θεμα ΐ(¨)τ[ο(ς)(?)])", '<expan>Θεμα<hi rend="diaeresis">ΐ</hi>τ<supplied reason="lost" cert="low">ο<ex>ς</ex></supplied></expan>');
    testTransform(null, "(Α[.2]ωνο(ς))", '<expan>Α<gap reason="lost" quantity="2" unit="character"/>ωνο<ex>ς</ex></expan>');
    testTransform(null, "([.?].1λινο̣κ(αλάμης))", '<expan><gap reason="lost" extent="unknown" unit="character"/><gap reason="illegible" quantity="1" unit="character"/>λιν<unclear>ο</unclear>κ<ex>αλάμης</ex></expan>');
    testTransform(null, "([.?]ή̣σιο(ς))", '<expan><gap reason="lost" extent="unknown" unit="character"/><unclear>ή</unclear>σιο<ex>ς</ex></expan>');
    testTransform(null, "([.?]ωνο(ς))", '<expan><gap reason="lost" extent="unknown" unit="character"/>ωνο<ex>ς</ex></expan>');
    testTransform(null, "([.?]ε̣ί̣δ(ης?))", '<expan><gap reason="lost" extent="unknown" unit="character"/><unclear>εί</unclear>δ<ex cert="low">ης</ex></expan>');
    testTransform(null, "([.?].1ω(νος))", '<expan><gap reason="lost" extent="unknown" unit="character"/><gap reason="illegible" quantity="1" unit="character"/>ω<ex>νος</ex></expan>');
    testTransform(null, "([.?](ἀρουρ ))", '<expan><gap reason="lost" extent="unknown" unit="character"/><ex>ἀρουρ </ex></expan>');
    testTransform(null, "(ab[cdef(ghi)(?)])", '<expan>ab<supplied reason="lost" cert="low">cdef<ex>ghi</ex></supplied></expan>');
    testTransform(null, "(ab[cdef(ghi?)])", '<expan>ab<supplied reason="lost">cdef<ex cert="low">ghi</ex></supplied></expan>');
    testTransform(null, "(ab[cdef(ghi)])", '<expan>ab<supplied reason="lost">cdef<ex>ghi</ex></supplied></expan>');
    testTransform(null, "(κ̣(ατ)οί̣[κ(ων)(?)])", '<expan><unclear>κ</unclear><ex>ατ</ex>ο<unclear>ί</unclear><supplied reason="lost" cert="low">κ<ex>ων</ex></supplied></expan>');
    testTransform(null, "(κ̣(ατ))", "<expan><unclear>κ</unclear><ex>ατ</ex></expan>");
    testTransform(null, "(κ̣(ατ)(ατ))", "<expan><unclear>κ</unclear><ex>ατ</ex><ex>ατ</ex></expan>");
    testTransform(null, "(κ̣(ατ)ο)", "<expan><unclear>κ</unclear><ex>ατ</ex>ο</expan>");
    testTransform(null, "(κ̣(ατ)οί̣)", "<expan><unclear>κ</unclear><ex>ατ</ex>ο<unclear>ί</unclear></expan>");
    testTransform(null, "(κ̣(ατ)οί̣[(ων)])", '<expan><unclear>κ</unclear><ex>ατ</ex>ο<unclear>ί</unclear><supplied reason="lost"><ex>ων</ex></supplied></expan>');
    testTransform(null, "(κ̣(ατ)οί̣[κ(ων)])", '<expan><unclear>κ</unclear><ex>ατ</ex>ο<unclear>ί</unclear><supplied reason="lost">κ<ex>ων</ex></supplied></expan>');

    // below here from short run
    testTransform(null, "((abc))", "<expan><ex>abc</ex></expan>");
    testTransform(null, "[ίως ((ἔτους)) <#ι=10(?)#>  καὶ ]", '<supplied reason="lost">ίως <expan><ex>ἔτους</ex></expan> <num value="10">ι<certainty match="../@value" locus="value"/></num>  καὶ </supplied>');
    testTransform(null, "([(eton)])", '<expan><supplied reason="lost"><ex>eton</ex></supplied></expan>');
    testTransform(null, "(ab(c)def(gh)i(j))", "<expan>ab<ex>c</ex>def<ex>gh</ex>i<ex>j</ex></expan>");
    testTransform(null, "_[(ἀρ(τάβας?)) (δωδέκ(ατον)) (εἰκ(οστοτέταρτον?)) ((ἀρτάβας)) <#ιβ '=1/12#> <#κδ '=1/24#> *stauros* <:Ἀγαθάμμων=BL 8.441|ed|(δ(ι)) (|μ|) κάμμονι:> \\*stauros*/ *tachygraphic-marks*(?)]_", '<supplied evidence="parallel" reason="lost" cert="low"><expan>ἀρ<ex cert="low">τάβας</ex></expan> <expan>δωδέκ<ex>ατον</ex></expan> <expan>εἰκ<ex cert="low">οστοτέταρτον</ex></expan> <expan><ex>ἀρτάβας</ex></expan> <num value="1/12" rend="tick">ιβ</num> <num value="1/24" rend="tick">κδ</num> <g type="stauros"/> <app type="editorial"><lem resp="BL 8.441">Ἀγαθάμμων</lem><rdg><expan>δ<ex>ι</ex></expan> <abbr>μ</abbr> κάμμονι</rdg></app> <add place="above"><g type="stauros"/></add> <g type="tachygraphic-marks"/></supplied>');
    testTransform(null, "((abc 123))", "<expan><ex>abc 123</ex></expan>");
    testTransform(null, "[ ((ἡμιωβέλιον)) <#=1/2#>(|προ|) ((δραχμὴν)) <#α=1#> (χ(αλκοῦς 2))<#=2#>]", '<supplied reason="lost"> <expan><ex>ἡμιωβέλιον</ex></expan> <num value="1/2"/><abbr>προ</abbr> <expan><ex>δραχμὴν</ex></expan> <num value="1">α</num> <expan>χ<ex>αλκοῦς 2</ex></expan><num value="2"/></supplied>');
    testTransform(null, "<:[.?]<#λβ=32#> .2 ἐκ <((ταλάντων))> <#κζ=27#> <((δραχμῶν))> <#Γ=3000#> ((τάλαντα)) <#ωοθ=879#> <((δραχμαὶ))> <#Γσ=3200#>=SoSOL Sosin|ed|[.?]<#λβ=32#> <#𐅵 '=1/2#> <#ιβ '=1/12#> ἐκ ((ταλάντων)) <#ζ=7#> <#Γ=3000#> ((τάλαντα)) <#ωοθ=879#> <#η '=1/8(?)#>:>", '<app type="editorial"><lem resp="SoSOL Sosin"><gap reason="lost" extent="unknown" unit="character"/><num value="32">λβ</num> <gap reason="illegible" quantity="2" unit="character"/> ἐκ <supplied reason="omitted"><expan><ex>ταλάντων</ex></expan></supplied> <num value="27">κζ</num> <supplied reason="omitted"><expan><ex>δραχμῶν</ex></expan></supplied> <num value="3000">Γ</num> <expan><ex>τάλαντα</ex></expan> <num value="879">ωοθ</num> <supplied reason="omitted"><expan><ex>δραχμαὶ</ex></expan></supplied> <num value="3200">Γσ</num></lem><rdg><gap reason="lost" extent="unknown" unit="character"/><num value="32">λβ</num> <num value="1/2" rend="tick">𐅵</num> <num value="1/12" rend="tick">ιβ</num> ἐκ <expan><ex>ταλάντων</ex></expan> <num value="7">ζ</num> <num value="3000">Γ</num> <expan><ex>τάλαντα</ex></expan> <num value="879">ωοθ</num> <num value="1/8" rend="tick">η<certainty match="../@value" locus="value"/></num></rdg></app>');
    testTransform(null, "<:(|πριμο̣σκ|)|alt|(|πριμσκ|):>", '<app type="alternative"><lem><abbr>πριμ<unclear>ο</unclear>σκ</abbr></lem><rdg><abbr>πριμσκ</abbr></rdg></app>');
    testTransform(null, "<:(|πριμο̣σκ|)|alt|(|πριμσκ(?)|):>", '<app type="alternative"><lem><abbr>πριμ<unclear>ο</unclear>σκ</abbr></lem><rdg><abbr>πριμσκ<certainty locus="name" match=".."/></abbr></rdg></app>');

    testTransform(null, "((ἑπτα)κωμίας)", "<expan><ex>ἑπτα</ex>κωμίας</expan>");
    testTransform(null, "((ἑπτα)κω̣μίας)", "<expan><ex>ἑπτα</ex>κ<unclear>ω</unclear>μίας</expan>");
    testTransform(null, "((ἑπτα)κω̣μ[ία̣]ς)", '<expan><ex>ἑπτα</ex>κ<unclear>ω</unclear>μ<supplied reason="lost">ί<unclear>α</unclear></supplied>ς</expan>');
    testTransform(null, "(ἀρ[γ(υρικῶν?)])", '<expan>ἀρ<supplied reason="lost">γ<ex cert="low">υρικῶν</ex></supplied></expan>');
    testTransform(null, "((ἑκατονταρ)χ(ίας))", "<expan><ex>ἑκατονταρ</ex>χ<ex>ίας</ex></expan>");
    testTransform(null, "(τετ[ελ(ευτηκότος?)])", '<expan>τετ<supplied reason="lost">ελ<ex cert="low">ευτηκότος</ex></supplied></expan>');
    testTransform(null, "((ἑκατοντάρ)χ(ῳ))", "<expan><ex>ἑκατοντάρ</ex>χ<ex>ῳ</ex></expan>");
    testTransform(null, "((ἑκατοντάρ)χ(ῃ))", "<expan><ex>ἑκατοντάρ</ex>χ<ex>ῃ</ex></expan>");
    testTransform(null, "((ἑκατοντά)ρχ(ῳ))", "<expan><ex>ἑκατοντά</ex>ρχ<ex>ῳ</ex></expan>");
    testTransform(null, "((ἑκατοντά)ρχ(ῳ))", "<expan><ex>ἑκατοντά</ex>ρχ<ex>ῳ</ex></expan>");
    testTransform(null, "(ἀριθ(μητικοῦ))", "<expan>ἀριθ<ex>μητικοῦ</ex></expan>");
    testTransform(null, "([κ(ατ)]οί(κων))", '<expan><supplied reason="lost">κ<ex>ατ</ex></supplied>οί<ex>κων</ex></expan>');
    testTransform(null, "([κ]οι(νῆσ))", '<expan><supplied reason="lost">κ</supplied>οι<ex>νῆσ</ex></expan>');
    testTransform(null, "(ἐν[τ(έτακται?)])", '<expan>ἐν<supplied reason="lost">τ<ex cert="low">έτακται</ex></supplied></expan>');
    testTransform(null, "([δ]ι(ὰ))", '<expan><supplied reason="lost">δ</supplied>ι<ex>ὰ</ex></expan>');
    testTransform(null, "(κ̣ώ̣(μησ))", "<expan><unclear>κώ</unclear><ex>μησ</ex></expan>");
    testTransform(null, "((ἑκατοντάρ)χ(ῃ))", "<expan><ex>ἑκατοντάρ</ex>χ<ex>ῃ</ex></expan>");
    testTransform(null, "(χ(ιλιά)ρ(χῃ))", "<expan>χ<ex>ιλιά</ex>ρ<ex>χῃ</ex></expan>");
    // supplied cert low

    testTransform(null, "(ab[cdef(ghi)(?)])", '<expan>ab<supplied reason="lost" cert="low">cdef<ex>ghi</ex></supplied></expan>');
    testTransform(null, "(ab[cdef(ghi?)])", '<expan>ab<supplied reason="lost">cdef<ex cert="low">ghi</ex></supplied></expan>');
    testTransform(null, "(ab[cdef(ghi)])", '<expan>ab<supplied reason="lost">cdef<ex>ghi</ex></supplied></expan>');
    testTransform(null, "(κ̣(ατ)οί̣[κ(ων)(?)])", '<expan><unclear>κ</unclear><ex>ατ</ex>ο<unclear>ί</unclear><supplied reason="lost" cert="low">κ<ex>ων</ex></supplied></expan>');
    // supplied lost starting with markup
    testTransform(null, "(ἀ[κ ρ̣ό̣δ̣(ρυα)])", '<expan>ἀ<supplied reason="lost">κ <unclear>ρόδ</unclear><ex>ρυα</ex></supplied></expan>');
    testTransform(null, "(γί̣[κ ρ̣ό̣δ̣(ρυα)])", '<expan>γ<unclear>ί</unclear><supplied reason="lost">κ <unclear>ρόδ</unclear><ex>ρυα</ex></supplied></expan>');
    testTransform(null, "(γί̣[ον̣(νται)])", '<expan>γ<unclear>ί</unclear><supplied reason="lost">ο<unclear>ν</unclear><ex>νται</ex></supplied></expan>');
    testTransform(null, "(γί̣[ν ο(νται)])", '<expan>γ<unclear>ί</unclear><supplied reason="lost">ν ο<ex>νται</ex></supplied></expan>');
    testTransform(null, "(γί̣[aν̣ο(νται)])", '<expan>γ<unclear>ί</unclear><supplied reason="lost">a<unclear>ν</unclear>ο<ex>νται</ex></supplied></expan>');
    testTransform(null, "(γί̣[ν̣ο(νται)])", '<expan>γ<unclear>ί</unclear><supplied reason="lost"><unclear>ν</unclear>ο<ex>νται</ex></supplied></expan>');
    // supplied evidence
    testTransform(null, "(Αὐρ|_(ηλίας)_|)", '<expan>Αὐρ<supplied evidence="parallel" reason="undefined"><ex>ηλίας</ex></supplied></expan>');
    testTransform(null, "(ἀπη[λ]|_(ιώτου)_|)", '<expan>ἀπη<supplied reason="lost">λ</supplied><supplied evidence="parallel" reason="undefined"><ex>ιώτου</ex></supplied></expan>');
    testTransform(null, "(Θεμα ΐ(¨)τ|_ο(ς)_|)", '<expan>Θεμα<hi rend="diaeresis">ΐ</hi>τ<supplied evidence="parallel" reason="undefined">ο<ex>ς</ex></supplied></expan>');
    testTransform(null, "(ab|_cdef(ghi)_|)", '<expan>ab<supplied evidence="parallel" reason="undefined">cdef<ex>ghi</ex></supplied></expan>');
    testTransform(null, "(κ̣(ατ)οί̣|_κ(ων)_|)", '<expan><unclear>κ</unclear><ex>ατ</ex>ο<unclear>ί</unclear><supplied evidence="parallel" reason="undefined">κ<ex>ων</ex></supplied></expan>');
    testTransform(null, "(ab|_cdef(ghi)_|)", '<expan>ab<supplied evidence="parallel" reason="undefined">cdef<ex>ghi</ex></supplied></expan>');
    testTransform(null, "(κ̣(ατ)οί̣|_κ(ων)_|)", '<expan><unclear>κ</unclear><ex>ατ</ex>ο<unclear>ί</unclear><supplied evidence="parallel" reason="undefined">κ<ex>ων</ex></supplied></expan>');
});

describe("counting symbol expansion", () => {
    testTransform(null, "((abc 123))", "<expan><ex>abc 123</ex></expan>");
});

describe("abbreviation unknown resolution", () => {
    // ancient abbreviation whose resolution is unknown
    testTransform(null, "(|ab|)", "<abbr>ab</abbr>");
    testTransform(null, "(|bạḅdec̣g|)", "<abbr>b<unclear>ab</unclear>de<unclear>c</unclear>g</abbr>");
    testTransform(null, "(|bạḅdec̣g(?)|)", '<abbr>b<unclear>ab</unclear>de<unclear>c</unclear>g<certainty locus="name" match=".."/></abbr>');
    testTransform(null, "[ ((ἡμιωβέλιον)) <#=1/2#>(|προ|) ((δραχμὴν)) <#α=1#> (χ(αλκοῦς 2))<#=2#>]", '<supplied reason="lost"> <expan><ex>ἡμιωβέλιον</ex></expan> <num value="1/2"/><abbr>προ</abbr> <expan><ex>δραχμὴν</ex></expan> <num value="1">α</num> <expan>χ<ex>αλκοῦς 2</ex></expan><num value="2"/></supplied>');
    testTransform(null, "(|υιω(?)|)", '<abbr>υιω<certainty locus="name" match=".."/></abbr>');
    testTransform(null, "<:(|πριμο̣σκ|)|alt|(|πριμσκ|):>", '<app type="alternative"><lem><abbr>πριμ<unclear>ο</unclear>σκ</abbr></lem><rdg><abbr>πριμσκ</abbr></rdg></app>');
    testTransform(null, "<:(|πριμο̣σκ|)|alt|(|πριμσκ(?)|):>", '<app type="alternative"><lem><abbr>πριμ<unclear>ο</unclear>σκ</abbr></lem><rdg><abbr>πριμσκ<certainty locus="name" match=".."/></abbr></rdg></app>');
    testTransform(null, "<:.5(( ))|alt|(|κουδ(?)|) :>", '<app type="alternative"><lem><gap reason="illegible" quantity="5" unit="character"/><expan><ex> </ex></expan></lem><rdg><abbr>κουδ<certainty locus="name" match=".."/></abbr> </rdg></app>');
});

describe("abbreviation_uncertain_resolution", () => {
    testTransform(null, "((abc?))", '<expan><ex cert="low">abc</ex></expan>');
});

describe("test_gap_certainty_match", () => {
    testTransform(null, "[.3(?)]", '<gap reason="lost" quantity="3" unit="character"><certainty match=".." locus="name"/></gap>');
    testTransform(null, ".3(?) ", '<gap reason="illegible" quantity="3" unit="character"><certainty match=".." locus="name"/></gap>');
    testTransform(null, "lost.3lin(?) ", '<gap reason="lost" quantity="3" unit="line"><certainty match=".." locus="name"/></gap>');
    testTransform(null, ".3lin(?) ", '<gap reason="illegible" quantity="3" unit="line"><certainty match=".." locus="name"/></gap>');
    testTransform(null, "[.?(?)]", '<gap reason="lost" extent="unknown" unit="character"><certainty match=".." locus="name"/></gap>');
    testTransform(null, ".?(?) ", '<gap reason="illegible" extent="unknown" unit="character"><certainty match=".." locus="name"/></gap>');
    testTransform(null, "lost.?lin(?) ", '<gap reason="lost" extent="unknown" unit="line"><certainty match=".." locus="name"/></gap>');
    testTransform(null, "vestig.?lin(?) ", '<gap reason="illegible" extent="unknown" unit="line"><certainty match=".." locus="name"/></gap>');
});

describe("lost_dot_gap", () => {
    testTransform(null, "[ca.13]", '<gap reason="lost" quantity="13" unit="character" precision="low"/>');
    testTransform(null, "[.1]", '<gap reason="lost" quantity="1" unit="character"/>');
    testTransform(null, "[.2]", '<gap reason="lost" quantity="2" unit="character"/>');
    testTransform(null, "[.3]", '<gap reason="lost" quantity="3" unit="character"/>');
    Array.from({ length: 97 }, (_, i) => i + 4).forEach(n => {
        testTransform(null, `[.${n}]`, `<gap reason="lost" quantity="${n}" unit="character"/>`);
    });
});

describe("lost_gap_unknown", () => {
    testTransform(null, "[.?]", '<gap reason="lost" extent="unknown" unit="character"/>');
});

describe("unclear", () => {
    testTransform(null, "έ̣","<unclear>έ</unclear>");
    // TODO: Normalization (composition, decomposition)
    // testTransform(null, '[ π]έ̣μψον','<supplied reason="lost"> π</supplied><unclear>έ</unclear>μψον');
    // testTransform(null, '[.?]ης αὐτὸν ἐ̣ξ ','<gap reason="lost" extent="unknown" unit="character"/>ης αὐτὸν <unclear>ἐ</unclear>ξ ');

    // below tests without regard for composition/decomposition
    testTransform(null, "[ π]έ̣μψον",'<supplied reason="lost"> π</supplied><unclear>έ</unclear>μψον');
    // TODO: find out which normalization applies
    // testTransform(null, '[.?]ης αὐτὸν ἐ̣ξ ','<gap reason="lost" extent="unknown" unit="character"/>ης αὐτὸν <unclear>ἐ</unclear>ξ ');
});

// commented out in xsugar test suite with comment:
// skip 'we need to make sure this does the correct NFD/NFC transformations'
// describe('supraline_combining_accents', () => {
//     testTransform(null, 'θ̄ε̄ῷ̄','<hi rend="supraline">θεῷ</hi>');
//     testTransform(null, 'Ἀ̣φ̄ᾱί̣̄σ̣̄ε̄ω̄ς̄,','<unclear>Ἀ</unclear><hi rend="supraline">φα<unclear>ίσ</unclear>εως</hi>,');
// });

describe("illegible_dot_gap", () => {
    testTransform(null, "ca.13", '<gap reason="illegible" quantity="13" unit="character" precision="low"/>');
    testTransform(null, "ca.20", '<gap reason="illegible" quantity="20" unit="character" precision="low"/>');
    testTransform(null, ".1", '<gap reason="illegible" quantity="1" unit="character"/>');
    testTransform(null, ".2", '<gap reason="illegible" quantity="2" unit="character"/>');
    testTransform(null, ".3", '<gap reason="illegible" quantity="3" unit="character"/>');
    testTransform(null, ".4. ", '<gap reason="illegible" quantity="4" unit="character"/>. ');
    testTransform(null, "8. .1. \n\n9. <:κ|reg|κα̣:>", '<lb n="8"/><gap reason="illegible" quantity="1" unit="character"/>. \n\n<lb n="9"/><choice><reg>κ</reg><orig>κ<unclear>α</unclear></orig></choice>');
    // TODO: normalization issue
    // testTransform(null, '6. Μ̣ε̣ο̣.4. τοῦ \n\n7. ((ἔτους)) ', '<lb n="6"/><unclear>Μεο</unclear><gap reason="illegible" quantity="4" unit="character"/>. τοῦ \n\n<lb n="7"/><expan><ex>ἔτους</ex></expan> ');

    Array.from({ length: 97 }, (_, i) => i + 4).forEach(n => {
        testTransform(null, `.${n}`, `<gap reason="illegible" quantity="${n}" unit="character"/>`);
    });
});

describe("illegible_gap_unknown", () => {
    testTransform(null, ".?", '<gap reason="illegible" extent="unknown" unit="character"/>');
});

describe("illegible_dot_gap_extentmax", () => {
    testTransform(null, ".2-3", '<gap reason="illegible" atLeast="2" atMost="3" unit="character"/>');
    testTransform(null, ".7-14", '<gap reason="illegible" atLeast="7" atMost="14" unit="character"/>');
    testTransform(null, ".31-77", '<gap reason="illegible" atLeast="31" atMost="77" unit="character"/>');
    testTransform(null, ".3-5(?) ", '<gap reason="illegible" atLeast="3" atMost="5" unit="character"><certainty match=".." locus="name"/></gap>');
    testTransform(null, ".3-5lin", '<gap reason="illegible" atLeast="3" atMost="5" unit="line"/>');
    testTransform(null, ".3-5lin(?) ", '<gap reason="illegible" atLeast="3" atMost="5" unit="line"><certainty match=".." locus="name"/></gap>');
});

describe("lost_dot_gap_extentmax", () => {
    testTransform(null, "[.1-2]", '<gap reason="lost" atLeast="1" atMost="2" unit="character"/>');
    testTransform(null, "[.3-5(?)]", '<gap reason="lost" atLeast="3" atMost="5" unit="character"><certainty match=".." locus="name"/></gap>');
    testTransform(null, "lost.3-5lin", '<gap reason="lost" atLeast="3" atMost="5" unit="line"/>');
    testTransform(null, "lost.3-5lin(?) ", '<gap reason="lost" atLeast="3" atMost="5" unit="line"><certainty match=".." locus="name"/></gap>');
    testTransform(null, "[.7-14]", '<gap reason="lost" atLeast="7" atMost="14" unit="character"/>');
    testTransform(null, "[.31-77]", '<gap reason="lost" atLeast="31" atMost="77" unit="character"/>');
    Array.from({ length: 90 }, (_, i) => i + 11).forEach(n => {
        testTransform(null, `[.10-${n}]`, `<gap reason="lost" atLeast="10" atMost="${n}" unit="character"/>`);
    });

});

describe("illegible_dot_lin", () => {
    testTransform(null, ".1lin", '<gap reason="illegible" quantity="1" unit="line"/>');
    testTransform(null, ".77lin", '<gap reason="illegible" quantity="77" unit="line"/>');
    testTransform(null, ".100lin", '<gap reason="illegible" quantity="100" unit="line"/>');
    testTransform(null, "ca.7lin", '<gap reason="illegible" quantity="7" unit="line" precision="low"/>');
});

describe("illegible_dot_lin_extentmax", () => {
    testTransform(null, ".1-7lin", '<gap reason="illegible" atLeast="1" atMost="7" unit="line"/>');
    testTransform(null, ".1-27lin", '<gap reason="illegible" atLeast="1" atMost="27" unit="line"/>');
    testTransform(null, ".77-97lin", '<gap reason="illegible" atLeast="77" atMost="97" unit="line"/>');
    testTransform(null, ".87-100lin", '<gap reason="illegible" atLeast="87" atMost="100" unit="line"/>');
});

// http://www.stoa.org/epidoc/gl/5/vestiges.html
// but no desc="vestiges"
describe("vestige_lines", () => {
    // vestiges of N lines, mere smudges really, visible
    testTransform(null, "vestig.ca.7lin", '<gap reason="illegible" quantity="7" unit="line" precision="low"><desc>vestiges</desc></gap>');
    testTransform(null, "vestig.3lin", '<gap reason="illegible" quantity="3" unit="line"><desc>vestiges</desc></gap>');
    Array.from({ length: 100 }, (_, i) => i + 1).forEach(n => {
        testTransform(null, `vestig.${n}lin`, `<gap reason="illegible" quantity="${n}" unit="line"><desc>vestiges</desc></gap>`);
    });
});

// http://www.stoa.org/epidoc/gl/5/vestiges.html
// but no desc="vestiges"
describe("vestige_lines_ca", () => {
    // vestiges of rough number of lines, mere smudges really, visible
    testTransform(null, "vestig.ca.7lin", '<gap reason="illegible" quantity="7" unit="line" precision="low"><desc>vestiges</desc></gap>');
    testTransform(null, "vestig.ca.3lin", '<gap reason="illegible" quantity="3" unit="line" precision="low"><desc>vestiges</desc></gap>');
    Array.from({ length: 100 }, (_, i) => i + 1).forEach(n => {
        testTransform(null, `vestig.ca.${n}lin`, `<gap reason="illegible" quantity="${n}" unit="line" precision="low"><desc>vestiges</desc></gap>`);
    });
});

// http://www.stoa.org/epidoc/gl/5/vestiges.html
// should this have desc="vestiges"?
describe("vestige_lines_unknown", () => {
    // vestiges of an unspecified number of lines, mere smudges, visible
    testTransform(null, "vestig.?lin", '<gap reason="illegible" extent="unknown" unit="line"/>');
});

// http://www.stoa.org/epidoc/gl/5/vestiges.html
// but no desc="vestiges"
describe("vestige_characters", () => {
    // vestiges of an unspecified number of characters, mere smudges, visible
    testTransform(null, "vestig ", '<gap reason="illegible" extent="unknown" unit="character"><desc>vestiges</desc></gap>');
    testTransform(null, "vestig.7char", '<gap reason="illegible" quantity="7" unit="character"><desc>vestiges</desc></gap>');
    testTransform(null, "vestig.ca.7char", '<gap reason="illegible" quantity="7" unit="character" precision="low"><desc>vestiges</desc></gap>');
});

// http://www.stoa.org/epidoc/gl/5/lostline.html
describe("lost_lines", () => {
    testTransform(null, "lost.ca.7lin", '<gap reason="lost" quantity="7" unit="line" precision="low"/>');
    testTransform(null, "lost.3lin", '<gap reason="lost" quantity="3" unit="line"/>');
    Array.from({ length: 100 }, (_, i) => i + 1).forEach(n => {
        testTransform(null, `lost.${n}lin`, `<gap reason="lost" quantity="${n}" unit="line"/>`);
    });
});

// http://www.stoa.org/epidoc/gl/5/lostline.html
describe("lost_lines_unknown", () => {
    // Some unknown number of lost lines
    testTransform(null, "lost.?lin", '<gap reason="lost" extent="unknown" unit="line"/>');
});

// http://www.stoa.org/epidoc/gl/5/erroneousomission.html
describe("omitted", () => {
    // Scribe omitted character(s) and modern ed inserted it
    testTransform(null, "a<b>c", 'a<supplied reason="omitted">b</supplied>c');
    testTransform(null, "<abc>", '<supplied reason="omitted">abc</supplied>');
    testTransform(null, "we will <we will> rock you", 'we will <supplied reason="omitted">we will</supplied> rock you');
    testTransform(null, "we ea<t the fi>sh", 'we ea<supplied reason="omitted">t the fi</supplied>sh');
    testTransform(null, "<.?>", '<gap reason="omitted" extent="unknown" unit="character"/>');
    testTransform(null, "<.12>", '<gap reason="omitted" quantity="12" unit="character"/>');
});

describe("omitted_cert_low", () => {
    testTransform(null, "<τοῦ(?)>", '<supplied reason="omitted" cert="low">τοῦ</supplied>');
    testTransform(null, "<ạḅ(?)>", '<supplied reason="omitted" cert="low"><unclear>ab</unclear></supplied>');
});

describe("evidence_parallel", () => {
    testTransform(null, "|_ς ἐπιστολῆς Θεοδώρου_|", '<supplied evidence="parallel" reason="undefined">ς ἐπιστολῆς Θεοδώρου</supplied>');
    testTransform(null, "|_ωτερίου [τοῦ] λαμπροτά_|", '<supplied evidence="parallel" reason="undefined">ωτερίου <supplied reason="lost">τοῦ</supplied> λαμπροτά</supplied>');
    testTransform(null, "[|_.3ς_|]", '<supplied reason="lost"><supplied evidence="parallel" reason="undefined"><gap reason="illegible" quantity="3" unit="character"/>ς</supplied></supplied>');
    testTransform(null, "[|_ἐν̣_|]", '<supplied reason="lost"><supplied evidence="parallel" reason="undefined">ἐ<unclear>ν</unclear></supplied></supplied>');
    testTransform(null, "[εστῶτος μ|_η̣ν̣ὸ̣ς̣_|]", '<supplied reason="lost">εστῶτος μ<supplied evidence="parallel" reason="undefined"><unclear>ηνὸς</unclear></supplied></supplied>');
    testTransform(null, "|_ρῳ Φ[ιλά]_|", '<supplied evidence="parallel" reason="undefined">ρῳ Φ<supplied reason="lost">ιλά</supplied></supplied>');
    testTransform(null, "_[Πόσεις]_", '<supplied evidence="parallel" reason="lost">Πόσεις</supplied>');
    testTransform(null, "_[ρῳ Φ[ιλά]]_", '<supplied evidence="parallel" reason="lost">ρῳ Φ<supplied reason="lost">ιλά</supplied></supplied>');

});

describe("evidence_parallel_cert_low", () => {
    testTransform(null, "|_ς ἐπιστολῆς Θεοδώρου(?)_|", '<supplied evidence="parallel" reason="undefined" cert="low">ς ἐπιστολῆς Θεοδώρου</supplied>');
    testTransform(null, "|_ωτερίου [τοῦ] λαμπροτά(?)_|", '<supplied evidence="parallel" reason="undefined" cert="low">ωτερίου <supplied reason="lost">τοῦ</supplied> λαμπροτά</supplied>');
    testTransform(null, "|_ρῳ Φ[ιλά](?)_|", '<supplied evidence="parallel" reason="undefined" cert="low">ρῳ Φ<supplied reason="lost">ιλά</supplied></supplied>');
    testTransform(null, "_[Πόσεις(?)]_", '<supplied evidence="parallel" reason="lost" cert="low">Πόσεις</supplied>');
    testTransform(null, "_[(ἀρ(τάβας?)) (δωδέκ(ατον)) (εἰκ(οστοτέταρτον?)) ((ἀρτάβας)) <#ιβ '=1/12#> <#κδ '=1/24#> *stauros* <:Ἀγαθάμμων=BL 8.441|ed|(δ(ι)) (|μ|) κάμμονι:> \\*stauros*/ *tachygraphic-marks*(?)]_", '<supplied evidence="parallel" reason="lost" cert="low"><expan>ἀρ<ex cert="low">τάβας</ex></expan> <expan>δωδέκ<ex>ατον</ex></expan> <expan>εἰκ<ex cert="low">οστοτέταρτον</ex></expan> <expan><ex>ἀρτάβας</ex></expan> <num value="1/12" rend="tick">ιβ</num> <num value="1/24" rend="tick">κδ</num> <g type="stauros"/> <app type="editorial"><lem resp="BL 8.441">Ἀγαθάμμων</lem><rdg><expan>δ<ex>ι</ex></expan> <abbr>μ</abbr> κάμμονι</rdg></app> <add place="above"><g type="stauros"/></add> <g type="tachygraphic-marks"/></supplied>');

    // commented out in xsugar suite:
    // rendtick assert_equal_fragment_transform '_[(ἀρ(τάβας?)) (δωδέκ(ατον)) (εἰκ(οστοτέταρτον?)) ((ἀρτάβας)) <#ιβ=frac1/12#> <#κδ=frac1/24#> *stauros* <:Ἀγαθάμμων=BL 8.441|ed|(δ(ι)) (|μ|) κάμμονι:> \*stauros*/ *tachygraphic-marks*(?)]_', '<supplied evidence="parallel" reason="lost" cert="low"><expan>ἀρ<ex cert="low">τάβας</ex></expan> <expan>δωδέκ<ex>ατον</ex></expan> <expan>εἰκ<ex cert="low">οστοτέταρτον</ex></expan> <expan><ex>ἀρτάβας</ex></expan> <num value="1/12" rend="fraction">ιβ</num> <num value="1/24" rend="fraction">κδ</num> <g type="stauros"/> <app type="editorial"><lem resp="BL 8.441">Ἀγαθάμμων</lem><rdg><expan>δ<ex>ι</ex></expan> <abbr>μ</abbr> κάμμονι</rdg></app> <add place="above"><g type="stauros"/></add> <g type="tachygraphic-marks"/></supplied>'
});

// http://www.stoa.org/epidoc/gl/5/erroneousinclusion.html
describe("surplus", () => {
    // scribe wrote unnecessary characters and modern ed flagged them as such
    testTransform(null, "{test}", "<surplus>test</surplus>");
    testTransform(null, "te{sting 1 2} 3", "te<surplus>sting 1 2</surplus> 3");
    testTransform(null, "{.1}", '<surplus><gap reason="illegible" quantity="1" unit="character"/></surplus>');
    testTransform(null, "{abc.4.2}", '<surplus>abc<gap reason="illegible" quantity="4" unit="character"/><gap reason="illegible" quantity="2" unit="character"/></surplus>');
    testTransform(null, "{.1ab}", '<surplus><gap reason="illegible" quantity="1" unit="character"/>ab</surplus>');
    testTransform(null, "{ab.1}", '<surplus>ab<gap reason="illegible" quantity="1" unit="character"/></surplus>');
    testTransform(null, "{π̣αρ(?)}", '<surplus><unclear>π</unclear>αρ<certainty match=".." locus="value"/></surplus>');
    testTransform(null, "{εἰς(?)}", '<surplus>εἰς<certainty match=".." locus="value"/></surplus>');
});

// http://www.stoa.org/epidoc/gl/5/supplementforlost.html
describe("lost", () => {
    // modern ed restores lost text
    testTransform(null, "[καὶ(?)]", '<supplied reason="lost" cert="low">καὶ</supplied>');
    testTransform(null, "[παρὰ]", '<supplied reason="lost">παρὰ</supplied>');
    testTransform(null, "a[b]c", 'a<supplied reason="lost">b</supplied>c');
    testTransform(null, "a[bc def g]hi", 'a<supplied reason="lost">bc def g</supplied>hi');
});

// http://www.stoa.org/epidoc/gl/5/supplementforlost.html
describe("lost_uncertain", () => {
    // modern ed restores lost text, with less than total confidence; this proved messy to handle in IDP1
    testTransform(null, "a[bc(?)]", 'a<supplied reason="lost" cert="low">bc</supplied>');
    testTransform(null, "[ạḅ(?)]", '<supplied reason="lost" cert="low"><unclear>ab</unclear></supplied>');
    testTransform(null, "a[bc]", 'a<supplied reason="lost">bc</supplied>');
    testTransform(null, "[ạḅ]", '<supplied reason="lost"><unclear>ab</unclear></supplied>');
});

// http://www.stoa.org/epidoc/gl/5/unclear.html
describe("unicode_underdot_unclear", () => {
    // eds read dotted letter with less than full confidence
    testTransform(null, "ạ", "<unclear>a</unclear>");
    testTransform(null, "ε̣ͅ", "<unclear>εͅ</unclear>");
    testTransform(null, "ε̣͂", "<unclear>ε͂</unclear>");
});

// http://www.stoa.org/epidoc/gl/5/unclear.html
describe("unicode_underdot_unclear_combining", () => {
    // eds read dotted letter with less than full confidence
    testTransform(null, "ạḅc̣", "<unclear>abc</unclear>");
    testTransform(null, "ạε̣͂c̣", "<unclear>aε͂c</unclear>");
    testTransform(null, "ạε̣͂c̣ε̣͂", "<unclear>aε͂cε͂</unclear>");
    testTransform(null, "ε̣͂ε̣͂ε̣͂", "<unclear>ε͂ε͂ε͂</unclear>");
    testTransform(null, "ε̣͂ḅε̣͂", "<unclear>ε͂bε͂</unclear>");
    testTransform(null, "ε̣͂ḅε̣͂ḅ", "<unclear>ε͂bε͂b</unclear>");
    testTransform(null, "1. πάρες εͅε͂ ε̣͂ḅε̣͂ḅ add", '<lb n="1"/>πάρες εͅε͂ <unclear>ε͂bε͂b</unclear> add');
});

// http://www.stoa.org/epidoc/gl/5/unclear.html
// http://www.stoa.org/epidoc/gl/5/supplementforlost.html
describe("unicode_underdot_unclear_combining_with_lost", () => {
    testTransform(null, "ạḅ[c̣ de]f", '<unclear>ab</unclear><supplied reason="lost"><unclear>c</unclear> de</supplied>f');
});

// http://www.stoa.org/epidoc/gl/5/deletion.html
describe("ancient_erasure", () => {
    // ancient erasure/cancellation/expunction
    testTransform(null, "a〚bc〛", 'a<del rend="erasure">bc</del>');
    testTransform(null, "ab〚c def g〛hi", 'ab<del rend="erasure">c def g</del>hi');
});

// no EpiDoc guideline, inherited from TEI
describe("quotation_marks", () => {
    // quotation marks on papyrus
    testTransform(null, '"abc"', "<q>abc</q>");
    testTransform(null, '"abc def ghi"', "<q>abc def ghi</q>");
    testTransform(null, '"<:ἔλα 3. βα|corr|αιλαβα:> αὐτὰ"', '<q><choice><corr>ἔλα <lb n="3"/>βα</corr><sic>αιλαβα</sic></choice> αὐτὰ</q>');
    testTransform(null, '[Ἁρχῦψις] "¯[Πετεή]¯σιος" αγδ  "δεξβεφξβν" ςεφξνςφη', '<supplied reason="lost">Ἁρχῦψις</supplied> <q><hi rend="supraline"><supplied reason="lost">Πετεή</supplied></hi>σιος</q> αγδ  <q>δεξβεφξβν</q> ςεφξνςφη');
});

describe("uncertain_diacritical_diaeresis", () => {
    testTransform(null, " a(¨)bc", '<hi rend="diaeresis">a</hi>bc');
    testTransform(null, " a(¨)(?)bc", '<hi rend="diaeresis">a<certainty match=".." locus="value"/></hi>bc');
    // test with pre-combined Unicode just to be sure
    testTransform(null, " Ἰ(¨)ουστινιανοῦ", '<hi rend="diaeresis">Ἰ</hi>ουστινιανοῦ');
    testTransform(null, " Ἰ(¨)(?)ουστινιανοῦ", '<hi rend="diaeresis">Ἰ<certainty match=".." locus="value"/></hi>ουστινιανοῦ');
    // test with unclears - ex. p.mert.3.125.xml
    testTransform(null, " ạ(¨)bc", '<hi rend="diaeresis"><unclear>a</unclear></hi>bc');
    testTransform(null, " ạ(¨)(?)bc", '<hi rend="diaeresis"><unclear>a</unclear><certainty match=".." locus="value"/></hi>bc');
    testTransform(null, " [.1](¨)", '<hi rend="diaeresis"><gap reason="lost" quantity="1" unit="character"/></hi>');
    testTransform(null, " .1(¨)", '<hi rend="diaeresis"><gap reason="illegible" quantity="1" unit="character"/></hi>');
});

describe("uncertain_diacritical_grave", () => {
    testTransform(null, "abcd e(`)f", 'abcd<hi rend="grave">e</hi>f');
    testTransform(null, " [.1](`)", '<hi rend="grave"><gap reason="lost" quantity="1" unit="character"/></hi>');
    testTransform(null, " .1(`)", '<hi rend="grave"><gap reason="illegible" quantity="1" unit="character"/></hi>');
    testTransform(null, " ἃ̣(`)", '<hi rend="grave"><unclear>ἃ</unclear></hi>');
});


describe("uncertain_diacritical_spiritus_asper", () => {
    // can also be known as greek dasia when combined with space per wikipeidia
    testTransform(null, " a( ῾)bc", '<hi rend="asper">a</hi>bc');
});

describe("uncertain_diacritical_acute", () => {
    testTransform(null, " a(´)bc", '<hi rend="acute">a</hi>bc');
    testTransform(null, " ο(´ ῾)", '<hi rend="acute"><hi rend="asper">ο</hi></hi>');
});

describe("uncertain_diacritical_circumflex", () => {
    testTransform(null, " a(^)bc", '<hi rend="circumflex">a</hi>bc');
    testTransform(null, " ạ(^)bc", '<hi rend="circumflex"><unclear>a</unclear></hi>bc');
});

describe("uncertain_diacritical_spiritus_lenis", () => {
    // can also be known as greek psili when combined with space per wikipeidia
    testTransform(null, " a( ᾿)bc", '<hi rend="lenis">a</hi>bc');
    testTransform(null, " ạ( ᾿)bc", '<hi rend="lenis"><unclear>a</unclear></hi>bc');
});

describe("num_exhaustive", () => {
    testTransform(null,  "<#=14#>", '<num value="14"/>');
    testTransform(null,  "<#=1/4#>", '<num value="1/4"/>');
    testTransform(null,  "<#α=#>", "<num>α</num>");

    testTransform(null,  "<#α=frac#>", '<num type="fraction">α</num>');
    testTransform(null,  "<#ο '=frac#>", '<num type="fraction" rend="tick">ο</num>');
    testTransform(null,  "<#ο '=15#>", '<num value="15" rend="tick">ο</num>');
    testTransform(null,  "<#ο '=1/5#>", '<num value="1/5" rend="tick">ο</num>');
    testTransform(null,  "<#ο '=15(?)#>", '<num value="15" rend="tick">ο<certainty match="../@value" locus="value"/></num>');
    testTransform(null,  "<#ο '=1/5(?)#>", '<num value="1/5" rend="tick">ο<certainty match="../@value" locus="value"/></num>');
    testTransform(null,  "<#ο=15#>", '<num value="15">ο</num>');
    testTransform(null,  "<#ο=1/5#>", '<num value="1/5">ο</num>');
    testTransform(null,  "<#ο=15(?)#>", '<num value="15">ο<certainty match="../@value" locus="value"/></num>');
    testTransform(null,  "<#ο=1/5(?)#>", '<num value="1/5">ο<certainty match="../@value" locus="value"/></num>');
    // myriads below
    testTransform(null,  "<#.1=frac#>", '<num type="fraction"><gap reason="illegible" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#.1ο=frac#>", '<num type="fraction"><gap reason="illegible" quantity="1" unit="character"/>ο</num>');
    testTransform(null,  "<#ι.1=frac#>", '<num type="fraction">ι<gap reason="illegible" quantity="1" unit="character"/></num>');

    testTransform(null,  "<#.1 '=frac#>", '<num type="fraction" rend="tick"><gap reason="illegible" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#.1ο '=frac#>", '<num type="fraction" rend="tick"><gap reason="illegible" quantity="1" unit="character"/>ο</num>');
    testTransform(null,  "<#ι.1 '=frac#>", '<num type="fraction" rend="tick">ι<gap reason="illegible" quantity="1" unit="character"/></num>');

    testTransform(null,  "<#.1 '=16#>", '<num value="16" rend="tick"><gap reason="illegible" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#.1ο '=16#>", '<num value="16" rend="tick"><gap reason="illegible" quantity="1" unit="character"/>ο</num>');
    testTransform(null,  "<#ι.1 '=16#>", '<num value="16" rend="tick">ι<gap reason="illegible" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#.1 '=16(?)#>", '<num value="16" rend="tick"><gap reason="illegible" quantity="1" unit="character"/><certainty match="../@value" locus="value"/></num>');
    testTransform(null,  "<#.1ο '=16(?)#>", '<num value="16" rend="tick"><gap reason="illegible" quantity="1" unit="character"/>ο<certainty match="../@value" locus="value"/></num>');
    testTransform(null,  "<#ι.1 '=16(?)#>", '<num value="16" rend="tick">ι<gap reason="illegible" quantity="1" unit="character"/><certainty match="../@value" locus="value"/></num>');
    testTransform(null,  "<#.1 '=1/6#>", '<num value="1/6" rend="tick"><gap reason="illegible" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#.1ο '=1/6#>", '<num value="1/6" rend="tick"><gap reason="illegible" quantity="1" unit="character"/>ο</num>');
    testTransform(null,  "<#ι.1 '=1/6#>", '<num value="1/6" rend="tick">ι<gap reason="illegible" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#.1 '=1/6(?)#>", '<num value="1/6" rend="tick"><gap reason="illegible" quantity="1" unit="character"/><certainty match="../@value" locus="value"/></num>');
    testTransform(null,  "<#.1ο '=1/6(?)#>", '<num value="1/6" rend="tick"><gap reason="illegible" quantity="1" unit="character"/>ο<certainty match="../@value" locus="value"/></num>');
    testTransform(null,  "<#ι.1 '=1/6(?)#>", '<num value="1/6" rend="tick">ι<gap reason="illegible" quantity="1" unit="character"/><certainty match="../@value" locus="value"/></num>');

    testTransform(null,  "<#.1=16#>", '<num value="16"><gap reason="illegible" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#.1ο=16#>", '<num value="16"><gap reason="illegible" quantity="1" unit="character"/>ο</num>');
    testTransform(null,  "<#ι.1=16#>", '<num value="16">ι<gap reason="illegible" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#.1=16(?)#>", '<num value="16"><gap reason="illegible" quantity="1" unit="character"/><certainty match="../@value" locus="value"/></num>');
    testTransform(null,  "<#.1ο=16(?)#>", '<num value="16"><gap reason="illegible" quantity="1" unit="character"/>ο<certainty match="../@value" locus="value"/></num>');
    testTransform(null,  "<#ι.1=16(?)#>", '<num value="16">ι<gap reason="illegible" quantity="1" unit="character"/><certainty match="../@value" locus="value"/></num>');
    testTransform(null,  "<#.1=1/6#>", '<num value="1/6"><gap reason="illegible" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#.1ο=1/6#>", '<num value="1/6"><gap reason="illegible" quantity="1" unit="character"/>ο</num>');
    testTransform(null,  "<#ι.1=1/6#>", '<num value="1/6">ι<gap reason="illegible" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#.1=1/6(?)#>", '<num value="1/6"><gap reason="illegible" quantity="1" unit="character"/><certainty match="../@value" locus="value"/></num>');
    testTransform(null,  "<#.1ο=1/6(?)#>", '<num value="1/6"><gap reason="illegible" quantity="1" unit="character"/>ο<certainty match="../@value" locus="value"/></num>');
    testTransform(null,  "<#ι.1=1/6(?)#>", '<num value="1/6">ι<gap reason="illegible" quantity="1" unit="character"/><certainty match="../@value" locus="value"/></num>');

    testTransform(null,  "<#ο '=#>", '<num rend="tick">ο</num>');
    testTransform(null,  "<#.1 '=#>", '<num rend="tick"><gap reason="illegible" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#.1ο '=#>", '<num rend="tick"><gap reason="illegible" quantity="1" unit="character"/>ο</num>');
    testTransform(null,  "<#ι.1 '=#>", '<num rend="tick">ι<gap reason="illegible" quantity="1" unit="character"/></num>');

    testTransform(null,  "<#.1=#>", '<num><gap reason="illegible" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#.1ο=#>", '<num><gap reason="illegible" quantity="1" unit="character"/>ο</num>');
    testTransform(null,  "<#ι.1=#>", '<num>ι<gap reason="illegible" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#α=#>", "<num>α</num>");
    // range below

    testTransform(null,  "<#[.1] '=frac#>", '<num type="fraction" rend="tick"><gap reason="lost" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#[.1]ο '=frac#>", '<num type="fraction" rend="tick"><gap reason="lost" quantity="1" unit="character"/>ο</num>');
    testTransform(null,  "<#.2 '=frac#>", '<num type="fraction" rend="tick"><gap reason="illegible" quantity="2" unit="character"/></num>');

    testTransform(null,  "<#[.1]=frac#>", '<num type="fraction"><gap reason="lost" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#[.1]ο=frac#>", '<num type="fraction"><gap reason="lost" quantity="1" unit="character"/>ο</num>');
    testTransform(null,  "<#.2=frac#>", '<num type="fraction"><gap reason="illegible" quantity="2" unit="character"/></num>');

    // orig below
    testTransform(null,  "<#α=1#>", '<num value="1">α</num>');
    testTransform(null,  "<#α=#>", "<num>α</num>");
    //below is only num test changed for empty tag processing
    testTransform(null,  "<#=1#>", '<num value="1"/>');
    testTransform(null,  "<#δ=1/4#>", '<num value="1/4">δ</num>');
    testTransform(null,  "<#ιδ=14#>", '<num value="14">ιδ</num>');
    testTransform(null,  "<#Α=1000(?)#>", '<num value="1000">Α<certainty match="../@value" locus="value"/></num>');
    testTransform(null,  "<#[ι]γ=13(?)#>", '<num value="13"><supplied reason="lost">ι</supplied>γ<certainty match="../@value" locus="value"/></num>');
    testTransform(null,  "[ίως ((ἔτους)) <#ι=10(?)#>  καὶ ]", '<supplied reason="lost">ίως <expan><ex>ἔτους</ex></expan> <num value="10">ι<certainty match="../@value" locus="value"/></num>  καὶ </supplied>');
    testTransform(null,  "<#a=1-9#>", '<num atLeast="1" atMost="9">a</num>');
    testTransform(null,  "<#κ[.1]=20-29#>", '<num atLeast="20" atMost="29">κ<gap reason="lost" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#ι̣=10-19#>", '<num atLeast="10" atMost="19"><unclear>ι</unclear></num>');
    testTransform(null,  "<#a=1-?#>", '<num atLeast="1">a</num>');
    testTransform(null,  "<#κ[.1]=20-?#>", '<num atLeast="20">κ<gap reason="lost" quantity="1" unit="character"/></num>');
    testTransform(null,  "<#ι̣=10-?#>", '<num atLeast="10"><unclear>ι</unclear></num>');
});

describe("num_myriads", () => {
    testTransform(null, "<#μυρίαδες<#β=2#><#Βφ=2500#>=22500#>", '<num value="22500">μυρίαδες<num value="2">β</num><num value="2500">Βφ</num></num>');
});

describe("choice", () => {
    testTransform(null, "<:a|corr|b:>", "<choice><corr>a</corr><sic>b</sic></choice>");
    testTransform(null, "<:a|corr|<:b|corr|c:>:>", "<choice><corr>a</corr><sic><choice><corr>b</corr><sic>c</sic></choice></sic></choice>");
    testTransform(null, "<:a(?)|corr|b:>", '<choice><corr cert="low">a</corr><sic>b</sic></choice>');
    testTransform(null, "<:aạ(?)|corr|bạ:>", '<choice><corr cert="low">a<unclear>a</unclear></corr><sic>b<unclear>a</unclear></sic></choice>');
    testTransform(null, "<:σωλῆνας̣(?)|corr|σηληνας̣:>", '<choice><corr cert="low">σωλῆνα<unclear>ς</unclear></corr><sic>σηληνα<unclear>ς</unclear></sic></choice>');
    testTransform(null, "<:σωλῆνας̣|corr|σηληνας̣(?):>", '<choice><corr>σωλῆνα<unclear>ς</unclear></corr><sic>σηληνα<unclear>ς</unclear><certainty match=".." locus="value"/></sic></choice>');
    testTransform(null, "<:σωλῆνας̣(?)|corr|σηληνας̣(?):>", '<choice><corr cert="low">σωλῆνα<unclear>ς</unclear></corr><sic>σηληνα<unclear>ς</unclear><certainty match=".." locus="value"/></sic></choice>');
    testTransform(null, "<:σωλῆνας̣|corr|σηληνας̣:>", "<choice><corr>σωλῆνα<unclear>ς</unclear></corr><sic>σηληνα<unclear>ς</unclear></sic></choice>");
    testTransform(null, "<:a(?)|corr|<:b|corr|c:>:>", '<choice><corr cert="low">a</corr><sic><choice><corr>b</corr><sic>c</sic></choice></sic></choice>');
    testTransform(null, "<:a|corr|<:b|corr|c(?):>:>", '<choice><corr>a</corr><sic><choice><corr>b</corr><sic>c<certainty match=".." locus="value"/></sic></choice></sic></choice>');
    testTransform(null, "<:<:b|corr|c:>|corr|σηλη:>", "<choice><corr><choice><corr>b</corr><sic>c</sic></choice></corr><sic>σηλη</sic></choice>");
    // new reg stuff
    testTransform(null, "<:a|reg|b:>", "<choice><reg>a</reg><orig>b</orig></choice>");
    testTransform(null, "<:a|reg|<:b|reg|c:>:>", "<choice><reg>a</reg><orig><choice><reg>b</reg><orig>c</orig></choice></orig></choice>");
    testTransform(null, "<:a(?)|reg|b:>", '<choice><reg cert="low">a</reg><orig>b</orig></choice>');
    testTransform(null, "<:aạ(?)|reg|bạ:>", '<choice><reg cert="low">a<unclear>a</unclear></reg><orig>b<unclear>a</unclear></orig></choice>');
    testTransform(null, "<:σωλῆνας̣(?)|reg|σηληνας̣:>", '<choice><reg cert="low">σωλῆνα<unclear>ς</unclear></reg><orig>σηληνα<unclear>ς</unclear></orig></choice>');
    testTransform(null, "<:σωλῆνας̣|reg|σηληνας̣(?):>", '<choice><reg>σωλῆνα<unclear>ς</unclear></reg><orig>σηληνα<unclear>ς</unclear><certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:σωλῆνας̣(?)|reg|σηληνας̣(?):>", '<choice><reg cert="low">σωλῆνα<unclear>ς</unclear></reg><orig>σηληνα<unclear>ς</unclear><certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:σωλῆνας̣|reg|σηληνας̣:>", "<choice><reg>σωλῆνα<unclear>ς</unclear></reg><orig>σηληνα<unclear>ς</unclear></orig></choice>");
    testTransform(null, "<:a(?)|reg|<:b|reg|c:>:>", '<choice><reg cert="low">a</reg><orig><choice><reg>b</reg><orig>c</orig></choice></orig></choice>');
    testTransform(null, "<:a|reg|<:b|reg|c(?):>:>", '<choice><reg>a</reg><orig><choice><reg>b</reg><orig>c<certainty match=".." locus="value"/></orig></choice></orig></choice>');
    testTransform(null, "<:<:b|reg|c:>|reg|σηλη:>", "<choice><reg><choice><reg>b</reg><orig>c</orig></choice></reg><orig>σηλη</orig></choice>");
    //combined
    testTransform(null, "<:a|corr|<:b|reg|c:>:>", "<choice><corr>a</corr><sic><choice><reg>b</reg><orig>c</orig></choice></sic></choice>");
    testTransform(null, "<:<:b|corr|c:>|reg|σηλη:>", "<choice><reg><choice><corr>b</corr><sic>c</sic></choice></reg><orig>σηλη</orig></choice>");
    testTransform(null, "<:a|reg|<:b|corr|c:>:>", "<choice><reg>a</reg><orig><choice><corr>b</corr><sic>c</sic></choice></orig></choice>");
    testTransform(null, "<:<:b|reg|c:>|corr|σηλη:>", "<choice><corr><choice><reg>b</reg><orig>c</orig></choice></corr><sic>σηλη</sic></choice>");
});

describe("mult_regs_no_nattrib_with_tall", () => {
    testTransform(null, "<:James~||Jaymes||~tallJomes|reg|Jeames:>", '<choice><reg>James<hi rend="tall">Jaymes</hi>Jomes</reg><orig>Jeames</orig></choice>');
    testTransform(null, "<:Jon|Jean|Jun|John||reg||Jan:>", "<choice><reg>Jon</reg><reg>Jean</reg><reg>Jun</reg><reg>John</reg><orig>Jan</orig></choice>");
});


describe("mult_regs_no_nattrib", () => {
    testTransform(null, "<:Jon=grc|Jean=ital|Jun=de|John(?)=en||reg||Jan:>", '<choice><reg xml:lang="grc">Jon</reg><reg xml:lang="ital">Jean</reg><reg xml:lang="de">Jun</reg><reg xml:lang="en" cert="low">John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon=grc|John(?)=en||reg||Jan:>", '<choice><reg xml:lang="grc">Jon</reg><reg xml:lang="en" cert="low">John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon(?)=grc|John=en||reg||Jan:>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><reg xml:lang="en">John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon(?)=grc|John(?)=en||reg||Jan:>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><reg xml:lang="en" cert="low">John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon=grc|John=en||reg||Jan:>", '<choice><reg xml:lang="grc">Jon</reg><reg xml:lang="en">John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon|John(?)||reg||Jan:>", '<choice><reg>Jon</reg><reg cert="low">John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon(?)|John||reg||Jan:>", '<choice><reg cert="low">Jon</reg><reg>John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon(?)|John(?)||reg||Jan:>", '<choice><reg cert="low">Jon</reg><reg cert="low">John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon|John||reg||Jan:>", "<choice><reg>Jon</reg><reg>John</reg><orig>Jan</orig></choice>");
    testTransform(null, "<:Jon|John=en||reg||Jan:>", '<choice><reg>Jon</reg><reg xml:lang="en">John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon=grc|John||reg||Jan:>", '<choice><reg xml:lang="grc">Jon</reg><reg>John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon(?)|John=en||reg||Jan:>", '<choice><reg cert="low">Jon</reg><reg xml:lang="en">John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon(?)|John(?)=en||reg||Jan:>", '<choice><reg cert="low">Jon</reg><reg xml:lang="en" cert="low">John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon|John(?)=en||reg||Jan:>", '<choice><reg>Jon</reg><reg xml:lang="en" cert="low">John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon(?)=grc|John||reg||Jan:>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><reg>John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon(?)=grc|John(?)||reg||Jan:>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><reg cert="low">John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon=grc|John(?)||reg||Jan:>", '<choice><reg xml:lang="grc">Jon</reg><reg cert="low">John</reg><orig>Jan</orig></choice>');

});

describe("mult_regs_with_markup_origcert_no_nattrib", () => {
    // all above tests with orig with certainty
    testTransform(null, "<:Jon=grc|Jean=ital|Jun=de|John(?)=en||reg||Jan(?):>", '<choice><reg xml:lang="grc">Jon</reg><reg xml:lang="ital">Jean</reg><reg xml:lang="de">Jun</reg><reg xml:lang="en" cert="low">John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon=grc|John(?)=en||reg||Jan(?):>", '<choice><reg xml:lang="grc">Jon</reg><reg xml:lang="en" cert="low">John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon(?)=grc|John=en||reg||Jan(?):>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><reg xml:lang="en">John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon(?)=grc|John(?)=en||reg||Jan(?):>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><reg xml:lang="en" cert="low">John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon=grc|John=en||reg||Jan(?):>", '<choice><reg xml:lang="grc">Jon</reg><reg xml:lang="en">John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon|John(?)||reg||Jan(?):>", '<choice><reg>Jon</reg><reg cert="low">John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon(?)|John||reg||Jan(?):>", '<choice><reg cert="low">Jon</reg><reg>John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon(?)|John(?)||reg||Jan(?):>", '<choice><reg cert="low">Jon</reg><reg cert="low">John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon|John||reg||Jan(?):>", '<choice><reg>Jon</reg><reg>John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon|John=en||reg||Jan(?):>", '<choice><reg>Jon</reg><reg xml:lang="en">John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon=grc|John||reg||Jan(?):>", '<choice><reg xml:lang="grc">Jon</reg><reg>John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon(?)|John=en||reg||Jan(?):>", '<choice><reg cert="low">Jon</reg><reg xml:lang="en">John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon(?)|John(?)=en||reg||Jan(?):>", '<choice><reg cert="low">Jon</reg><reg xml:lang="en" cert="low">John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon|John(?)=en||reg||Jan(?):>", '<choice><reg>Jon</reg><reg xml:lang="en" cert="low">John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon(?)=grc|John||reg||Jan(?):>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><reg>John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon(?)=grc|John(?)||reg||Jan(?):>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><reg cert="low">John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon=grc|John(?)||reg||Jan(?):>", '<choice><reg xml:lang="grc">Jon</reg><reg cert="low">John</reg><orig>Jan<certainty match=".." locus="value"/></orig></choice>');
});

describe("mult_regs_with_markup_no_nattrib", () => {
    // all above tests with orig being markup
    testTransform(null, "<:Jon=grc|Jean=ital|Jun=de|John(?)=en||reg||[Jan]:>", '<choice><reg xml:lang="grc">Jon</reg><reg xml:lang="ital">Jean</reg><reg xml:lang="de">Jun</reg><reg xml:lang="en" cert="low">John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon=grc|John(?)=en||reg||[Jan]:>", '<choice><reg xml:lang="grc">Jon</reg><reg xml:lang="en" cert="low">John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon(?)=grc|John=en||reg||[Jan]:>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><reg xml:lang="en">John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon(?)=grc|John(?)=en||reg||[Jan]:>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><reg xml:lang="en" cert="low">John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon=grc|John=en||reg||[Jan]:>", '<choice><reg xml:lang="grc">Jon</reg><reg xml:lang="en">John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon|John(?)||reg||[Jan]:>", '<choice><reg>Jon</reg><reg cert="low">John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon(?)|John||reg||[Jan]:>", '<choice><reg cert="low">Jon</reg><reg>John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon(?)|John(?)||reg||[Jan]:>", '<choice><reg cert="low">Jon</reg><reg cert="low">John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon|John||reg||[Jan]:>", '<choice><reg>Jon</reg><reg>John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon|John=en||reg||[Jan]:>", '<choice><reg>Jon</reg><reg xml:lang="en">John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon=grc|John||reg||[Jan]:>", '<choice><reg xml:lang="grc">Jon</reg><reg>John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon(?)|John=en||reg||[Jan]:>", '<choice><reg cert="low">Jon</reg><reg xml:lang="en">John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon(?)|John(?)=en||reg||[Jan]:>", '<choice><reg cert="low">Jon</reg><reg xml:lang="en" cert="low">John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon|John(?)=en||reg||[Jan]:>", '<choice><reg>Jon</reg><reg xml:lang="en" cert="low">John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon(?)=grc|John||reg||[Jan]:>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><reg>John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon(?)=grc|John(?)||reg||[Jan]:>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><reg cert="low">John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon=grc|John(?)||reg||[Jan]:>", '<choice><reg xml:lang="grc">Jon</reg><reg cert="low">John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');

});


describe("mult_regs_nested_etc_no_nattrib", () => {
    // break reg and origs with markup combinations
    testTransform(null, "<:[Jon](?)=grc|[John](?)=en||reg||[Jan]:>", '<choice><reg xml:lang="grc" cert="low"><supplied reason="lost">Jon</supplied></reg><reg xml:lang="en" cert="low"><supplied reason="lost">John</supplied></reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:[Jon]=grc|[John]=en||reg||[Jan]:>", '<choice><reg xml:lang="grc"><supplied reason="lost">Jon</supplied></reg><reg xml:lang="en"><supplied reason="lost">John</supplied></reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:[Jon](?)|[John](?)||reg||[Jan]:>", '<choice><reg cert="low"><supplied reason="lost">Jon</supplied></reg><reg cert="low"><supplied reason="lost">John</supplied></reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:[Jon]|[John]||reg||[Jan]:>", '<choice><reg><supplied reason="lost">Jon</supplied></reg><reg><supplied reason="lost">John</supplied></reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:[.3]=grc|John(?)=en||reg||Jan:>", '<choice><reg xml:lang="grc"><gap reason="lost" quantity="3" unit="character"/></reg><reg xml:lang="en" cert="low">John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon(?)=grc|[.4]=en||reg||Jan:>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><reg xml:lang="en"><gap reason="lost" quantity="4" unit="character"/></reg><orig>Jan</orig></choice>');
    testTransform(null, "<:[.3](?)=grc|John(?)=en||reg||Jan:>", '<choice><reg xml:lang="grc" cert="low"><gap reason="lost" quantity="3" unit="character"/></reg><reg xml:lang="en" cert="low">John</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon|[.4](?)||reg||Jan:>", '<choice><reg>Jon</reg><reg cert="low"><gap reason="lost" quantity="4" unit="character"/></reg><orig>Jan</orig></choice>');
    testTransform(null, "<:[.3]=grc|John(?)=en||reg||[Jan]:>", '<choice><reg xml:lang="grc"><gap reason="lost" quantity="3" unit="character"/></reg><reg xml:lang="en" cert="low">John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon(?)=grc|[.4]=en||reg||[Jan]:>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><reg xml:lang="en"><gap reason="lost" quantity="4" unit="character"/></reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:[.3](?)=grc|John(?)=en||reg||[Jan]:>", '<choice><reg xml:lang="grc" cert="low"><gap reason="lost" quantity="3" unit="character"/></reg><reg xml:lang="en" cert="low">John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon|[.4](?)||reg||[Jan]:>", '<choice><reg>Jon</reg><reg cert="low"><gap reason="lost" quantity="4" unit="character"/></reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:June=BL 1.123|ed|<:Jon|John||reg||Jan:>:>", '<app type="editorial"><lem resp="BL 1.123">June</lem><rdg><choice><reg>Jon</reg><reg>John</reg><orig>Jan</orig></choice></rdg></app>');
    testTransform(null, "<:June=BL 1.123|ed|<:[.3](?)=grc|John(?)=en||reg||[Jan]:>:>", '<app type="editorial"><lem resp="BL 1.123">June</lem><rdg><choice><reg xml:lang="grc" cert="low"><gap reason="lost" quantity="3" unit="character"/></reg><reg xml:lang="en" cert="low">John</reg><orig><supplied reason="lost">Jan</supplied></orig></choice></rdg></app>');
    // Josh adds
    testTransform(null, "<:June=BL 1.123|ed|<:Jon|John(?)||reg||<:Jön|subst|jan:>:>:>", '<app type="editorial"><lem resp="BL 1.123">June</lem><rdg><choice><reg>Jon</reg><reg cert="low">John</reg><orig><subst><add place="inline">Jön</add><del rend="corrected">jan</del></subst></orig></choice></rdg></app>');
    testTransform(null, "<:<:Jun[e]|subst|jan:>=BL 1.123|ed|<:Jon|John(?)||reg||<:Jön|subst|jan:>:>:>", '<app type="editorial"><lem resp="BL 1.123"><subst><add place="inline">Jun<supplied reason="lost">e</supplied></add><del rend="corrected">jan</del></subst></lem><rdg><choice><reg>Jon</reg><reg cert="low">John</reg><orig><subst><add place="inline">Jön</add><del rend="corrected">jan</del></subst></orig></choice></rdg></app>');
    testTransform(null, "<:(Jen(nifer))=BL 4.567|ed|<:<:Jun[e]|subst|jan:>=BL 1.123|ed|<:Jon|John(?)||reg||<:Jön|subst|jan:>:>:>:>", '<app type="editorial"><lem resp="BL 4.567"><expan>Jen<ex>nifer</ex></expan></lem><rdg><app type="editorial"><lem resp="BL 1.123"><subst><add place="inline">Jun<supplied reason="lost">e</supplied></add><del rend="corrected">jan</del></subst></lem><rdg><choice><reg>Jon</reg><reg cert="low">John</reg><orig><subst><add place="inline">Jön</add><del rend="corrected">jan</del></subst></orig></choice></rdg></app></rdg></app>');
    testTransform(null, "<:<:(Jen(nifer))|corr|(Ren(nifer)):>=BL 4.567|ed|<:<:Jun[e]|subst|jan:>=BL 1.123|ed|<:Jon|John(?)||reg||<:Jön|subst|jan:>:>:>:>", '<app type="editorial"><lem resp="BL 4.567"><choice><corr><expan>Jen<ex>nifer</ex></expan></corr><sic><expan>Ren<ex>nifer</ex></expan></sic></choice></lem><rdg><app type="editorial"><lem resp="BL 1.123"><subst><add place="inline">Jun<supplied reason="lost">e</supplied></add><del rend="corrected">jan</del></subst></lem><rdg><choice><reg>Jon</reg><reg cert="low">John</reg><orig><subst><add place="inline">Jön</add><del rend="corrected">jan</del></subst></orig></choice></rdg></app></rdg></app>');
});

describe("reg_with_lang", () => {
    testTransform(null, "<:Jon(?)=grc|reg|Jan:>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon(?)=grc|reg|[Jan](?):>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><orig><supplied reason="lost">Jan</supplied><certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon(?)=grc|reg|[Jan]:>", '<choice><reg xml:lang="grc" cert="low">Jon</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:[Jon](?)=grc|reg|Jan:>", '<choice><reg xml:lang="grc" cert="low"><supplied reason="lost">Jon</supplied></reg><orig>Jan</orig></choice>');
    testTransform(null, "<:[Jon](?)=grc|reg|[Jan](?):>", '<choice><reg xml:lang="grc" cert="low"><supplied reason="lost">Jon</supplied></reg><orig><supplied reason="lost">Jan</supplied><certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:[Jon](?)=grc|reg|[Jan]:>", '<choice><reg xml:lang="grc" cert="low"><supplied reason="lost">Jon</supplied></reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon=grc|reg|Jan:>", '<choice><reg xml:lang="grc">Jon</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon=grc|reg|[Jan](?):>", '<choice><reg xml:lang="grc">Jon</reg><orig><supplied reason="lost">Jan</supplied><certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon=grc|reg|[Jan]:>", '<choice><reg xml:lang="grc">Jon</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:[Jon]=grc|reg|Jan:>", '<choice><reg xml:lang="grc"><supplied reason="lost">Jon</supplied></reg><orig>Jan</orig></choice>');
    testTransform(null, "<:[Jon]=grc|reg|[Jan](?):>", '<choice><reg xml:lang="grc"><supplied reason="lost">Jon</supplied></reg><orig><supplied reason="lost">Jan</supplied><certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:[Jon]=grc|reg|[Jan]:>", '<choice><reg xml:lang="grc"><supplied reason="lost">Jon</supplied></reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    // above tests without lang attribute
    testTransform(null, "<:Jon(?)|reg|Jan:>", '<choice><reg cert="low">Jon</reg><orig>Jan</orig></choice>');
    testTransform(null, "<:Jon(?)|reg|[Jan](?):>", '<choice><reg cert="low">Jon</reg><orig><supplied reason="lost">Jan</supplied><certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon(?)|reg|[Jan]:>", '<choice><reg cert="low">Jon</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:[Jon](?)|reg|Jan:>", '<choice><reg cert="low"><supplied reason="lost">Jon</supplied></reg><orig>Jan</orig></choice>');
    testTransform(null, "<:[Jon](?)|reg|[Jan](?):>", '<choice><reg cert="low"><supplied reason="lost">Jon</supplied></reg><orig><supplied reason="lost">Jan</supplied><certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:[Jon](?)|reg|[Jan]:>", '<choice><reg cert="low"><supplied reason="lost">Jon</supplied></reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:Jon|reg|Jan:>", "<choice><reg>Jon</reg><orig>Jan</orig></choice>");
    testTransform(null, "<:Jon|reg|[Jan](?):>", '<choice><reg>Jon</reg><orig><supplied reason="lost">Jan</supplied><certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:Jon|reg|[Jan]:>", '<choice><reg>Jon</reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
    testTransform(null, "<:[Jon]|reg|Jan:>", '<choice><reg><supplied reason="lost">Jon</supplied></reg><orig>Jan</orig></choice>');
    testTransform(null, "<:[Jon]|reg|[Jan](?):>", '<choice><reg><supplied reason="lost">Jon</supplied></reg><orig><supplied reason="lost">Jan</supplied><certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "<:[Jon]|reg|[Jan]:>", '<choice><reg><supplied reason="lost">Jon</supplied></reg><orig><supplied reason="lost">Jan</supplied></orig></choice>');
});

describe("subst", () => {
    testTransform(null, "<:Silvanus(?)|subst|silvanos(?):>", '<subst><add place="inline">Silvanus<certainty match=".." locus="value"/></add><del rend="corrected">silvanos<certainty match=".." locus="value"/></del></subst>');
    testTransform(null, "<:a|subst|b:>", '<subst><add place="inline">a</add><del rend="corrected">b</del></subst>');
    testTransform(null, "<:abcd(?)|subst|b:>", '<subst><add place="inline">abcd<certainty match=".." locus="value"/></add><del rend="corrected">b</del></subst>');
    testTransform(null, "<:τὸ̣|subst|τα (?):>", '<subst><add place="inline">τ<unclear>ὸ</unclear></add><del rend="corrected">τα <certainty match=".." locus="value"/></del></subst>');
    testTransform(null, "<:τὸ̣(?)|subst|τα :>", '<subst><add place="inline">τ<unclear>ὸ</unclear><certainty match=".." locus="value"/></add><del rend="corrected">τα </del></subst>');
    testTransform(null, "<:τὸ̣(?)|subst|τα (?):>", '<subst><add place="inline">τ<unclear>ὸ</unclear><certainty match=".." locus="value"/></add><del rend="corrected">τα <certainty match=".." locus="value"/></del></subst>');
});

describe("app_lem", () => {
    testTransform(null, "<:[μου][μάμ]μη|alt|[.5][διδύ(?)]μη(?):>", '<app type="alternative"><lem><supplied reason="lost">μου</supplied><supplied reason="lost">μάμ</supplied>μη</lem><rdg><gap reason="lost" quantity="5" unit="character"/><supplied reason="lost" cert="low">διδύ</supplied>μη<certainty match=".." locus="value"/></rdg></app>');
    testTransform(null, "<:[καθ]ὰ(?)|alt|[.2]α:>", '<app type="alternative"><lem><supplied reason="lost">καθ</supplied>ὰ<certainty match=".." locus="value"/></lem><rdg><gap reason="lost" quantity="2" unit="character"/>α</rdg></app>');
    testTransform(null, "<:σ̣υ̣μβολικά(?)|alt|[.2]α(?):>", '<app type="alternative"><lem><unclear>συ</unclear>μβολικά<certainty match=".." locus="value"/></lem><rdg><gap reason="lost" quantity="2" unit="character"/>α<certainty match=".." locus="value"/></rdg></app>');
    testTransform(null, "<:〚κ〛 (?)|alt|:>", '<app type="alternative"><lem><del rend="erasure">κ</del> <certainty match=".." locus="value"/></lem><rdg/></app>');
    testTransform(null, "<:|alt|〚κ〛 (?):>", '<app type="alternative"><lem/><rdg><del rend="erasure">κ</del> <certainty match=".." locus="value"/></rdg></app>');
});

describe("alt", () => {
    testTransform(null, "<:[μου][μάμ]μη|alt|[.5][διδύ(?)]μη(?):>", '<app type="alternative"><lem><supplied reason="lost">μου</supplied><supplied reason="lost">μάμ</supplied>μη</lem><rdg><gap reason="lost" quantity="5" unit="character"/><supplied reason="lost" cert="low">διδύ</supplied>μη<certainty match=".." locus="value"/></rdg></app>');
    testTransform(null, "<:[καθ]ὰ(?)|alt|[.2]α:>", '<app type="alternative"><lem><supplied reason="lost">καθ</supplied>ὰ<certainty match=".." locus="value"/></lem><rdg><gap reason="lost" quantity="2" unit="character"/>α</rdg></app>');
    testTransform(null, "<:σ̣υ̣μβολικά(?)|alt|[.2]α(?):>", '<app type="alternative"><lem><unclear>συ</unclear>μβολικά<certainty match=".." locus="value"/></lem><rdg><gap reason="lost" quantity="2" unit="character"/>α<certainty match=".." locus="value"/></rdg></app>');
    testTransform(null, "<:〚κ〛 (?)|alt|:>", '<app type="alternative"><lem><del rend="erasure">κ</del> <certainty match=".." locus="value"/></lem><rdg/></app>');
    testTransform(null, "<:|alt|〚κ〛 (?):>", '<app type="alternative"><lem/><rdg><del rend="erasure">κ</del> <certainty match=".." locus="value"/></rdg></app>');
});

describe("mult_alt_rdgs", () => {
    testTransform(null, "<:James Jaymes Jomes|alt|Jeames:>", '<app type="alternative"><lem>James Jaymes Jomes</lem><rdg>Jeames</rdg></app>');
    testTransform(null, "<:Jan||alt||Jon|Jean|Jun|John:>", '<app type="alternative"><lem>Jan</lem><rdg>Jon</rdg><rdg>Jean</rdg><rdg>Jun</rdg><rdg>John</rdg></app>');
    testTransform(null, "<:Jan||alt||Jon(?)|Jean|Jun(?)|John:>", '<app type="alternative"><lem>Jan</lem><rdg>Jon<certainty match=".." locus="value"/></rdg><rdg>Jean</rdg><rdg>Jun<certainty match=".." locus="value"/></rdg><rdg>John</rdg></app>');
    testTransform(null, "<:J[a]n||alt||J[o]n|Jean|Jun|Jo[h]n:>", '<app type="alternative"><lem>J<supplied reason="lost">a</supplied>n</lem><rdg>J<supplied reason="lost">o</supplied>n</rdg><rdg>Jean</rdg><rdg>Jun</rdg><rdg>Jo<supplied reason="lost">h</supplied>n</rdg></app>');
    testTransform(null, "<:J[a]n||alt||J[o]n(?)|Jean|Jun(?)|Jo[h]n:>", '<app type="alternative"><lem>J<supplied reason="lost">a</supplied>n</lem><rdg>J<supplied reason="lost">o</supplied>n<certainty match=".." locus="value"/></rdg><rdg>Jean</rdg><rdg>Jun<certainty match=".." locus="value"/></rdg><rdg>Jo<supplied reason="lost">h</supplied>n</rdg></app>');
    testTransform(null, "<:Jan(?)||alt||Jon|Jean|Jun|John:>", '<app type="alternative"><lem>Jan<certainty match=".." locus="value"/></lem><rdg>Jon</rdg><rdg>Jean</rdg><rdg>Jun</rdg><rdg>John</rdg></app>');
    testTransform(null, "<:Jan(?)||alt||Jon(?)|Jean|Jun(?)|John:>", '<app type="alternative"><lem>Jan<certainty match=".." locus="value"/></lem><rdg>Jon<certainty match=".." locus="value"/></rdg><rdg>Jean</rdg><rdg>Jun<certainty match=".." locus="value"/></rdg><rdg>John</rdg></app>');
    testTransform(null, "<:J[a]n(?)||alt||J[o]n|Jean|Jun|Jo[h]n:>", '<app type="alternative"><lem>J<supplied reason="lost">a</supplied>n<certainty match=".." locus="value"/></lem><rdg>J<supplied reason="lost">o</supplied>n</rdg><rdg>Jean</rdg><rdg>Jun</rdg><rdg>Jo<supplied reason="lost">h</supplied>n</rdg></app>');
    testTransform(null, "<:J[a]n(?)||alt||J[o]n(?)|Jean|Jun(?)|Jo[h]n:>", '<app type="alternative"><lem>J<supplied reason="lost">a</supplied>n<certainty match=".." locus="value"/></lem><rdg>J<supplied reason="lost">o</supplied>n<certainty match=".." locus="value"/></rdg><rdg>Jean</rdg><rdg>Jun<certainty match=".." locus="value"/></rdg><rdg>Jo<supplied reason="lost">h</supplied>n</rdg></app>');
});

describe("mult_alt_rdgs_with_tall", () => {
    testTransform(null, "<:Jeames|alt|James~||Jaymes||~tallJomes:>", '<app type="alternative"><lem>Jeames</lem><rdg>James<hi rend="tall">Jaymes</hi>Jomes</rdg></app>');
    testTransform(null, "<:Jeames||alt||Jimes|James~||Jaymes||~tallJomes:>", '<app type="alternative"><lem>Jeames</lem><rdg>Jimes</rdg><rdg>James<hi rend="tall">Jaymes</hi>Jomes</rdg></app>');
});

// below commented out in xsugar suite
/*
=begin # Hugh start of commented new app lem with resp= test
  def test_new_alternative
    #new ed format
    assert_equal_fragment_transform '<:a=bgu 3 p.4|alt|b:>', '<app type="alternative"><lem resp="bgu 3 p.4">a</lem><rdg>b</rdg></app>'
    assert_equal_fragment_transform '<:[μου][μάμ]μη=2.14|alt|[.5][διδύ(?)]μη(?):>', '<app type="alternative"><lem resp="2.14"><supplied reason="lost">μου</supplied><supplied reason="lost">μάμ</supplied>μη</lem><rdg><gap reason="lost" quantity="5" unit="character"/><supplied reason="lost" cert="low">διδύ</supplied>μη<certainty match=".." locus="value"/></rdg></app>'
    assert_equal_fragment_transform '<:[καθ]ὰ(?)=bgu 1 p.357|alt|[.2]α:>', '<app type="alternative"><lem resp="bgu 1 p.357"><supplied reason="lost">καθ</supplied>ὰ<certainty match=".." locus="value"/></lem><rdg><gap reason="lost" quantity="2" unit="character"/>α</rdg></app>'
    assert_equal_fragment_transform '<:σ̣υ̣μβολικά(?)=1.27|alt|[.2]α(?):>', '<app type="alternative"><lem resp="1.27"><unclear>συ</unclear>μβολικά<certainty match=".." locus="value"/></lem><rdg><gap reason="lost" quantity="2" unit="character"/>α<certainty match=".." locus="value"/></rdg></app>'
    assert_equal_fragment_transform '<:〚κ〛 (?)=1.24|alt|:>', '<app type="alternative"><lem resp="1.24"><del rend="erasure">κ</del> <certainty match=".." locus="value"/></lem><rdg/></app>'
    assert_equal_fragment_transform '<:〚κ〛 =1.24|alt|:>', '<app type="alternative"><lem resp="1.24"><del rend="erasure">κ</del> </lem><rdg/></app>'
    assert_equal_fragment_transform '<:[μου][μάμ]μη|alt|[.5][διδύ(?)]μη(?):>', '<app type="alternative"><lem><supplied reason="lost">μου</supplied><supplied reason="lost">μάμ</supplied>μη</lem><rdg><gap reason="lost" quantity="5" unit="character"/><supplied reason="lost" cert="low">διδύ</supplied>μη<certainty match=".." locus="value"/></rdg></app>'
    assert_equal_fragment_transform '<:[καθ]ὰ(?)|alt|[.2]α:>', '<app type="alternative"><lem><supplied reason="lost">καθ</supplied>ὰ<certainty match=".." locus="value"/></lem><rdg><gap reason="lost" quantity="2" unit="character"/>α</rdg></app>'
    assert_equal_fragment_transform '<:σ̣υ̣μβολικά(?)|alt|[.2]α(?):>', '<app type="alternative"><lem><unclear>συ</unclear>μβολικά<certainty match=".." locus="value"/></lem><rdg><gap reason="lost" quantity="2" unit="character"/>α<certainty match=".." locus="value"/></rdg></app>'
    assert_equal_fragment_transform '<:〚κ〛 (?)|alt|:>', '<app type="alternative"><lem><del rend="erasure">κ</del> <certainty match=".." locus="value"/></lem><rdg/></app>'
    assert_equal_fragment_transform '<:〚κ〛 |alt|:>', '<app type="alternative"><lem><del rend="erasure">κ</del> </lem><rdg/></app>'
    #new SoSOL format
    assert_equal_fragment_transform '<:πέπρα 23.- κα ὡς <(πρόκ(ειται))>. (ἔγ(ρα))ψα Μύσ̣θη̣ς (Μέλαν(ος)) <(ὑπ(ὲρ))> (αὐ̣(τοῦ)) μὴ (εἰδ̣(ότος)) (γρ(άμματα))=SoSOL Cowey|alt|.4κ̣.3εγψα.4.4.2:>', '<app type="alternative"><lem resp="SoSOL Cowey">πέπρα <lb n="23" break="no"/>κα ὡς <supplied reason="omitted"><expan>πρόκ<ex>ειται</ex></expan></supplied>. <expan>ἔγ<ex>ρα</ex></expan>ψα Μύ<unclear>σ</unclear>θ<unclear>η</unclear>ς <expan>Μέλαν<ex>ος</ex></expan> <supplied reason="omitted"><expan>ὑπ<ex>ὲρ</ex></expan></supplied> <expan>α<unclear>ὐ</unclear><ex>τοῦ</ex></expan> μὴ <expan>εἰ<unclear>δ</unclear><ex>ότος</ex></expan> <expan>γρ<ex>άμματα</ex></expan></lem><rdg><gap reason="illegible" quantity="4" unit="character"/><unclear>κ</unclear><gap reason="illegible" quantity="3" unit="character"/>εγψα<gap reason="illegible" quantity="4" unit="character"/><gap reason="illegible" quantity="4" unit="character"/><gap reason="illegible" quantity="2" unit="character"/></rdg></app>'
    assert_equal_fragment_transform '<:[.?]<#λβ=32#> .2 ἐκ <((ταλάντων))> <#κζ=27#> <((δραχμῶν))> <#Γ=3000#> ((τάλαντα)) <#ωοθ=879#> <((δραχμαὶ))> <#Γσ=3200#>=SoSOL Sosin|alt|[.?]<#λβ=32#> <#𐅵 \'=1/2#> <#ιβ \'=1/12#> ἐκ ((ταλάντων)) <#ζ=7#> <#Γ=3000#> ((τάλαντα)) <#ωοθ=879#> <#η \'=1/8(?)#>:>', '<app type="alternative"><lem resp="SoSOL Sosin"><gap reason="lost" extent="unknown" unit="character"/><num value="32">λβ</num> <gap reason="illegible" quantity="2" unit="character"/> ἐκ <supplied reason="omitted"><expan><ex>ταλάντων</ex></expan></supplied> <num value="27">κζ</num> <supplied reason="omitted"><expan><ex>δραχμῶν</ex></expan></supplied> <num value="3000">Γ</num> <expan><ex>τάλαντα</ex></expan> <num value="879">ωοθ</num> <supplied reason="omitted"><expan><ex>δραχμαὶ</ex></expan></supplied> <num value="3200">Γσ</num></lem><rdg><gap reason="lost" extent="unknown" unit="character"/><num value="32">λβ</num> <num value="1/2" rend="tick">𐅵</num> <num value="1/12" rend="tick">ιβ</num> ἐκ <expan><ex>ταλάντων</ex></expan> <num value="7">ζ</num> <num value="3000">Γ</num> <expan><ex>τάλαντα</ex></expan> <num value="879">ωοθ</num> <num value="1/8" rend="tick">η<certainty match="../@value" locus="value"/></num></rdg></app>'
    assert_equal_fragment_transform '<:〚(Λεόντ(ιος)) (Σεν̣ο̣[υθί(ου)])[ Σενουθίου ][.?] 〛=SoSOL Ast|alt|(Σενούθ(ιος)) \vestig / (Σενουθ(ίου)) vestig :>', '<app type="alternative"><lem resp="SoSOL Ast"><del rend="erasure"><expan>Λεόντ<ex>ιος</ex></expan> <expan>Σε<unclear>νο</unclear><supplied reason="lost">υθί<ex>ου</ex></supplied></expan><supplied reason="lost"> Σενουθίου </supplied><gap reason="lost" extent="unknown" unit="character"/> </del></lem><rdg><expan>Σενούθ<ex>ιος</ex></expan> <add place="above"><gap reason="illegible" extent="unknown" unit="character"><desc>vestiges</desc></gap></add> <expan>Σενουθ<ex>ίου</ex></expan> <gap reason="illegible" extent="unknown" unit="character"><desc>vestiges</desc></gap></rdg></app>'
    assert_equal_fragment_transform '<:<#α=1#>\|<#ι=10#>|/ <#α=1#>\|<#ξ=60#>|/ <#α=1#>\|<#ρκ=120#>|/=SoSOL Cayless|alt|<#β=2#> <#𐅵 \'=1/2#> <#ξδ \'=1/64#>:>', '<app type="alternative"><lem resp="SoSOL Cayless"><num value="1">α</num><hi rend="subscript"><num value="10">ι</num></hi> <num value="1">α</num><hi rend="subscript"><num value="60">ξ</num></hi> <num value="1">α</num><hi rend="subscript"><num value="120">ρκ</num></hi></lem><rdg><num value="2">β</num> <num value="1/2" rend="tick">𐅵</num> <num value="1/64" rend="tick">ξδ</num></rdg></app>'
    assert_equal_fragment_transform '<:καὶ <:<καν(?)>ονικῶν(?)|corr|ονι̣κ̣ων:>=SoSOL Elliott|alt|καιονι̣κ̣ων:>', '<app type="alternative"><lem resp="SoSOL Elliott">καὶ <choice><corr cert="low"><supplied reason="omitted" cert="low">καν</supplied>ονικῶν</corr><sic>ον<unclear>ικ</unclear>ων</sic></choice></lem><rdg>καιον<unclear>ικ</unclear>ων</rdg></app>'
    assert_equal_fragment_transform '<:[καὶ ὧν δε]κάτη [27]<#β=2#>=SoSOL Gabby|alt|[.6]ων.2[.2]<#β=2#>:>', '<app type="alternative"><lem resp="SoSOL Gabby"><supplied reason="lost">καὶ ὧν δε</supplied>κάτη <supplied reason="lost">27</supplied><num value="2">β</num></lem><rdg><gap reason="lost" quantity="6" unit="character"/>ων<gap reason="illegible" quantity="2" unit="character"/><gap reason="lost" quantity="2" unit="character"/><num value="2">β</num></rdg></app>'
    assert_equal_fragment_transform '<:(Κών̣ων̣(ος))=SoSOL Fox|alt|Κω.2ω <:vestig |corr|*monogram*:>:>', '<app type="alternative"><lem resp="SoSOL Fox"><expan>Κώ<unclear>ν</unclear>ω<unclear>ν</unclear><ex>ος</ex></expan></lem><rdg>Κω<gap reason="illegible" quantity="2" unit="character"/>ω <choice><corr><gap reason="illegible" extent="unknown" unit="character"><desc>vestiges</desc></gap></corr><sic><g type="monogram"/></sic></choice></rdg></app>'
    assert_equal_fragment_transform '\<:.3(|ομ|)=SoSOL Sosin|alt|ε.1ε.2:>/', '<add place="above"><app type="alternative"><lem resp="SoSOL Sosin"><gap reason="illegible" quantity="3" unit="character"/><abbr>ομ</abbr></lem><rdg>ε<gap reason="illegible" quantity="1" unit="character"/>ε<gap reason="illegible" quantity="2" unit="character"/></rdg></app></add>'
    #new BL format
    assert_equal_fragment_transform '<:a=BL 1.215|alt|b:>', '<app type="alternative"><lem resp="BL 1.215">a</lem><rdg>b</rdg></app>'
    assert_equal_fragment_transform '<:[μου][μάμ]μη=BL 2.14|alt|[.5][διδύ(?)]μη(?):>', '<app type="alternative"><lem resp="BL 2.14"><supplied reason="lost">μου</supplied><supplied reason="lost">μάμ</supplied>μη</lem><rdg><gap reason="lost" quantity="5" unit="character"/><supplied reason="lost" cert="low">διδύ</supplied>μη<certainty match=".." locus="value"/></rdg></app>'
    assert_equal_fragment_transform '<:σ̣υ̣μβολικά(?)=BL 1.27|alt|η̣μο.2:>', '<app type="alternative"><lem resp="BL 1.27"><unclear>συ</unclear>μβολικά<certainty match=".." locus="value"/></lem><rdg><unclear>η</unclear>μο<gap reason="illegible" quantity="2" unit="character"/></rdg></app>'
    assert_equal_fragment_transform '<:σ̣υ̣μβολικά(?)=BL 1.27|alt|[.2]α(?):>', '<app type="alternative"><lem resp="BL 1.27"><unclear>συ</unclear>μβολικά<certainty match=".." locus="value"/></lem><rdg><gap reason="lost" quantity="2" unit="character"/>α<certainty match=".." locus="value"/></rdg></app>'
    assert_equal_fragment_transform '<:〚κ〛 (?)=BL 1.24|alt|:>', '<app type="alternative"><lem resp="BL 1.24"><del rend="erasure">κ</del> <certainty match=".." locus="value"/></lem><rdg/></app>'
    #
    assert_equal_fragment_transform '<:ὑπηR 8.- [ρετῶ]ν=bgu 3 p.1|alt|[.7]ν:>', '<app type="alternative"><lem resp="bgu 3 p.1">ὑπηR <lb n="8" break="no"/><supplied reason="lost">ρετῶ</supplied>ν</lem><rdg><gap reason="lost" quantity="7" unit="character"/>ν</rdg></app>'
    assert_equal_fragment_transform '<:Πα[νε]φρόμ 23.- μεως|alt|Πα[νε]φρέμμεως:>', '<app type="alternative"><lem>Πα<supplied reason="lost">νε</supplied>φρόμ <lb n="23" break="no"/>μεως</lem><rdg>Πα<supplied reason="lost">νε</supplied>φρέμμεως</rdg></app>'
    assert_equal_fragment_transform '<:Πα[νε]φρόμ (2.-, inverse)μεως|alt|Πα[νε]φρέμμεως:>', '<app type="alternative"><lem>Πα<supplied reason="lost">νε</supplied>φρόμ <lb n="2" rend="inverse" break="no"/>μεως</lem><rdg>Πα<supplied reason="lost">νε</supplied>φρέμμεως</rdg></app>'
    assert_equal_fragment_transform '<:στρ[ατηγὸς]=BL 12.2|alt|Συ̣ρ[ίων]:>', '<app type="alternative"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>'
    assert_equal_fragment_transform '<:στρ[ατηγὸς](?)=BL 12.2|alt|Συ̣ρ[ίων]:>', '<app type="alternative"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied><certainty match=".." locus="value"/></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>'
    assert_equal_fragment_transform '<:στρ[ατηγὸς]=SoSOL 12.2|alt|Συ̣ρ[ίων]:>', '<app type="alternative"><lem resp="SoSOL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>'
    assert_equal_fragment_transform '<:στρ[ατηγὸς](?)=SoSOL 12.2|alt|Συ̣ρ[ίων]:>', '<app type="alternative"><lem resp="SoSOL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied><certainty match=".." locus="value"/></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>'
    assert_equal_fragment_transform '<:στρ[ατηγὸς]|alt|Συ̣ρ[ίων]:>', '<app type="alternative"><lem>στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>'
    assert_equal_fragment_transform '<:στρ[ατηγὸς](?)|alt|Συ̣ρ[ίων]:>', '<app type="alternative"><lem>στρ<supplied reason="lost">ατηγὸς</supplied><certainty match=".." locus="value"/></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>'
    #
    assert_equal_fragment_transform '<:στρ[ατηγὸς]=BL 10.5 (R. Ast, CdE 100 (2020) 13-15)|alt|Συ̣ρ[ίων]=Original Edition:>', '<app type="alternative"><lem resp="BL 10.5 (R. Ast, CdE 100 (2020) 13-15)">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg resp="Original Edition">Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>'
    assert_equal_fragment_transform '<:στρ[ατηγὸς]=BL 10.5 (R. Ast, CdE 100 (2020) 13-15)|alt|Συ̣ρ[ίων]:>', '<app type="alternative"><lem resp="BL 10.5 (R. Ast, CdE 100 (2020) 13-15)">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>'
    #
    assert_equal_fragment_transform '<:στρ[ατηλάτης]=J. Cowey, ZPE 123 (1999) 321-323|alt|Συ̣ρ[ίων]=Original Edition:>', '<app type="alternative"><lem resp="J. Cowey, ZPE 123 (1999) 321-323">στρ<supplied reason="lost">ατηλάτης</supplied></lem><rdg resp="Original Edition">Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>'
    assert_equal_fragment_transform '<:στρ[ατηλάτης]=J. Cowey, ZPE 123 (1999) 321-323|alt|Συ̣ρ[ίων]:>', '<app type="alternative"><lem resp="J. Cowey, ZPE 123 (1999) 321-323">στρ<supplied reason="lost">ατηλάτης</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>'
    #
    assert_equal_fragment_transform '<:στρ[ατηγὸς]=BL 12.2|alt|Συ̣ρ[ίων]=Original Edition:>', '<app type="alternative"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg resp="Original Edition">Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>'
    #
    assert_equal_fragment_transform '<:Στρ[άβων]=SoSOL J. Sosin (autopsy)|alt|Συ̣ρ[ίων]=Original Edition:>', '<app type="alternative"><lem resp="SoSOL J. Sosin (autopsy)">Στρ<supplied reason="lost">άβων</supplied></lem><rdg resp="Original Edition">Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>'
    assert_equal_fragment_transform '<:Στρ[άβων]=SoSOL J. Sosin (autopsy)|alt|Συ̣ρ[ίων]:>', '<app type="alternative"><lem resp="SoSOL J. Sosin (autopsy)">Στρ<supplied reason="lost">άβων</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>'
    #
    assert_equal_fragment_transform '<:στρ[ατηγὸς]=BL 12.2||alt||στρ[ατηλάτης]=J. Cowey, ZPE 123 (1999) 321-323|στρ[ατιώτης]=BL 10.5 (R. Ast, CdE 100 (2020) 13-15)|Στρ[άβων]=SoSOL Sosin|Συ̣ρ[ίων]=Original Edition:>', '<app type="alternative"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg resp="J. Cowey, ZPE 123 (1999) 321-323">στρ<supplied reason="lost">ατηλάτης</supplied></rdg><rdg resp="BL 10.5 (R. Ast, CdE 100 (2020) 13-15)">στρ<supplied reason="lost">ατιώτης</supplied></rdg><rdg resp="SoSOL Sosin">Στρ<supplied reason="lost">άβων</supplied></rdg><rdg resp="Original Edition">Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>'
    #
    assert_equal_fragment_transform '<:στρ[ατηγὸς]=BL 12.2||alt||στρ[ατηλάτης]=J. Cowey, ZPE 123 (1999) 321-323|<:στρ[ατιώτης]|reg|στυ̣ρ[ατιώτης]:>=BL 10.5 (R. Ast, CdE 100 (2020) 13-15)|Συ̣ρ[ίων]=Original Edition:>', '<app type="alternative"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg resp="J. Cowey, ZPE 123 (1999) 321-323">στρ<supplied reason="lost">ατηλάτης</supplied></rdg><rdg resp="BL 10.5 (R. Ast, CdE 100 (2020) 13-15)"><choice><reg>στρ<supplied reason="lost">ατιώτης</supplied></reg><orig>στ<unclear>υ</unclear>ρ<supplied reason="lost">ατιώτης</supplied></orig></choice></rdg><rdg resp="Original Edition">Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>'
    #
    assert_equal_fragment_transform '<:στρ[ατηγὸς]=BL 12.2||alt||<:στρ[ατηλάτης]|alt|στρ[ιππερς]:>=J. Cowey, ZPE 123 (1999) 321-323|<:στρ[ατιώτης]|reg|στυ̣ρ[ατιώτης]:>=BL 10.5 (R. Ast, CdE 100 (2020) 13-15)|Συ̣ρ[ίων]=Original Edition:>', '<app type="alternative"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg resp="J. Cowey, ZPE 123 (1999) 321-323"><app type="alternative"><lem>στρ<supplied reason="lost">ατηλάτης</supplied></lem><rdg>στρ<supplied reason="lost">ιππερς</supplied></rdg></app></rdg><rdg resp="BL 10.5 (R. Ast, CdE 100 (2020) 13-15)"><choice><reg>στρ<supplied reason="lost">ατιώτης</supplied></reg><orig>στ<unclear>υ</unclear>ρ<supplied reason="lost">ατιώτης</supplied></orig></choice></rdg><rdg resp="Original Edition">Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>'
    #
    assert_equal_fragment_transform '<:στρ[ατηγὸς](?)=BL 12.2||alt||<:στρ[ατηλάτης]|alt|στρ[ιππερς]:>(?)=J. Cowey, ZPE 123 (1999) 321-323|<:στρ[ατιώτης]|reg|στυ̣ρ[ατιώτης]:>(?)=BL 10.5 (R. Ast, CdE 100 (2020) 13-15)|Συ̣ρ[ίων](?)=Original Edition:>', '<app type="alternative"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied><certainty match=".." locus="value"/></lem><rdg resp="J. Cowey, ZPE 123 (1999) 321-323"><app type="alternative"><lem>στρ<supplied reason="lost">ατηλάτης</supplied></lem><rdg>στρ<supplied reason="lost">ιππερς</supplied></rdg></app><certainty match=".." locus="value"/></rdg><rdg resp="BL 10.5 (R. Ast, CdE 100 (2020) 13-15)"><choice><reg>στρ<supplied reason="lost">ατιώτης</supplied></reg><orig>στ<unclear>υ</unclear>ρ<supplied reason="lost">ατιώτης</supplied></orig></choice><certainty match=".." locus="value"/></rdg><rdg resp="Original Edition">Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied><certainty match=".." locus="value"/></rdg></app>'
    #
    assert_equal_fragment_transform '<:στρ[ατηγὸς]=BL 12.2|alt|Συ̣ρ[ίων](?):>', '<app type="alternative"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied><certainty match=".." locus="value"/></rdg></app>'
    assert_equal_fragment_transform '<:στρ[ατηγὸς](?)=BL 12.2|alt|Συ̣ρ[ίων](?):>', '<app type="alternative"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied><certainty match=".." locus="value"/></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied><certainty match=".." locus="value"/></rdg></app>'
    assert_equal_fragment_transform '<:στρ[ατηγὸς]=SoSOL 12.2|alt|Συ̣ρ[ίων](?):>', '<app type="alternative"><lem resp="SoSOL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied><certainty match=".." locus="value"/></rdg></app>'
    assert_equal_fragment_transform '<:στρ[ατηγὸς](?)=SoSOL 12.2|alt|Συ̣ρ[ίων](?):>', '<app type="alternative"><lem resp="SoSOL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied><certainty match=".." locus="value"/></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied><certainty match=".." locus="value"/></rdg></app>'
    assert_equal_fragment_transform '<:στρ[ατηγὸς]|alt|Συ̣ρ[ίων](?):>', '<app type="alternative"><lem>στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied><certainty match=".." locus="value"/></rdg></app>'
    assert_equal_fragment_transform '<:στρ[ατηγὸς](?)|alt|Συ̣ρ[ίων](?):>', '<app type="alternative"><lem>στρ<supplied reason="lost">ατηγὸς</supplied><certainty match=".." locus="value"/></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied><certainty match=".." locus="value"/></rdg></app>'
    #
    assert_equal_fragment_transform '<:a=BL 1.215|alt|b:>', '<app type="alternative"><lem resp="BL 1.215">a</lem><rdg>b</rdg></app>'
    assert_equal_fragment_transform '<:a=SoSOL 1.215|alt|b:>', '<app type="alternative"><lem resp="SoSOL 1.215">a</lem><rdg>b</rdg></app>'
    assert_equal_fragment_transform '<:a=J. Cowey, ZPE 123 (1999) 321-323|alt|b:>', '<app type="alternative"><lem resp="J. Cowey, ZPE 123 (1999) 321-323">a</lem><rdg>b</rdg></app>'
    assert_equal_fragment_transform '<:a=BL 1.215|alt|:>', '<app type="alternative"><lem resp="BL 1.215">a</lem><rdg/></app>'
    assert_equal_fragment_transform '<:a=BL 1.215|alt|=Original Editor:>', '<app type="alternative"><lem resp="BL 1.215">a</lem><rdg resp="Original Editor"/></app>'
    assert_equal_fragment_transform '<:=BL 1.215|alt|b:>', '<app type="alternative"><lem resp="BL 1.215"/><rdg>b</rdg></app>'
    assert_equal_fragment_transform '<:|alt|b:>', '<app type="alternative"><lem/><rdg>b</rdg></app>'
  end
=end # Hugh end of commented new app lem with resp= test

 */


describe("new_editorial", () => {
    // new ed format
    testTransform(null, "<:a=bgu 3 p.4|ed|b:>", '<app type="editorial"><lem resp="bgu 3 p.4">a</lem><rdg>b</rdg></app>');
    testTransform(null, "<:[μου][μάμ]μη=2.14|ed|[.5][διδύ(?)]μη(?):>", '<app type="editorial"><lem resp="2.14"><supplied reason="lost">μου</supplied><supplied reason="lost">μάμ</supplied>μη</lem><rdg><gap reason="lost" quantity="5" unit="character"/><supplied reason="lost" cert="low">διδύ</supplied>μη<certainty match=".." locus="value"/></rdg></app>');
    testTransform(null, "<:[καθ]ὰ(?)=bgu 1 p.357|ed|[.2]α:>", '<app type="editorial"><lem resp="bgu 1 p.357"><supplied reason="lost">καθ</supplied>ὰ<certainty match=".." locus="value"/></lem><rdg><gap reason="lost" quantity="2" unit="character"/>α</rdg></app>');
    testTransform(null, "<:σ̣υ̣μβολικά(?)=1.27|ed|[.2]α(?):>", '<app type="editorial"><lem resp="1.27"><unclear>συ</unclear>μβολικά<certainty match=".." locus="value"/></lem><rdg><gap reason="lost" quantity="2" unit="character"/>α<certainty match=".." locus="value"/></rdg></app>');
    testTransform(null, "<:〚κ〛 (?)=1.24|ed|:>", '<app type="editorial"><lem resp="1.24"><del rend="erasure">κ</del> <certainty match=".." locus="value"/></lem><rdg/></app>');
    testTransform(null, "<:〚κ〛 =1.24|ed|:>", '<app type="editorial"><lem resp="1.24"><del rend="erasure">κ</del> </lem><rdg/></app>');
    testTransform(null, "<:[μου][μάμ]μη|ed|[.5][διδύ(?)]μη(?):>", '<app type="editorial"><lem><supplied reason="lost">μου</supplied><supplied reason="lost">μάμ</supplied>μη</lem><rdg><gap reason="lost" quantity="5" unit="character"/><supplied reason="lost" cert="low">διδύ</supplied>μη<certainty match=".." locus="value"/></rdg></app>');
    testTransform(null, "<:[καθ]ὰ(?)|ed|[.2]α:>", '<app type="editorial"><lem><supplied reason="lost">καθ</supplied>ὰ<certainty match=".." locus="value"/></lem><rdg><gap reason="lost" quantity="2" unit="character"/>α</rdg></app>');
    testTransform(null, "<:σ̣υ̣μβολικά(?)|ed|[.2]α(?):>", '<app type="editorial"><lem><unclear>συ</unclear>μβολικά<certainty match=".." locus="value"/></lem><rdg><gap reason="lost" quantity="2" unit="character"/>α<certainty match=".." locus="value"/></rdg></app>');
    testTransform(null, "<:〚κ〛 (?)|ed|:>", '<app type="editorial"><lem><del rend="erasure">κ</del> <certainty match=".." locus="value"/></lem><rdg/></app>');
    testTransform(null, "<:〚κ〛 |ed|:>", '<app type="editorial"><lem><del rend="erasure">κ</del> </lem><rdg/></app>');
    // new SoSOL format
    testTransform(null, "<:πέπρα 23.- κα ὡς <(πρόκ(ειται))>. (ἔγ(ρα))ψα Μύσ̣θη̣ς (Μέλαν(ος)) <(ὑπ(ὲρ))> (αὐ̣(τοῦ)) μὴ (εἰδ̣(ότος)) (γρ(άμματα))=SoSOL Cowey|ed|.4κ̣.3εγψα.4.4.2:>", '<app type="editorial"><lem resp="SoSOL Cowey">πέπρα <lb n="23" break="no"/>κα ὡς <supplied reason="omitted"><expan>πρόκ<ex>ειται</ex></expan></supplied>. <expan>ἔγ<ex>ρα</ex></expan>ψα Μύ<unclear>σ</unclear>θ<unclear>η</unclear>ς <expan>Μέλαν<ex>ος</ex></expan> <supplied reason="omitted"><expan>ὑπ<ex>ὲρ</ex></expan></supplied> <expan>α<unclear>ὐ</unclear><ex>τοῦ</ex></expan> μὴ <expan>εἰ<unclear>δ</unclear><ex>ότος</ex></expan> <expan>γρ<ex>άμματα</ex></expan></lem><rdg><gap reason="illegible" quantity="4" unit="character"/><unclear>κ</unclear><gap reason="illegible" quantity="3" unit="character"/>εγψα<gap reason="illegible" quantity="4" unit="character"/><gap reason="illegible" quantity="4" unit="character"/><gap reason="illegible" quantity="2" unit="character"/></rdg></app>');
    testTransform(null, "<:[.?]<#λβ=32#> .2 ἐκ <((ταλάντων))> <#κζ=27#> <((δραχμῶν))> <#Γ=3000#> ((τάλαντα)) <#ωοθ=879#> <((δραχμαὶ))> <#Γσ=3200#>=SoSOL Sosin|ed|[.?]<#λβ=32#> <#𐅵 '=1/2#> <#ιβ '=1/12#> ἐκ ((ταλάντων)) <#ζ=7#> <#Γ=3000#> ((τάλαντα)) <#ωοθ=879#> <#η '=1/8(?)#>:>", '<app type="editorial"><lem resp="SoSOL Sosin"><gap reason="lost" extent="unknown" unit="character"/><num value="32">λβ</num> <gap reason="illegible" quantity="2" unit="character"/> ἐκ <supplied reason="omitted"><expan><ex>ταλάντων</ex></expan></supplied> <num value="27">κζ</num> <supplied reason="omitted"><expan><ex>δραχμῶν</ex></expan></supplied> <num value="3000">Γ</num> <expan><ex>τάλαντα</ex></expan> <num value="879">ωοθ</num> <supplied reason="omitted"><expan><ex>δραχμαὶ</ex></expan></supplied> <num value="3200">Γσ</num></lem><rdg><gap reason="lost" extent="unknown" unit="character"/><num value="32">λβ</num> <num value="1/2" rend="tick">𐅵</num> <num value="1/12" rend="tick">ιβ</num> ἐκ <expan><ex>ταλάντων</ex></expan> <num value="7">ζ</num> <num value="3000">Γ</num> <expan><ex>τάλαντα</ex></expan> <num value="879">ωοθ</num> <num value="1/8" rend="tick">η<certainty match="../@value" locus="value"/></num></rdg></app>');
    testTransform(null, "<:〚(Λεόντ(ιος)) (Σεν̣ο̣[υθί(ου)])[ Σενουθίου ][.?] 〛=SoSOL Ast|ed|(Σενούθ(ιος)) \\vestig / (Σενουθ(ίου)) vestig :>", '<app type="editorial"><lem resp="SoSOL Ast"><del rend="erasure"><expan>Λεόντ<ex>ιος</ex></expan> <expan>Σε<unclear>νο</unclear><supplied reason="lost">υθί<ex>ου</ex></supplied></expan><supplied reason="lost"> Σενουθίου </supplied><gap reason="lost" extent="unknown" unit="character"/> </del></lem><rdg><expan>Σενούθ<ex>ιος</ex></expan> <add place="above"><gap reason="illegible" extent="unknown" unit="character"><desc>vestiges</desc></gap></add> <expan>Σενουθ<ex>ίου</ex></expan> <gap reason="illegible" extent="unknown" unit="character"><desc>vestiges</desc></gap></rdg></app>');
    testTransform(null, "<:<#α=1#>\\|<#ι=10#>|/ <#α=1#>\\|<#ξ=60#>|/ <#α=1#>\\|<#ρκ=120#>|/=SoSOL Cayless|ed|<#β=2#> <#𐅵 '=1/2#> <#ξδ '=1/64#>:>", '<app type="editorial"><lem resp="SoSOL Cayless"><num value="1">α</num><hi rend="subscript"><num value="10">ι</num></hi> <num value="1">α</num><hi rend="subscript"><num value="60">ξ</num></hi> <num value="1">α</num><hi rend="subscript"><num value="120">ρκ</num></hi></lem><rdg><num value="2">β</num> <num value="1/2" rend="tick">𐅵</num> <num value="1/64" rend="tick">ξδ</num></rdg></app>');
    testTransform(null, "<:καὶ <:<καν(?)>ονικῶν(?)|corr|ονι̣κ̣ων:>=SoSOL Elliott|ed|καιονι̣κ̣ων:>", '<app type="editorial"><lem resp="SoSOL Elliott">καὶ <choice><corr cert="low"><supplied reason="omitted" cert="low">καν</supplied>ονικῶν</corr><sic>ον<unclear>ικ</unclear>ων</sic></choice></lem><rdg>καιον<unclear>ικ</unclear>ων</rdg></app>');
    testTransform(null, "<:[καὶ ὧν δε]κάτη [27]<#β=2#>=SoSOL Gabby|ed|[.6]ων.2[.2]<#β=2#>:>", '<app type="editorial"><lem resp="SoSOL Gabby"><supplied reason="lost">καὶ ὧν δε</supplied>κάτη <supplied reason="lost">27</supplied><num value="2">β</num></lem><rdg><gap reason="lost" quantity="6" unit="character"/>ων<gap reason="illegible" quantity="2" unit="character"/><gap reason="lost" quantity="2" unit="character"/><num value="2">β</num></rdg></app>');
    testTransform(null, "<:(Κών̣ων̣(ος))=SoSOL Fox|ed|Κω.2ω <:vestig |corr|*monogram*:>:>", '<app type="editorial"><lem resp="SoSOL Fox"><expan>Κώ<unclear>ν</unclear>ω<unclear>ν</unclear><ex>ος</ex></expan></lem><rdg>Κω<gap reason="illegible" quantity="2" unit="character"/>ω <choice><corr><gap reason="illegible" extent="unknown" unit="character"><desc>vestiges</desc></gap></corr><sic><g type="monogram"/></sic></choice></rdg></app>');
    testTransform(null, "\\<:.3(|ομ|)=SoSOL Sosin|ed|ε.1ε.2:>/", '<add place="above"><app type="editorial"><lem resp="SoSOL Sosin"><gap reason="illegible" quantity="3" unit="character"/><abbr>ομ</abbr></lem><rdg>ε<gap reason="illegible" quantity="1" unit="character"/>ε<gap reason="illegible" quantity="2" unit="character"/></rdg></app></add>');
    // new BL format
    testTransform(null, "<:a=BL 1.215|ed|b:>", '<app type="editorial"><lem resp="BL 1.215">a</lem><rdg>b</rdg></app>');
    testTransform(null, "<:[μου][μάμ]μη=BL 2.14|ed|[.5][διδύ(?)]μη(?):>", '<app type="editorial"><lem resp="BL 2.14"><supplied reason="lost">μου</supplied><supplied reason="lost">μάμ</supplied>μη</lem><rdg><gap reason="lost" quantity="5" unit="character"/><supplied reason="lost" cert="low">διδύ</supplied>μη<certainty match=".." locus="value"/></rdg></app>');
    testTransform(null, "<:σ̣υ̣μβολικά(?)=BL 1.27|ed|η̣μο.2:>", '<app type="editorial"><lem resp="BL 1.27"><unclear>συ</unclear>μβολικά<certainty match=".." locus="value"/></lem><rdg><unclear>η</unclear>μο<gap reason="illegible" quantity="2" unit="character"/></rdg></app>');
    testTransform(null, "<:σ̣υ̣μβολικά(?)=BL 1.27|ed|[.2]α(?):>", '<app type="editorial"><lem resp="BL 1.27"><unclear>συ</unclear>μβολικά<certainty match=".." locus="value"/></lem><rdg><gap reason="lost" quantity="2" unit="character"/>α<certainty match=".." locus="value"/></rdg></app>');
    testTransform(null, "<:〚κ〛 (?)=BL 1.24|ed|:>", '<app type="editorial"><lem resp="BL 1.24"><del rend="erasure">κ</del> <certainty match=".." locus="value"/></lem><rdg/></app>');
//
    testTransform(null, "<:ὑπηR 8.- [ρετῶ]ν=bgu 3 p.1|ed|[.7]ν:>", '<app type="editorial"><lem resp="bgu 3 p.1">ὑπηR <lb n="8" break="no"/><supplied reason="lost">ρετῶ</supplied>ν</lem><rdg><gap reason="lost" quantity="7" unit="character"/>ν</rdg></app>');
    testTransform(null, "<:Πα[νε]φρόμ 23.- μεως|ed|Πα[νε]φρέμμεως:>", '<app type="editorial"><lem>Πα<supplied reason="lost">νε</supplied>φρόμ <lb n="23" break="no"/>μεως</lem><rdg>Πα<supplied reason="lost">νε</supplied>φρέμμεως</rdg></app>');
    testTransform(null, "<:Πα[νε]φρόμ (2.-, inverse)μεως|ed|Πα[νε]φρέμμεως:>", '<app type="editorial"><lem>Πα<supplied reason="lost">νε</supplied>φρόμ <lb n="2" rend="inverse" break="no"/>μεως</lem><rdg>Πα<supplied reason="lost">νε</supplied>φρέμμεως</rdg></app>');
    testTransform(null, "<:στρ[ατηγὸς]=BL 12.2|ed|Συ̣ρ[ίων]:>", '<app type="editorial"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>');
    testTransform(null, "<:στρ[ατηγὸς](?)=BL 12.2|ed|Συ̣ρ[ίων]:>", '<app type="editorial"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied><certainty match=".." locus="value"/></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>');
    testTransform(null, "<:στρ[ατηγὸς]=SoSOL 12.2|ed|Συ̣ρ[ίων]:>", '<app type="editorial"><lem resp="SoSOL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>');
    testTransform(null, "<:στρ[ατηγὸς](?)=SoSOL 12.2|ed|Συ̣ρ[ίων]:>", '<app type="editorial"><lem resp="SoSOL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied><certainty match=".." locus="value"/></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>');
    testTransform(null, "<:στρ[ατηγὸς]|ed|Συ̣ρ[ίων]:>", '<app type="editorial"><lem>στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>');
    testTransform(null, "<:στρ[ατηγὸς](?)|ed|Συ̣ρ[ίων]:>", '<app type="editorial"><lem>στρ<supplied reason="lost">ατηγὸς</supplied><certainty match=".." locus="value"/></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>');
//
    testTransform(null, "<:στρ[ατηγὸς]=BL 10.5 (R. Ast, CdE 100 (2020) 13-15)|ed|Συ̣ρ[ίων]=Original Edition:>", '<app type="editorial"><lem resp="BL 10.5 (R. Ast, CdE 100 (2020) 13-15)">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg resp="Original Edition">Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>');
    testTransform(null, "<:στρ[ατηγὸς]=BL 10.5 (R. Ast, CdE 100 (2020) 13-15)|ed|Συ̣ρ[ίων]:>", '<app type="editorial"><lem resp="BL 10.5 (R. Ast, CdE 100 (2020) 13-15)">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>');
//
    testTransform(null, "<:στρ[ατηλάτης]=J. Cowey, ZPE 123 (1999) 321-323|ed|Συ̣ρ[ίων]=Original Edition:>", '<app type="editorial"><lem resp="J. Cowey, ZPE 123 (1999) 321-323">στρ<supplied reason="lost">ατηλάτης</supplied></lem><rdg resp="Original Edition">Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>');
    testTransform(null, "<:στρ[ατηλάτης]=J. Cowey, ZPE 123 (1999) 321-323|ed|Συ̣ρ[ίων]:>", '<app type="editorial"><lem resp="J. Cowey, ZPE 123 (1999) 321-323">στρ<supplied reason="lost">ατηλάτης</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>');
//
    testTransform(null, "<:στρ[ατηγὸς]=BL 12.2|ed|Συ̣ρ[ίων]=Original Edition:>", '<app type="editorial"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg resp="Original Edition">Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>');
//
    testTransform(null, "<:Στρ[άβων]=SoSOL J. Sosin (autopsy)|ed|Συ̣ρ[ίων]=Original Edition:>", '<app type="editorial"><lem resp="SoSOL J. Sosin (autopsy)">Στρ<supplied reason="lost">άβων</supplied></lem><rdg resp="Original Edition">Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>');
    testTransform(null, "<:Στρ[άβων]=SoSOL J. Sosin (autopsy)|ed|Συ̣ρ[ίων]:>", '<app type="editorial"><lem resp="SoSOL J. Sosin (autopsy)">Στρ<supplied reason="lost">άβων</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>');
//
    testTransform(null, "<:στρ[ατηγὸς]=BL 12.2||ed||στρ[ατηλάτης]=J. Cowey, ZPE 123 (1999) 321-323|στρ[ατιώτης]=BL 10.5 (R. Ast, CdE 100 (2020) 13-15)|Στρ[άβων]=SoSOL Sosin|Συ̣ρ[ίων]=Original Edition:>", '<app type="editorial"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg resp="J. Cowey, ZPE 123 (1999) 321-323">στρ<supplied reason="lost">ατηλάτης</supplied></rdg><rdg resp="BL 10.5 (R. Ast, CdE 100 (2020) 13-15)">στρ<supplied reason="lost">ατιώτης</supplied></rdg><rdg resp="SoSOL Sosin">Στρ<supplied reason="lost">άβων</supplied></rdg><rdg resp="Original Edition">Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>');
//
    testTransform(null, "<:στρ[ατηγὸς]=BL 12.2||ed||στρ[ατηλάτης]=J. Cowey, ZPE 123 (1999) 321-323|<:στρ[ατιώτης]|reg|στυ̣ρ[ατιώτης]:>=BL 10.5 (R. Ast, CdE 100 (2020) 13-15)|Συ̣ρ[ίων]=Original Edition:>", '<app type="editorial"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg resp="J. Cowey, ZPE 123 (1999) 321-323">στρ<supplied reason="lost">ατηλάτης</supplied></rdg><rdg resp="BL 10.5 (R. Ast, CdE 100 (2020) 13-15)"><choice><reg>στρ<supplied reason="lost">ατιώτης</supplied></reg><orig>στ<unclear>υ</unclear>ρ<supplied reason="lost">ατιώτης</supplied></orig></choice></rdg><rdg resp="Original Edition">Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>');
//
    testTransform(null, "<:στρ[ατηγὸς]=BL 12.2||ed||<:στρ[ατηλάτης]|alt|στρ[ιππερς]:>=J. Cowey, ZPE 123 (1999) 321-323|<:στρ[ατιώτης]|reg|στυ̣ρ[ατιώτης]:>=BL 10.5 (R. Ast, CdE 100 (2020) 13-15)|Συ̣ρ[ίων]=Original Edition:>", '<app type="editorial"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg resp="J. Cowey, ZPE 123 (1999) 321-323"><app type="alternative"><lem>στρ<supplied reason="lost">ατηλάτης</supplied></lem><rdg>στρ<supplied reason="lost">ιππερς</supplied></rdg></app></rdg><rdg resp="BL 10.5 (R. Ast, CdE 100 (2020) 13-15)"><choice><reg>στρ<supplied reason="lost">ατιώτης</supplied></reg><orig>στ<unclear>υ</unclear>ρ<supplied reason="lost">ατιώτης</supplied></orig></choice></rdg><rdg resp="Original Edition">Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied></rdg></app>');
//
    testTransform(null, "<:στρ[ατηγὸς](?)=BL 12.2||ed||<:στρ[ατηλάτης]|alt|στρ[ιππερς]:>(?)=J. Cowey, ZPE 123 (1999) 321-323|<:στρ[ατιώτης]|reg|στυ̣ρ[ατιώτης]:>(?)=BL 10.5 (R. Ast, CdE 100 (2020) 13-15)|Συ̣ρ[ίων](?)=Original Edition:>", '<app type="editorial"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied><certainty match=".." locus="value"/></lem><rdg resp="J. Cowey, ZPE 123 (1999) 321-323"><app type="alternative"><lem>στρ<supplied reason="lost">ατηλάτης</supplied></lem><rdg>στρ<supplied reason="lost">ιππερς</supplied></rdg></app><certainty match=".." locus="value"/></rdg><rdg resp="BL 10.5 (R. Ast, CdE 100 (2020) 13-15)"><choice><reg>στρ<supplied reason="lost">ατιώτης</supplied></reg><orig>στ<unclear>υ</unclear>ρ<supplied reason="lost">ατιώτης</supplied></orig></choice><certainty match=".." locus="value"/></rdg><rdg resp="Original Edition">Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied><certainty match=".." locus="value"/></rdg></app>');
//
    testTransform(null, "<:στρ[ατηγὸς]=BL 12.2|ed|Συ̣ρ[ίων](?):>", '<app type="editorial"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied><certainty match=".." locus="value"/></rdg></app>');
    testTransform(null, "<:στρ[ατηγὸς](?)=BL 12.2|ed|Συ̣ρ[ίων](?):>", '<app type="editorial"><lem resp="BL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied><certainty match=".." locus="value"/></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied><certainty match=".." locus="value"/></rdg></app>');
    testTransform(null, "<:στρ[ατηγὸς]=SoSOL 12.2|ed|Συ̣ρ[ίων](?):>", '<app type="editorial"><lem resp="SoSOL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied><certainty match=".." locus="value"/></rdg></app>');
    testTransform(null, "<:στρ[ατηγὸς](?)=SoSOL 12.2|ed|Συ̣ρ[ίων](?):>", '<app type="editorial"><lem resp="SoSOL 12.2">στρ<supplied reason="lost">ατηγὸς</supplied><certainty match=".." locus="value"/></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied><certainty match=".." locus="value"/></rdg></app>');
    testTransform(null, "<:στρ[ατηγὸς]|ed|Συ̣ρ[ίων](?):>", '<app type="editorial"><lem>στρ<supplied reason="lost">ατηγὸς</supplied></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied><certainty match=".." locus="value"/></rdg></app>');
    testTransform(null, "<:στρ[ατηγὸς](?)|ed|Συ̣ρ[ίων](?):>", '<app type="editorial"><lem>στρ<supplied reason="lost">ατηγὸς</supplied><certainty match=".." locus="value"/></lem><rdg>Σ<unclear>υ</unclear>ρ<supplied reason="lost">ίων</supplied><certainty match=".." locus="value"/></rdg></app>');
//
    testTransform(null, "<:a=BL 1.215|ed|b:>", '<app type="editorial"><lem resp="BL 1.215">a</lem><rdg>b</rdg></app>');
    testTransform(null, "<:a=SoSOL 1.215|ed|b:>", '<app type="editorial"><lem resp="SoSOL 1.215">a</lem><rdg>b</rdg></app>');
    testTransform(null, "<:a=J. Cowey, ZPE 123 (1999) 321-323|ed|b:>", '<app type="editorial"><lem resp="J. Cowey, ZPE 123 (1999) 321-323">a</lem><rdg>b</rdg></app>');
    testTransform(null, "<:a=BL 1.215|ed|:>", '<app type="editorial"><lem resp="BL 1.215">a</lem><rdg/></app>');
    testTransform(null, "<:a=BL 1.215|ed|=Original Editor:>", '<app type="editorial"><lem resp="BL 1.215">a</lem><rdg resp="Original Editor"/></app>');
    testTransform(null, "<:=BL 1.215|ed|b:>", '<app type="editorial"><lem resp="BL 1.215"/><rdg>b</rdg></app>');
    testTransform(null, "<:|ed|b:>", '<app type="editorial"><lem/><rdg>b</rdg></app>');

});

describe("glyph", () => {
    testTransform(null, "*stauros*", '<g type="stauros"/>');
    testTransform(null, "*stauros,♱*", '<g type="stauros">♱</g>');
    testTransform(null, "*stauros?,♱*", '<unclear><g type="stauros">♱</g></unclear>');
    // fails EpiDoc validation
    // testTransform(null, '*stauros?,♱̣*', '<unclear><g type="stauros"><unclear>♱</unclear></g></unclear>');
    // failsEpidoc validation
    // testTransform(null, '*stauros,♱̣*', '<g type="stauros"><unclear>♱</unclear></g>');
    testTransform(null, "*filler(extension)*", '<g rend="extension" type="filler"/>');
    testTransform(null, "*mid-punctus*", '<g type="mid-punctus"/>');
    testTransform(null, "*mid-punctus?*", '<unclear><g type="mid-punctus"/></unclear>');
    testTransform(null, "*filler(extension)?*", '<unclear><g rend="extension" type="filler"/></unclear>');
});

describe("hand_shift", () => {
    testTransform(null, "$m2(?) ", '<handShift new="m2" cert="low"/>');
    testTransform(null, "$m22(?) ", '<handShift new="m22" cert="low"/>');
    testTransform(null, "$m2b(?) ", '<handShift new="m2b" cert="low"/>');
    testTransform(null, "[$m5(?)  ]", '<supplied reason="lost"><handShift new="m5" cert="low"/> </supplied>');
    testTransform(null, "$m1 ", '<handShift new="m1"/>');
    testTransform(null, "$m20 ", '<handShift new="m20"/>');
    testTransform(null, "$m1a ", '<handShift new="m1a"/>');
    testTransform(null, "[$m5  ]", '<supplied reason="lost"><handShift new="m5"/> </supplied>');
});

describe("add_place_marginal", () => {
    testTransform(null, "<|ν|>", '<add rend="sling" place="margin">ν</add>');
    testTransform(null, "<|.1|>", '<add rend="sling" place="margin"><gap reason="illegible" quantity="1" unit="character"/></add>');
});

describe("space", () => {
    testTransform(null, "vac.?", '<space extent="unknown" unit="character"/>');
    testTransform(null, "vac.?(?) ", '<space extent="unknown" unit="character"><certainty match=".." locus="name"/></space>');
    testTransform(null, "vac.3", '<space quantity="3" unit="character"/>');
    testTransform(null, "vac.3(?) ", '<space quantity="3" unit="character"><certainty match=".." locus="name"/></space>');
    testTransform(null, "vac.2-5", '<space atLeast="2" atMost="5" unit="character"/>');
    testTransform(null, "vac.2-5(?) ", '<space atLeast="2" atMost="5" unit="character"><certainty match=".." locus="name"/></space>');
    testTransform(null, "vac.ca.3", '<space quantity="3" unit="character" precision="low"/>');
    testTransform(null, "vac.ca.3(?) ", '<space quantity="3" unit="character" precision="low"><certainty match=".." locus="name"/></space>');
    testTransform(null, "vac.?lin", '<space extent="unknown" unit="line"/>');
    testTransform(null, "vac.?lin(?) ", '<space extent="unknown" unit="line"><certainty match=".." locus="name"/></space>');
    testTransform(null, "vac.3lin", '<space quantity="3" unit="line"/>');
    testTransform(null, "vac.3lin(?) ", '<space quantity="3" unit="line"><certainty match=".." locus="name"/></space>');
    testTransform(null, "vac.2-5lin", '<space atLeast="2" atMost="5" unit="line"/>');
    testTransform(null, "vac.2-5lin(?) ", '<space atLeast="2" atMost="5" unit="line"><certainty match=".." locus="name"/></space>');
    testTransform(null, "vac.ca.3lin", '<space quantity="3" unit="line" precision="low"/>');
    testTransform(null, "vac.ca.3lin(?) ", '<space quantity="3" unit="line" precision="low"><certainty match=".." locus="name"/></space>');
});


describe("supplied_lost_space", () => {
    testTransform(null, "[vac.? .4-5]", '<supplied reason="lost"><space extent="unknown" unit="character"/> <gap reason="illegible" atLeast="4" atMost="5" unit="character"/></supplied>');  //worked with ANYMULT tweak
    testTransform(null, "[vac.?(?)  .4-5]", '<supplied reason="lost"><space extent="unknown" unit="character"><certainty match=".." locus="name"/></space> <gap reason="illegible" atLeast="4" atMost="5" unit="character"/></supplied>');
    testTransform(null, "[εὶρ .2 vac.?]", '<supplied reason="lost">εὶρ <gap reason="illegible" quantity="2" unit="character"/> <space extent="unknown" unit="character"/></supplied>'); // worked with ANYMULT tweak)
    testTransform(null, "[εὶρ .2 vac.?(?) ]", '<supplied reason="lost">εὶρ <gap reason="illegible" quantity="2" unit="character"/> <space extent="unknown" unit="character"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[ροι. vac.?]", '<supplied reason="lost">ροι. <space extent="unknown" unit="character"/></supplied>');
    testTransform(null, "[ς. vac.?]", '<supplied reason="lost">ς. <space extent="unknown" unit="character"/></supplied>');
    testTransform(null, "[ρίδος. vac.?]", '<supplied reason="lost">ρίδος. <space extent="unknown" unit="character"/></supplied>');
    testTransform(null, "[ρίδος. vac.?(?) ]", '<supplied reason="lost">ρίδος. <space extent="unknown" unit="character"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[εἰδυίας. vac.?]", '<supplied reason="lost">εἰδυίας. <space extent="unknown" unit="character"/></supplied>');
    testTransform(null, "[ομοῦ αὐτῆς vac.?]", '<supplied reason="lost">ομοῦ αὐτῆς <space extent="unknown" unit="character"/></supplied>');
    testTransform(null, "[ομοῦ αὐτῆς vac.?(?) ]", '<supplied reason="lost">ομοῦ αὐτῆς <space extent="unknown" unit="character"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[ωκα. vac.?]", '<supplied reason="lost">ωκα. <space extent="unknown" unit="character"/></supplied>');
    testTransform(null, "[θαι vac.?]", '<supplied reason="lost">θαι <space extent="unknown" unit="character"/></supplied>');
    testTransform(null, "[θαι vac.? εὶρ]", '<supplied reason="lost">θαι <space extent="unknown" unit="character"/> εὶρ</supplied>');
    testTransform(null, "[θαι vac.?(?)  εὶρ]", '<supplied reason="lost">θαι <space extent="unknown" unit="character"><certainty match=".." locus="name"/></space> εὶρ</supplied>');
    testTransform(null, "[vac.?]", '<supplied reason="lost"><space extent="unknown" unit="character"/></supplied>');
    testTransform(null, "[vac.?(?) ]", '<supplied reason="lost"><space extent="unknown" unit="character"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[vac.3]", '<supplied reason="lost"><space quantity="3" unit="character"/></supplied>');
    testTransform(null, "[vac.3(?) ]", '<supplied reason="lost"><space quantity="3" unit="character"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[vac.2-5]", '<supplied reason="lost"><space atLeast="2" atMost="5" unit="character"/></supplied>');
    testTransform(null, "[vac.2-5(?) ]", '<supplied reason="lost"><space atLeast="2" atMost="5" unit="character"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[vac.ca.3]", '<supplied reason="lost"><space quantity="3" unit="character" precision="low"/></supplied>');
    testTransform(null, "[vac.ca.3(?) ]", '<supplied reason="lost"><space quantity="3" unit="character" precision="low"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[vac.?lin]", '<supplied reason="lost"><space extent="unknown" unit="line"/></supplied>');
    testTransform(null, "[vac.?lin(?) ]", '<supplied reason="lost"><space extent="unknown" unit="line"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[vac.3lin]", '<supplied reason="lost"><space quantity="3" unit="line"/></supplied>');
    testTransform(null, "[vac.3lin(?) ]", '<supplied reason="lost"><space quantity="3" unit="line"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[vac.2-5lin]", '<supplied reason="lost"><space atLeast="2" atMost="5" unit="line"/></supplied>');
    testTransform(null, "[vac.2-5lin(?) ]", '<supplied reason="lost"><space atLeast="2" atMost="5" unit="line"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[vac.ca.3lin]", '<supplied reason="lost"><space quantity="3" unit="line" precision="low"/></supplied>');
    testTransform(null, "[vac.ca.3lin(?) ]", '<supplied reason="lost"><space quantity="3" unit="line" precision="low"><certainty match=".." locus="name"/></space></supplied>');
    // dup above with cert low on supplied
    testTransform(null, "[vac.? .4-5(?)]", '<supplied reason="lost" cert="low"><space extent="unknown" unit="character"/> <gap reason="illegible" atLeast="4" atMost="5" unit="character"/></supplied>'); //  #worked with ANYMULT tweak
    testTransform(null, "[vac.?(?)  .4-5(?)]", '<supplied reason="lost" cert="low"><space extent="unknown" unit="character"><certainty match=".." locus="name"/></space> <gap reason="illegible" atLeast="4" atMost="5" unit="character"/></supplied>');
    testTransform(null, "[εὶρ .2 vac.?(?)]", '<supplied reason="lost" cert="low">εὶρ <gap reason="illegible" quantity="2" unit="character"/> <space extent="unknown" unit="character"/></supplied>'); //  #worked with ANYMULT tweak
    testTransform(null, "[εὶρ .2 vac.?(?) (?)]", '<supplied reason="lost" cert="low">εὶρ <gap reason="illegible" quantity="2" unit="character"/> <space extent="unknown" unit="character"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[ροι. vac.?(?)]", '<supplied reason="lost" cert="low">ροι. <space extent="unknown" unit="character"/></supplied>');
    testTransform(null, "[ς. vac.?(?)]", '<supplied reason="lost" cert="low">ς. <space extent="unknown" unit="character"/></supplied>');
    testTransform(null, "[ρίδος. vac.?(?)]", '<supplied reason="lost" cert="low">ρίδος. <space extent="unknown" unit="character"/></supplied>');
    testTransform(null, "[ρίδος. vac.?(?) (?)]", '<supplied reason="lost" cert="low">ρίδος. <space extent="unknown" unit="character"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[εἰδυίας. vac.?(?)]", '<supplied reason="lost" cert="low">εἰδυίας. <space extent="unknown" unit="character"/></supplied>');
    testTransform(null, "[ομοῦ αὐτῆς vac.?(?)]", '<supplied reason="lost" cert="low">ομοῦ αὐτῆς <space extent="unknown" unit="character"/></supplied>');
    testTransform(null, "[ομοῦ αὐτῆς vac.?(?) (?)]", '<supplied reason="lost" cert="low">ομοῦ αὐτῆς <space extent="unknown" unit="character"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[ωκα. vac.?(?)]", '<supplied reason="lost" cert="low">ωκα. <space extent="unknown" unit="character"/></supplied>');
    testTransform(null, "[θαι vac.?(?)]", '<supplied reason="lost" cert="low">θαι <space extent="unknown" unit="character"/></supplied>');
    testTransform(null, "[θαι vac.? εὶρ(?)]", '<supplied reason="lost" cert="low">θαι <space extent="unknown" unit="character"/> εὶρ</supplied>');
    testTransform(null, "[θαι vac.?(?)  εὶρ(?)]", '<supplied reason="lost" cert="low">θαι <space extent="unknown" unit="character"><certainty match=".." locus="name"/></space> εὶρ</supplied>');
    testTransform(null, "[vac.?(?)]", '<supplied reason="lost" cert="low"><space extent="unknown" unit="character"/></supplied>');
    testTransform(null, "[vac.?(?) (?)]", '<supplied reason="lost" cert="low"><space extent="unknown" unit="character"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[vac.3(?)]", '<supplied reason="lost" cert="low"><space quantity="3" unit="character"/></supplied>');
    testTransform(null, "[vac.3(?) (?)]", '<supplied reason="lost" cert="low"><space quantity="3" unit="character"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[vac.2-5(?)]", '<supplied reason="lost" cert="low"><space atLeast="2" atMost="5" unit="character"/></supplied>');
    testTransform(null, "[vac.2-5(?) (?)]", '<supplied reason="lost" cert="low"><space atLeast="2" atMost="5" unit="character"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[vac.ca.3(?)]", '<supplied reason="lost" cert="low"><space quantity="3" unit="character" precision="low"/></supplied>');
    testTransform(null, "[vac.ca.3(?) (?)]", '<supplied reason="lost" cert="low"><space quantity="3" unit="character" precision="low"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[vac.?lin(?)]", '<supplied reason="lost" cert="low"><space extent="unknown" unit="line"/></supplied>');
    testTransform(null, "[vac.?lin(?) (?)]", '<supplied reason="lost" cert="low"><space extent="unknown" unit="line"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[vac.3lin(?)]", '<supplied reason="lost" cert="low"><space quantity="3" unit="line"/></supplied>');
    testTransform(null, "[vac.3lin(?) (?)]", '<supplied reason="lost" cert="low"><space quantity="3" unit="line"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[vac.2-5lin(?)]", '<supplied reason="lost" cert="low"><space atLeast="2" atMost="5" unit="line"/></supplied>');
    testTransform(null, "[vac.2-5lin(?) (?)]", '<supplied reason="lost" cert="low"><space atLeast="2" atMost="5" unit="line"><certainty match=".." locus="name"/></space></supplied>');
    testTransform(null, "[vac.ca.3lin(?)]", '<supplied reason="lost" cert="low"><space quantity="3" unit="line" precision="low"/></supplied>');
    testTransform(null, "[vac.ca.3lin(?) (?)]", '<supplied reason="lost" cert="low"><space quantity="3" unit="line" precision="low"><certainty match=".." locus="name"/></space></supplied>');
});

describe("del_rend", () => {
    testTransform(null, "a〚bc〛", 'a<del rend="erasure">bc</del>');
    testTransform(null, "ab〚c def g〛hi", 'ab<del rend="erasure">c def g</del>hi');
    testTransform(null, "〚abcdefg〛", '<del rend="erasure">abcdefg</del>');
    testTransform(null, "〚Xabcdefg〛", '<del rend="cross-strokes">abcdefg</del>');
    testTransform(null, "〚/abcdefg〛", '<del rend="slashes">abcdefg</del>');
    testTransform(null, "〚 Ἀκῆς 〛", '<del rend="erasure"> Ἀκῆς </del>');
    testTransform(null, "〚(|Ψε̣.2λως|) 〛", '<del rend="erasure"><abbr>Ψ<unclear>ε</unclear><gap reason="illegible" quantity="2" unit="character"/>λως</abbr> </del>');
    testTransform(null, "〚X Ἀκῆς 〛", '<del rend="cross-strokes"> Ἀκῆς </del>');
    testTransform(null, "〚X(|Ψε̣.2λως|) 〛", '<del rend="cross-strokes"><abbr>Ψ<unclear>ε</unclear><gap reason="illegible" quantity="2" unit="character"/>λως</abbr> </del>');
    testTransform(null, "〚/ Ἀκῆς 〛", '<del rend="slashes"> Ἀκῆς </del>');
    testTransform(null, "〚/(|Ψε̣.2λως|) 〛", '<del rend="slashes"><abbr>Ψ<unclear>ε</unclear><gap reason="illegible" quantity="2" unit="character"/>λως</abbr> </del>');
    testTransform(null, "〚 Ἀκῆς (?)〛", '<del rend="erasure"> Ἀκῆς <certainty match=".." locus="value"/></del>');
    testTransform(null, "〚(|Ψε̣.2λως|) (?)〛", '<del rend="erasure"><abbr>Ψ<unclear>ε</unclear><gap reason="illegible" quantity="2" unit="character"/>λως</abbr> <certainty match=".." locus="value"/></del>');
    testTransform(null, "〚X Ἀκῆς (?)〛", '<del rend="cross-strokes"> Ἀκῆς <certainty match=".." locus="value"/></del>');
    testTransform(null, "〚X(|Ψε̣.2λως|) (?)〛", '<del rend="cross-strokes"><abbr>Ψ<unclear>ε</unclear><gap reason="illegible" quantity="2" unit="character"/>λως</abbr> <certainty match=".." locus="value"/></del>');
    testTransform(null, "〚/ Ἀκῆς (?)〛", '<del rend="slashes"> Ἀκῆς <certainty match=".." locus="value"/></del>');
    testTransform(null, "〚/(|Ψε̣.2λως|) (?)〛", '<del rend="slashes"><abbr>Ψ<unclear>ε</unclear><gap reason="illegible" quantity="2" unit="character"/>λως</abbr> <certainty match=".." locus="value"/></del>');
});


describe("note", () => {
    testTransform(null, "/*abcdefg*/", '<note xml:lang="en">abcdefg</note>');
    testTransform(null, "/*?*/", '<note xml:lang="en">?</note>');
    testTransform(null, "/*m2?*/", '<note xml:lang="en">m2?</note>');
    testTransform(null, "/*text continued at SB 16,13060 + BGU 13,2270 + P.Graux. 3,30 + P.Col. 2,1 recto 4*/", '<note xml:lang="en">text continued at SB 16,13060 + BGU 13,2270 + P.Graux. 3,30 + P.Col. 2,1 recto 4</note>');
    testTransform(null, "~|di ẹ[mu]|~la ", '<foreign xml:lang="la">di <unclear>e</unclear><supplied reason="lost">mu</supplied></foreign>');
    testTransform(null, "/*abcdefg(ref=p.stras;9;842=PStras 9,842)*/", '<note xml:lang="en">abcdefg<ref n="p.stras;9;842" type="reprint-in">PStras 9,842</ref></note>');
    testTransform(null, "/*?(ref=chr.wilck;;474=WChr 474)*/", '<note xml:lang="en">?<ref n="chr.wilck;;474" type="reprint-in">WChr 474</ref></note>');
    testTransform(null, "/*m2?(ref=sb;18;13856=SB 18,13856)*/", '<note xml:lang="en">m2?<ref n="sb;18;13856" type="reprint-in">SB 18,13856</ref></note>');
    testTransform(null, "/*text continued at SB 16,13060 + BGU 13,2270 + P.Graux. 3,30 + P.Col. 2,1 recto 4(ref=p.mich;1;12=PMich 1,12)*/", '<note xml:lang="en">text continued at SB 16,13060 + BGU 13,2270 + P.Graux. 3,30 + P.Col. 2,1 recto 4<ref n="p.mich;1;12" type="reprint-in">PMich 1,12</ref></note>');
    testTransform(null, "/*PLips 33,v reprinted in (ref=chr.mitt;;55=MChr 55)*/", '<note xml:lang="en">PLips 33,v reprinted in <ref n="chr.mitt;;55" type="reprint-in">MChr 55</ref></note>');
    testTransform(null, "/*POxy 7,1047,minf reprinted in (ref=sb;18;13856=SB 18,13856)*/", '<note xml:lang="en">POxy 7,1047,minf reprinted in <ref n="sb;18;13856" type="reprint-in">SB 18,13856</ref></note>');
    testTransform(null, "/*POxy 12,1578,v reprinted in (ref=p.oxy;14;1736=POxy 14,1736)*/", '<note xml:lang="en">POxy 12,1578,v reprinted in <ref n="p.oxy;14;1736" type="reprint-in">POxy 14,1736</ref></note>');
    testTransform(null, "/*POxy 1,43,v reprinted in (ref=chr.wilck;;474=WChr 474)*/", '<note xml:lang="en">POxy 1,43,v reprinted in <ref n="chr.wilck;;474" type="reprint-in">WChr 474</ref></note>');
    testTransform(null, "/*POxy 1,71,v reprinted in (ref=p.lond;3;755=PLond 3,755)*/", '<note xml:lang="en">POxy 1,71,v reprinted in <ref n="p.lond;3;755" type="reprint-in">PLond 3,755</ref></note>');
    testTransform(null, "/*PVindobWorp 8,r reprinted in (ref=xxx=CPR 17A,7)*/", '<note xml:lang="en">PVindobWorp 8,r reprinted in <ref n="xxx" type="reprint-in">CPR 17A,7</ref></note>');
    testTransform(null, "/*PVindobWorp 8,v reprinted in (ref=xxx=PCharite 13)*/", '<note xml:lang="en">PVindobWorp 8,v reprinted in <ref n="xxx" type="reprint-in">PCharite 13</ref></note>');
    testTransform(null, "/*PStras 1,71,r reprinted in (ref=p.stras;9;842=PStras 9,842)*/", '<note xml:lang="en">PStras 1,71,r reprinted in <ref n="p.stras;9;842" type="reprint-in">PStras 9,842</ref></note>');
    testTransform(null, "/*PSI 4,409,B reprinted in (ref=p.mich;1;12=PMich 1,12)*/", '<note xml:lang="en">PSI 4,409,B reprinted in <ref n="p.mich;1;12" type="reprint-in">PMich 1,12</ref></note>');
});

describe("p5_supraline_underline", () => {
    testTransform(null, "¯_ [.?] .1ηρου_¯", '<hi rend="supraline-underline"> <gap reason="lost" extent="unknown" unit="character"/> <gap reason="illegible" quantity="1" unit="character"/>ηρου</hi>');
    testTransform(null, "¯_words sic_¯", '<hi rend="supraline-underline">words sic</hi>');
    testTransform(null, "[Ἁρχῦψις] ¯_[Πετεή]σιος_¯ αγδ  ¯_δεξβεφξβν_¯ ςεφξνςφη", '<supplied reason="lost">Ἁρχῦψις</supplied> <hi rend="supraline-underline"><supplied reason="lost">Πετεή</supplied>σιος</hi> αγδ  <hi rend="supraline-underline">δεξβεφξβν</hi> ςεφξνςφη');
});


describe("tall", () => {
    testTransform(null, "~||Ἑρεννίαν Γέμελλαν||~tall", '<hi rend="tall">Ἑρεννίαν Γέμελλαν</hi>');
    testTransform(null, "~||x||~tall", '<hi rend="tall">x</hi>');
    testTransform(null, "~|| ο(´ ῾)||~tall", '<hi rend="tall"><hi rend="acute"><hi rend="asper">ο</hi></hi></hi>');
    testTransform(null, "[Ἁρχῦψις] ~||[Πετεή]σιος||~tall αγδ  ~||δεξβεφξβν||~tall ςεφξνςφη", '<supplied reason="lost">Ἁρχῦψις</supplied> <hi rend="tall"><supplied reason="lost">Πετεή</supplied>σιος</hi> αγδ  <hi rend="tall">δεξβεφξβν</hi> ςεφξνςφη');
});

describe("subscript", () => {
    testTransform(null, "\\|(χρυσοχο ϊ(¨)κ(ῷ))|/", '<hi rend="subscript"><expan>χρυσοχο<hi rend="diaeresis">ϊ</hi>κ<ex>ῷ</ex></expan></hi>');
    testTransform(null, "\\|(χρυσοχο ϊ(¨)κ(ῷ))(?)|/", '<hi rend="subscript"><expan>χρυσοχο<hi rend="diaeresis">ϊ</hi>κ<ex>ῷ</ex></expan><certainty match=".." locus="value"/></hi>');
    testTransform(null, "\\|η|/", '<hi rend="subscript">η</hi>');
    testTransform(null, "\\|η(?)|/", '<hi rend="subscript">η<certainty match=".." locus="value"/></hi>');
});

describe("supraline", () => {
    testTransform(null, "[Ἁρχῦψις] ¯[Πετεή]σιος¯ αγδ  δ̄ε̄ξ̄β̄ε̄φ̄ξ̄β̄ν̄ ςεφξνςφη", '<supplied reason="lost">Ἁρχῦψις</supplied> <hi rend="supraline"><supplied reason="lost">Πετεή</supplied>σιος</hi> αγδ  <hi rend="supraline">δεξβεφξβν</hi> ςεφξνςφη');
    testTransform(null, "w̄ōr̄d̄s̄ ̄s̄īc̄", '<hi rend="supraline">words sic</hi>');
    testTransform(null, "w̄ōr̄d̄", '<hi rend="supraline">word</hi>');
    testTransform(null, "w̄ōκ̣̄r̄d̄", '<hi rend="supraline">wo<unclear>κ</unclear>rd</hi>');
    testTransform(null, "w̄κ̣̄ōκ̣̄r̄κ̣̄d̄", '<hi rend="supraline">w<unclear>κ</unclear>o<unclear>κ</unclear>r<unclear>κ</unclear>d</hi>');
    testTransform(null, "¯.1¯", '<hi rend="supraline"><gap reason="illegible" quantity="1" unit="character"/></hi>');
    testTransform(null, "¯.22¯", '<hi rend="supraline"><gap reason="illegible" quantity="22" unit="character"/></hi>');
    testTransform(null, "¯.333¯", '<hi rend="supraline"><gap reason="illegible" quantity="333" unit="character"/></hi>');
    testTransform(null, "¯James drinks 1̄3̄ beers¯", '<hi rend="supraline">James drinks <hi rend="supraline">13</hi> beers</hi>');
    testTransform(null, "¯vestig ¯", '<hi rend="supraline"><gap reason="illegible" extent="unknown" unit="character"><desc>vestiges</desc></gap></hi>');
    testTransform(null, "¯<#α=1#>¯", '<hi rend="supraline"><num value="1">α</num></hi>');
    testTransform(null, "¯<#β=2#>¯", '<hi rend="supraline"><num value="2">β</num></hi>');
    testTransform(null, "¯<#γ=3#>¯", '<hi rend="supraline"><num value="3">γ</num></hi>');
    testTransform(null, "<#ᾱ=1#>", '<num value="1"><hi rend="supraline">α</hi></num>');
    testTransform(null, "<#β̄=2#>", '<num value="2"><hi rend="supraline">β</hi></num>');
    testTransform(null, "<#γ̄=3#>", '<num value="3"><hi rend="supraline">γ</hi></num>');
    testTransform(null, "<#ῑ=10#>", '<num value="10"><hi rend="supraline">ι</hi></num>');
    testTransform(null, "<#ῑη̄=18#>", '<num value="18"><hi rend="supraline">ιη</hi></num>');
    testTransform(null, "<#𐅵̄=1/2#>", '<num value="1/2"><hi rend="supraline">𐅵</hi></num>');
    testTransform(null, "<#𐅸̄=3/4#>", '<num value="3/4"><hi rend="supraline">𐅸</hi></num>');
    testTransform(null, "<#ῑβ̄=1/12#>", '<num value="1/12"><hi rend="supraline">ιβ</hi></num>');
    testTransform(null, "<#[ι]ᾱ=11#>", '<num value="11"><supplied reason="lost">ι</supplied><hi rend="supraline">α</hi></num>');
    testTransform(null, "<#¯[ι]α¯=11#>", '<num value="11"><hi rend="supraline"><supplied reason="lost">ι</supplied>α</hi></num>');

    testTransform(null,
        `34. [Ἁρχῦψις] Πετεήσιος <#α=1#> ((ἔτους)) ἀπὸ ¯<#ϛ=6#> <#ŵ=1/2#> <#η '=1/8#>¯((ἀρτάβαι)) ¯<#λα=31#>¯<#α=1#> <#δ '=1/4#> <#η '=1/8#> ((ἀρτάβαι)) <#δ=4#> <#ŵ=1/2#>, καὶ (με(μερισμένον)) ἀπὸ τῆς ((προτερον)) 

    413. ¯<#α=1#>¯ ((ἄρουραι)) <#ρλγ=133#> <#ŵ=1/2#> <#δ '=1/4#> 

    414. ¯<#β=2#>¯   <:<#1\\32 <#δ '=1/4#>/=#>|subst|<#ρ〚μβ〛=142#>〚 <#δ '=1/4#>〛:> ((ἀρτάβαι)) [.?] 

    415. ¯<#γ=3#>¯         <#ρνθ=159#> <#δ '=1/4#> [.?] 

    416. <#ριε=115#> <#ŵ=1/2#> [((ἀρτάβαι))] .2[.?]`,
        `<lb n="34"/><supplied reason="lost">Ἁρχῦψις</supplied> Πετεήσιος <num value="1">α</num> <expan><ex>ἔτους</ex></expan> ἀπὸ <hi rend="supraline"><num value="6">ϛ</num> <num value="1/2">ŵ</num> <num value="1/8" rend="tick">η</num></hi><expan><ex>ἀρτάβαι</ex></expan> <hi rend="supraline"><num value="31">λα</num></hi><num value="1">α</num> <num value="1/4" rend="tick">δ</num> <num value="1/8" rend="tick">η</num> <expan><ex>ἀρτάβαι</ex></expan> <num value="4">δ</num> <num value="1/2">ŵ</num>, καὶ <expan>με<ex>μερισμένον</ex></expan> ἀπὸ τῆς <expan><ex>προτερον</ex></expan> 

    <lb n="413"/><hi rend="supraline"><num value="1">α</num></hi> <expan><ex>ἄρουραι</ex></expan> <num value="133">ρλγ</num> <num value="1/2">ŵ</num> <num value="1/4" rend="tick">δ</num> 

    <lb n="414"/><hi rend="supraline"><num value="2">β</num></hi>   <subst><add place="inline"><num>1<add place="above">32 <num value="1/4" rend="tick">δ</num></add></num></add><del rend="corrected"><num value="142">ρ<del rend="erasure">μβ</del></num><del rend="erasure"> <num value="1/4" rend="tick">δ</num></del></del></subst> <expan><ex>ἀρτάβαι</ex></expan> <gap reason="lost" extent="unknown" unit="character"/> 

    <lb n="415"/><hi rend="supraline"><num value="3">γ</num></hi>         <num value="159">ρνθ</num> <num value="1/4" rend="tick">δ</num> <gap reason="lost" extent="unknown" unit="character"/> 

    <lb n="416"/><num value="115">ριε</num> <num value="1/2">ŵ</num> <supplied reason="lost"><expan><ex>ἀρτάβαι</ex></expan></supplied> <gap reason="illegible" quantity="2" unit="character"/><gap reason="lost" extent="unknown" unit="character"/>`
    );
});

describe("superscript", () => {
    testTransform(null, "|^<#ι=10#> ^|", '<hi rend="superscript"><num value="10">ι</num> </hi>');
    testTransform(null, "|^<:σημεῖον|corr|σημιον:>^|", '<hi rend="superscript"><choice><corr>σημεῖον</corr><sic>σημιον</sic></choice></hi>');
    testTransform(null, "[Ἁρχῦψις] |^[Πετεή]σιος^| αγδ  |^δεξβεφξβν^| ςεφξνςφη", '<supplied reason="lost">Ἁρχῦψις</supplied> <hi rend="superscript"><supplied reason="lost">Πετεή</supplied>σιος</hi> αγδ  <hi rend="superscript">δεξβεφξβν</hi> ςεφξνςφη');
});

describe("p5_above", () => {
    testTransform(null, "\\ς/", '<add place="above">ς</add>');
    testTransform(null, "\\ς(?)/", '<add place="above">ς<certainty match=".." locus="name"/></add>');
    testTransform(null, "\\καὶ̣ Κ̣ε̣ρ̣κεσήφεως/", '<add place="above">κα<unclear>ὶ</unclear> <unclear>Κερ</unclear>κεσήφεως</add>');
    testTransform(null, "\\καὶ̣ Κ̣ε̣ρ̣κεσήφεως(?)/", '<add place="above">κα<unclear>ὶ</unclear> <unclear>Κερ</unclear>κεσήφεως<certainty match=".." locus="name"/></add>');
    testTransform(null, "\\κα̣ὶ̣ μὴ ὁμολογη〚.1〛/", '<add place="above">κ<unclear>αὶ</unclear> μὴ ὁμολογη<del rend="erasure"><gap reason="illegible" quantity="1" unit="character"/></del></add>');
    testTransform(null, "\\κα̣ὶ̣ μὴ ὁμολογη〚.1〛(?)/", '<add place="above">κ<unclear>αὶ</unclear> μὴ ὁμολογη<del rend="erasure"><gap reason="illegible" quantity="1" unit="character"/></del><certainty match=".." locus="name"/></add>');
});

describe("p5_below", () => {
    testTransform(null, "//ς\\\\", '<add place="below">ς</add>');
    testTransform(null, "//<#δ=4#>\\\\", '<add place="below"><num value="4">δ</num></add>');
    testTransform(null, "//ς(?)\\\\", '<add place="below">ς<certainty match=".." locus="name"/></add>');
    testTransform(null, "//<#δ=4#>(?)\\\\", '<add place="below"><num value="4">δ</num><certainty match=".." locus="name"/></add>');
});

describe("add_place_interlinear", () => {
    testTransform(null, "||interlin: καὶ οὐδ᾽ ἄλλοις ἔχοντες ἐλάσσονος τιμῆς διαθέσθαι εὐχερῶς.||", '<add place="interlinear"> καὶ οὐδ᾽ ἄλλοις ἔχοντες ἐλάσσονος τιμῆς διαθέσθαι εὐχερῶς.</add>');
    testTransform(null, "||interlin: ὧ( ῾)ν||", '<add place="interlinear"><hi rend="asper">ὧ</hi>ν</add>');
    testTransform(null, "||interlin: ὧ( ῾)ν(?)||", '<add place="interlinear"><hi rend="asper">ὧ</hi>ν<certainty match=".." locus="name"/></add>');
    testTransform(null, "||interlin:[φοινίκ]ω̣ν̣ κ̣αὶ ἐ̣λ̣αιῶν||", '<add place="interlinear"><supplied reason="lost">φοινίκ</supplied><unclear>ων</unclear> <unclear>κ</unclear>αὶ <unclear>ἐλ</unclear>αιῶν</add>');
    testTransform(null, "||interlin: $m2  (Οὐεναφρ(ίου)) ||", '<add place="interlinear"> <handShift new="m2"/> <expan>Οὐεναφρ<ex>ίου</ex></expan> </add>');
    testTransform(null, "||interlin:ε||", '<add place="interlinear">ε</add>');
    testTransform(null, "||interlin:Πωλίων ἀπάτωρ||", '<add place="interlinear">Πωλίων ἀπάτωρ</add>');
    testTransform(null, "||interlin:Πωλίων ἀπάτωρ(?)||", '<add place="interlinear">Πωλίων ἀπάτωρ<certainty match=".." locus="name"/></add>');
    testTransform(null, "||interlin:.1||", '<add place="interlinear"><gap reason="illegible" quantity="1" unit="character"/></add>');
    testTransform(null, "||interlin:καὶ (κρι(θῆς)) (ἀρ(τ )) <#β=2#> [.?]< 8. καὶ Πάσιτ̣[ι .?] 9. ||interlin:καὶ (κρι(θῆς)) (ἀρ(τ )) <#β=2#> [.?]|| 10. καὶ Τεΰ̣ρ̣ει .3[.?] 11. > καὶ (κρι(θῆς)) (ἀρ(τ )) <#β=2#> [.?]||", '<add place="interlinear">καὶ <expan>κρι<ex>θῆς</ex></expan> <expan>ἀρ<ex>τ </ex></expan> <num value="2">β</num> <gap reason="lost" extent="unknown" unit="character"/><supplied reason="omitted"> <lb n="8"/>καὶ Πάσι<unclear>τ</unclear><supplied reason="lost">ι <gap reason="illegible" extent="unknown" unit="character"/></supplied> <lb n="9"/><add place="interlinear">καὶ <expan>κρι<ex>θῆς</ex></expan> <expan>ἀρ<ex>τ </ex></expan> <num value="2">β</num> <gap reason="lost" extent="unknown" unit="character"/></add> <lb n="10"/>καὶ Τε<unclear>ΰρ</unclear>ει <gap reason="illegible" quantity="3" unit="character"/><gap reason="lost" extent="unknown" unit="character"/> <lb n="11"/></supplied> καὶ <expan>κρι<ex>θῆς</ex></expan> <expan>ἀρ<ex>τ </ex></expan> <num value="2">β</num> <gap reason="lost" extent="unknown" unit="character"/></add>');
    testTransform(null, "<||interlin: καὶ οὐδ᾽ ἄλλοις ἔχοντες ἐλάσσονος τιμῆς διαθέσθαι εὐχερῶς.||>", '<supplied reason="omitted"><add place="interlinear"> καὶ οὐδ᾽ ἄλλοις ἔχοντες ἐλάσσονος τιμῆς διαθέσθαι εὐχερῶς.</add></supplied>');
    testTransform(null, "||interlin: ὧ( ῾)ν||interlin: ὧ( ῾)ν||||", '<add place="interlinear"><hi rend="asper">ὧ</hi>ν<add place="interlinear"><hi rend="asper">ὧ</hi>ν</add></add>');
});

describe("add_place_margin_underline", () => {
    testTransform(null, "<_ν_>", '<add rend="underline" place="margin">ν</add>');
    testTransform(null, "<_.1_>", '<add rend="underline" place="margin"><gap reason="illegible" quantity="1" unit="character"/></add>');
    testTransform(null, "<_ν(?)_>", '<add rend="underline" place="margin">ν<certainty match=".." locus="name"/></add>');
    testTransform(null, "<_.1(?)_>", '<add rend="underline" place="margin"><gap reason="illegible" quantity="1" unit="character"/><certainty match=".." locus="name"/></add>');
    testTransform(null, "<|ν|>", '<add rend="sling" place="margin">ν</add>');
    testTransform(null, "<|.1|>", '<add rend="sling" place="margin"><gap reason="illegible" quantity="1" unit="character"/></add>');
    testTransform(null, "<|ν(?)|>", '<add rend="sling" place="margin">ν<certainty match=".." locus="name"/></add>');
    testTransform(null, "<|.1(?)|>", '<add rend="sling" place="margin"><gap reason="illegible" quantity="1" unit="character"/><certainty match=".." locus="name"/></add>');
});

describe("foreign_lang", () => {
    testTransform(null, "~|veni vedi vici|~la ", '<foreign xml:lang="la">veni vedi vici</foreign>');
    testTransform(null, "~|di' emu Foibạmṃ[onis]|~la ", '<foreign xml:lang="la">di\' emu Foib<unclear>a</unclear>m<unclear>m</unclear><supplied reason="lost">onis</supplied></foreign>');
    testTransform(null, "[ ~|cum obtulisset libellum Eulogii: .? ex officio.|~la  ὁποῖον]", '<supplied reason="lost"> <foreign xml:lang="la">cum obtulisset libellum Eulogii: <gap reason="illegible" extent="unknown" unit="character"/> ex officio.</foreign> ὁποῖον</supplied>');
    testTransform(null, `~|legi 
    12. legi |~la `, `<foreign xml:lang="la">legi 
    <lb n="12"/>legi </foreign>`);

    testTransform(null, "[υσίου Τόπων ~|? .|~la  ὑ]", '<supplied reason="lost">υσίου Τόπων <foreign xml:lang="la">? .</foreign> ὑ</supplied>');
    testTransform(null, "[νουμηνίᾳ ~|?,|~la  ἐν τῇ Σοκν]", '<supplied reason="lost">νουμηνίᾳ <foreign xml:lang="la">?,</foreign> ἐν τῇ Σοκν</supplied>');
    testTransform(null, "/*abcdefg*/", '<note xml:lang="en">abcdefg</note>');
    testTransform(null, "/*?*/", '<note xml:lang="en">?</note>');
    testTransform(null, "/*m2?*/", '<note xml:lang="en">m2?</note>');
    testTransform(null, "/*text continued at SB 16,13060 + BGU 13,2270 + P.Graux. 3,30 + P.Col. 2,1 recto 4*/", '<note xml:lang="en">text continued at SB 16,13060 + BGU 13,2270 + P.Graux. 3,30 + P.Col. 2,1 recto 4</note>');
    testTransform(null, "~|di ẹ[mu]|~la ", '<foreign xml:lang="la">di <unclear>e</unclear><supplied reason="lost">mu</supplied></foreign>');
    testTransform(null, "/*text continued at SB 16,13060 + BGU 13,2270 + P.Graux. 3,30 + P.Col. 2,1 recto 4*/", '<note xml:lang="en">text continued at SB 16,13060 + BGU 13,2270 + P.Graux. 3,30 + P.Col. 2,1 recto 4</note>');
    testTransform(null, "~|? vac.? [ ]|~la ", '<foreign xml:lang="la">? <space extent="unknown" unit="character"/> <supplied reason="lost"> </supplied></foreign>');
    testTransform(null, `~|Εὐδυνέου 
    00. πέμπτῃ|~grc `, `<foreign xml:lang="grc">Εὐδυνέου 
    <lb n="00"/>πέμπτῃ</foreign>`);
    testTransform(null,"~|M e(´)viae Dionusari o(´) e lege Julia |~la ", '<foreign xml:lang="la">M<hi rend="acute">e</hi>viae Dionusari<hi rend="acute">o</hi> e lege Julia </foreign>');
    testTransform(null, "~|di emu  i(¨)ustu diakonu eteliothe |~la ", '<foreign xml:lang="la">di emu <hi rend="diaeresis">i</hi>ustu diakonu eteliothe </foreign>');
    testTransform(null, "[ ~|cum obtulisset libellum Eulogii: .? ex officio.|~la  ὁποῖον]", '<supplied reason="lost"> <foreign xml:lang="la">cum obtulisset libellum Eulogii: <gap reason="illegible" extent="unknown" unit="character"/> ex officio.</foreign> ὁποῖον</supplied>');
    testTransform(null, "~|di' emu Foibạmṃ[onis]|~la ", '<foreign xml:lang="la">di\' emu Foib<unclear>a</unclear>m<unclear>m</unclear><supplied reason="lost">onis</supplied></foreign>');
    testTransform(null, "~|di' (em(u)) (Iust(u)) (upodiacon(u)) (sumbolai(ografu)) eteliothḥ|~la ", '<foreign xml:lang="la">di\' <expan>em<ex>u</ex></expan> <expan>Iust<ex>u</ex></expan> <expan>upodiacon<ex>u</ex></expan> <expan>sumbolai<ex>ografu</ex></expan> etelioth<unclear>h</unclear></foreign>');
    testTransform(null, "~|? [ ]|~la ", '<foreign xml:lang="la">? <supplied reason="lost"> </supplied></foreign>');
    testTransform(null, "~|?. [ ]|~la ", '<foreign xml:lang="la">?. <supplied reason="lost"> </supplied></foreign>');
    testTransform(null, `18. [.3]ς̣ Ζωΐλου ((ἄρουραι)) <#λ̣β̣=32#> <#𐅵 '=1/2#> <#ιϛ '=1/16#> <#λβ '=1/32#>((δηναρίων
    μυριάδες)) [.?]`, `<lb n="18"/><gap reason="lost" quantity="3" unit="character"/><unclear>ς</unclear> Ζωΐλου <expan><ex>ἄρουραι</ex></expan> <num value="32"><unclear>λβ</unclear></num> <num value="1/2" rend="tick">𐅵</num> <num value="1/16" rend="tick">ιϛ</num> <num value="1/32" rend="tick">λβ</num><expan><ex>δηναρίων
    μυριάδες</ex></expan> <gap reason="lost" extent="unknown" unit="character"/>`);
    testTransform(null,  "((δηναρίων μυριάδες))", "<expan><ex>δηναρίων μυριάδες</ex></expan>");
    testTransform(null,  "((ὀβολοῦ 1/2))", "<expan><ex>ὀβολοῦ 1/2</ex></expan>");
    testTransform(null,  "~| \\$m3 ὁ <:δεῖνα|corr|δινα:>/ $m4 /*?*/ (κα(ὶ)) (κα(ὶ)) \\$m3 (χρυ(σοῦ)) (λίτρ(ας)) <#ε=5#>/ $m4 /*?*/ ὑπομνησθήσονται διὰ τῆς τάξεως ἢ τὸ δέον{ι} δίκης ἐκτὸς ἐπιγνῶναι ἢ ἀντιλέγοντες δικάσασθαι 16. ἐν τῷ δικαστηρίῳ. $m2 (Φλά(ουιος)) Ῥωμανὸς υἱὸς Ἰακὼβ (|Φλ|) παραβάλλω Συριανὸν ἀπὸ (πριγκ(ιπαλίων)) εἰς (χρυ(σοῦ)) (λί(τρας)) <:πέντε|corr|πεντη:> <#=5#>.|~grc ", '<foreign xml:lang="grc"> <add place="above"><handShift new="m3"/>ὁ <choice><corr>δεῖνα</corr><sic>δινα</sic></choice></add> <handShift new="m4"/><note xml:lang="en">?</note> <expan>κα<ex>ὶ</ex></expan> <expan>κα<ex>ὶ</ex></expan> <add place="above"><handShift new="m3"/><expan>χρυ<ex>σοῦ</ex></expan> <expan>λίτρ<ex>ας</ex></expan> <num value="5">ε</num></add> <handShift new="m4"/><note xml:lang="en">?</note> ὑπομνησθήσονται διὰ τῆς τάξεως ἢ τὸ δέον<surplus>ι</surplus> δίκης ἐκτὸς ἐπιγνῶναι ἢ ἀντιλέγοντες δικάσασθαι <lb n="16"/>ἐν τῷ δικαστηρίῳ. <handShift new="m2"/><expan>Φλά<ex>ουιος</ex></expan> Ῥωμανὸς υἱὸς Ἰακὼβ <abbr>Φλ</abbr> παραβάλλω Συριανὸν ἀπὸ <expan>πριγκ<ex>ιπαλίων</ex></expan> εἰς <expan>χρυ<ex>σοῦ</ex></expan> <expan>λί<ex>τρας</ex></expan> <choice><corr>πέντε</corr><sic>πεντη</sic></choice> <num value="5"/>.</foreign>');
    testTransform(null,  "~|εἰ.2η πειθην|~grc ", '<foreign xml:lang="grc">εἰ<gap reason="illegible" quantity="2" unit="character"/>η πειθην</foreign>');
    testTransform(null,  "~|εἰ?2η πειθην|~grc ", '<foreign xml:lang="grc">εἰ?2η πειθην</foreign>');
    testTransform(null,  "~|Sen[ec]ion (d(ixit)): καλῶς διδάσκει. αὕτη ἡ οἰκία ἐ̣[γγυς /*?*/ τῆ]ς οἰκίας τοῦ λογιστοῦ ἐστιν. ὁ λογιστὴς ἐκεῖ μένει. 15. (Fl(avius)) Leontius Beronicianus (v(ir)) (c(larissimus)) (pr(aeses)) (Tebaei(dis)) (d(ixit)): |~la ", '<foreign xml:lang="la">Sen<supplied reason="lost">ec</supplied>ion <expan>d<ex>ixit</ex></expan>: καλῶς διδάσκει. αὕτη ἡ οἰκία <unclear>ἐ</unclear><supplied reason="lost">γγυς <note xml:lang="en">?</note> τῆ</supplied>ς οἰκίας τοῦ λογιστοῦ ἐστιν. ὁ λογιστὴς ἐκεῖ μένει. <lb n="15"/><expan>Fl<ex>avius</ex></expan> Leontius Beronicianus <expan>v<ex>ir</ex></expan> <expan>c<ex>larissimus</ex></expan> <expan>pr<ex>aeses</ex></expan> <expan>Tebaei<ex>dis</ex></expan> <expan>d<ex>ixit</ex></expan>: </foreign>');
    testTransform(null,  "~|et (rec(itavit)): Sergio et |~la ", '<foreign xml:lang="la">et <expan>rec<ex>itavit</ex></expan>: Sergio et </foreign>');
    testTransform(null,  "(σεσημ(είωμαι)).", "<expan>σεσημ<ex>είωμαι</ex></expan>.");
    testTransform(null,  "~|[Ac]holius (d(ixit))|~la ", '<foreign xml:lang="la"><supplied reason="lost">Ac</supplied>holius <expan>d<ex>ixit</ex></expan></foreign>');
    testTransform(null,  "~|Acholius dixit: |~la ", '<foreign xml:lang="la">Acholius dixit: </foreign>');
    testTransform(null,  "~|[Ac]holius (d(ixit)): |~la ", '<foreign xml:lang="la"><supplied reason="lost">Ac</supplied>holius <expan>d<ex>ixit</ex></expan>: </foreign>');
    testTransform(null,  "~|totelo (ex(ceptoribus)). |~la ", '<foreign xml:lang="la">totelo <expan>ex<ex>ceptoribus</ex></expan>. </foreign>');
    testTransform(null,  "~|(co(nsulibus)) die <#iiii=#> ~|(Kal(endas)) Ianuạṛịạṣ Biono|~la .2[.?]~|saṛ|~la [.1].1~|totelo (ex(ceptoribus)). |~la |~la ", '<foreign xml:lang="la"><expan>co<ex>nsulibus</ex></expan> die <num>iiii</num> <foreign xml:lang="la"><expan>Kal<ex>endas</ex></expan> Ianu<unclear>arias</unclear> Biono</foreign><gap reason="illegible" quantity="2" unit="character"/><gap reason="lost" extent="unknown" unit="character"/><foreign xml:lang="la">sa<unclear>r</unclear></foreign><gap reason="lost" quantity="1" unit="character"/><gap reason="illegible" quantity="1" unit="character"/><foreign xml:lang="la">totelo <expan>ex<ex>ceptoribus</ex></expan>. </foreign></foreign>');
    testTransform(null,  "~|(Fl(avius)) Leontius (Beronicianu(s)) (v(ir)) (c(larissimus)) (pr(aeses)) (Tebaei(dis)) (d(ixit)): |~la ", '<foreign xml:lang="la"><expan>Fl<ex>avius</ex></expan> Leontius <expan>Beronicianu<ex>s</ex></expan> <expan>v<ex>ir</ex></expan> <expan>c<ex>larissimus</ex></expan> <expan>pr<ex>aeses</ex></expan> <expan>Tebaei<ex>dis</ex></expan> <expan>d<ex>ixit</ex></expan>: </foreign>');
    testTransform(null,  "~|<:et|corr|ec:> (c(etera)): (or(ator)) adiecit: |~la ", '<foreign xml:lang="la"><choice><corr>et</corr><sic>ec</sic></choice> <expan>c<ex>etera</ex></expan>: <expan>or<ex>ator</ex></expan> adiecit: </foreign>');
    testTransform(null,  "~|<:et|corr|ec:> (c(etera)): test adiecit(or(ator)): |~la ", '<foreign xml:lang="la"><choice><corr>et</corr><sic>ec</sic></choice> <expan>c<ex>etera</ex></expan>: test adiecit<expan>or<ex>ator</ex></expan>: </foreign>');
    testTransform(null,  "~|[Ac]holius (d(ixit)): |~la ", '<foreign xml:lang="la"><supplied reason="lost">Ac</supplied>holius <expan>d<ex>ixit</ex></expan>: </foreign>');
    testTransform(null,  "~|[Ac]holius (d(ixit))|~la ", '<foreign xml:lang="la"><supplied reason="lost">Ac</supplied>holius <expan>d<ex>ixit</ex></expan></foreign>');
    testTransform(null,  "~|[Ac]holius (d(ixit)) |~la ", '<foreign xml:lang="la"><supplied reason="lost">Ac</supplied>holius <expan>d<ex>ixit</ex></expan> </foreign>');
    testTransform(null,  "~|Acholius dixit: |~la ", '<foreign xml:lang="la">Acholius dixit: </foreign>');
    testTransform(null,  "\\κα̣ὶ̣ μὴ ὁμολογη〚.1〛/", '<add place="above">κ<unclear>αὶ</unclear> μὴ ὁμολογη<del rend="erasure"><gap reason="illegible" quantity="1" unit="character"/></del></add>');
    testTransform(null,  "(~|IỊỊCyr|~la (enaica))", '<expan><foreign xml:lang="la">I<unclear>II</unclear>Cyr</foreign><ex>enaica</ex></expan>');
    testTransform(null,  "~|~||Ἑρεννίαν Γέμελλαν||~tall|~grc ", '<foreign xml:lang="grc"><hi rend="tall">Ἑρεννίαν Γέμελλαν</hi></foreign>');
    testTransform(null,  "<:(Κών̣ων̣(ος))=BL 8.470|ed|Κω.2ω <:vestig |corr|*monogram*:>:>", '<app type="editorial"><lem resp="BL 8.470"><expan>Κώ<unclear>ν</unclear>ω<unclear>ν</unclear><ex>ος</ex></expan></lem><rdg>Κω<gap reason="illegible" quantity="2" unit="character"/>ω <choice><corr><gap reason="illegible" extent="unknown" unit="character"><desc>vestiges</desc></gap></corr><sic><g type="monogram"/></sic></choice></rdg></app>');
    testTransform(null,  "<:<:εὐωνύμου|corr||_ε̣υ̣_|ω|_ν̣υ̣[μ]ω_|:>|alt|εὐονύμῳ:>", '<app type="alternative"><lem><choice><corr>εὐωνύμου</corr><sic><supplied evidence="parallel" reason="undefined"><unclear>ευ</unclear></supplied>ω<supplied evidence="parallel" reason="undefined"><unclear>νυ</unclear><supplied reason="lost">μ</supplied>ω</supplied></sic></choice></lem><rdg>εὐονύμῳ</rdg></app>');
    testTransform(null,  "<:~|taṇṭẹṣ|~la |alt|~|taṇṭọṣ|~la :>", '<app type="alternative"><lem><foreign xml:lang="la">ta<unclear>ntes</unclear></foreign></lem><rdg><foreign xml:lang="la">ta<unclear>ntos</unclear></foreign></rdg></app>');
    testTransform(null,  "<:(~|Ọṛ|~la (mum))|alt|(~|Ụṛ|~la (mum)):>", '<app type="alternative"><lem><expan><foreign xml:lang="la"><unclear>Or</unclear></foreign><ex>mum</ex></expan></lem><rdg><expan><foreign xml:lang="la"><unclear>Ur</unclear></foreign><ex>mum</ex></expan></rdg></app>');
    testTransform(null,  "<:.2|alt|vestig :>", '<app type="alternative"><lem><gap reason="illegible" quantity="2" unit="character"/></lem><rdg><gap reason="illegible" extent="unknown" unit="character"><desc>vestiges</desc></gap></rdg></app>');
});

describe("milestone", () => {
    testTransform(null, "----", '<milestone rend="paragraphos" unit="undefined"/>');
    testTransform(null, "[----]", '<supplied reason="lost"><milestone rend="paragraphos" unit="undefined"/></supplied>');
    testTransform(null, "[συμφωνῶ ----]", '<supplied reason="lost">συμφωνῶ <milestone rend="paragraphos" unit="undefined"/></supplied>');
    testTransform(null, "[ ---- ἐγγ]", '<supplied reason="lost"> <milestone rend="paragraphos" unit="undefined"/> ἐγγ</supplied>');
    testTransform(null, "[συμφωνῶ ---- ἐγγ]", '<supplied reason="lost">συμφωνῶ <milestone rend="paragraphos" unit="undefined"/> ἐγγ</supplied>');
    testTransform(null, "[----(?)]", '<supplied reason="lost" cert="low"><milestone rend="paragraphos" unit="undefined"/></supplied>');
    testTransform(null, "[συμφωνῶ ----(?)]", '<supplied reason="lost" cert="low">συμφωνῶ <milestone rend="paragraphos" unit="undefined"/></supplied>');
    testTransform(null, "[ ---- ἐγγ(?)]", '<supplied reason="lost" cert="low"> <milestone rend="paragraphos" unit="undefined"/> ἐγγ</supplied>');
    testTransform(null, "[συμφωνῶ ---- ἐγγ(?)]", '<supplied reason="lost" cert="low">συμφωνῶ <milestone rend="paragraphos" unit="undefined"/> ἐγγ</supplied>');
    testTransform(null, "<---->", '<supplied reason="omitted"><milestone rend="paragraphos" unit="undefined"/></supplied>');
    testTransform(null, "<----(?)>", '<supplied reason="omitted" cert="low"><milestone rend="paragraphos" unit="undefined"/></supplied>');
    testTransform(null, "~~~~~~~~", '<milestone rend="wavy-line" unit="undefined"/>');
    testTransform(null, "--------", '<milestone rend="horizontal-rule" unit="undefined"/>');
    testTransform(null, "###", '<milestone rend="box" unit="undefined"/>');
});

describe("figure", () => {
    ["seal", "stamp", "drawing"].forEach(figdesc => {
        testTransform(null, `#${figdesc} `, `<figure><figDesc>${figdesc}</figDesc></figure>`);
    });
});

describe("certainty", () => {
    testTransform(null, "[<:λίβα(?)=BL 8.236|ed|.4:> τοπαρχίας ]", '<supplied reason="lost"><app type="editorial"><lem resp="BL 8.236">λίβα<certainty match=".." locus="value"/></lem><rdg><gap reason="illegible" quantity="4" unit="character"/></rdg></app> τοπαρχίας </supplied>');
});

describe("langlist_exhaustive", () => {
    ["Arabic", "Aramaic", "Coptic", "Demotic", "Gothic", "Hebrew", "Hieratic", "Nabatean", "Syriac"].forEach(lang => {
        testTransform(null, `(Lang: ${lang} 2 char)`, `<gap reason="ellipsis" quantity="2" unit="character"><desc>${lang}</desc></gap>`);
        testTransform(null, `(Lang: ${lang} ? char)`, `<gap reason="ellipsis" extent="unknown" unit="character"><desc>${lang}</desc></gap>`);
        testTransform(null, `(Lang: ${lang} 2 lines)`, `<gap reason="ellipsis" quantity="2" unit="line"><desc>${lang}</desc></gap>`);
        testTransform(null, `(Lang: ${lang} ? lines)`, `<gap reason="ellipsis" extent="unknown" unit="line"><desc>${lang}</desc></gap>`);
    });
});

describe("nontrans", () => {
    testTransform(null, "(Lines: 3 non transcribed)", '<gap reason="ellipsis" quantity="3" unit="line"><desc>non transcribed</desc></gap>');
    testTransform(null, "(Lines: 3 non transcribed(?))", '<gap reason="ellipsis" quantity="3" unit="line"><desc>non transcribed</desc><certainty match=".." locus="name"/></gap>');
    testTransform(null, "(Lines: ca.3 non transcribed)", '<gap reason="ellipsis" quantity="3" unit="line" precision="low"><desc>non transcribed</desc></gap>');
    testTransform(null, "(Lines: ca.3 non transcribed(?))", '<gap reason="ellipsis" quantity="3" unit="line" precision="low"><desc>non transcribed</desc><certainty match=".." locus="name"/></gap>');
    testTransform(null, "(Lines: ? non transcribed)", '<gap reason="ellipsis" extent="unknown" unit="line"><desc>non transcribed</desc></gap>');
    testTransform(null, "(Lines: ? non transcribed(?))", '<gap reason="ellipsis" extent="unknown" unit="line"><desc>non transcribed</desc><certainty match=".." locus="name"/></gap>');
    testTransform(null, "(Lines: 3-5 non transcribed)", '<gap reason="ellipsis" atLeast="3" atMost="5" unit="line"><desc>non transcribed</desc></gap>');
    testTransform(null, "(Lines: 3-5 non transcribed(?))", '<gap reason="ellipsis" atLeast="3" atMost="5" unit="line"><desc>non transcribed</desc><certainty match=".." locus="name"/></gap>');
    testTransform(null, "(Chars: 3 non transcribed)", '<gap reason="ellipsis" quantity="3" unit="character"><desc>non transcribed</desc></gap>');
    testTransform(null, "(Chars: 3 non transcribed(?))", '<gap reason="ellipsis" quantity="3" unit="character"><desc>non transcribed</desc><certainty match=".." locus="name"/></gap>');
    testTransform(null, "(Chars: ca.3 non transcribed)", '<gap reason="ellipsis" quantity="3" unit="character" precision="low"><desc>non transcribed</desc></gap>');
    testTransform(null, "(Chars: ca.3 non transcribed(?))", '<gap reason="ellipsis" quantity="3" unit="character" precision="low"><desc>non transcribed</desc><certainty match=".." locus="name"/></gap>');
    testTransform(null, "(Chars: ? non transcribed)", '<gap reason="ellipsis" extent="unknown" unit="character"><desc>non transcribed</desc></gap>');
    testTransform(null, "(Chars: ? non transcribed(?))", '<gap reason="ellipsis" extent="unknown" unit="character"><desc>non transcribed</desc><certainty match=".." locus="name"/></gap>');
    testTransform(null, "(Chars: 3-5 non transcribed)", '<gap reason="ellipsis" atLeast="3" atMost="5" unit="character"><desc>non transcribed</desc></gap>');
    testTransform(null, "(Chars: 3-5 non transcribed(?))", '<gap reason="ellipsis" atLeast="3" atMost="5" unit="character"><desc>non transcribed</desc><certainty match=".." locus="name"/></gap>');
    testTransform(null, "(Column: 3 non transcribed)", '<gap reason="ellipsis" quantity="3" unit="column"><desc>non transcribed</desc></gap>');
    testTransform(null, "(Column: 3 non transcribed(?))", '<gap reason="ellipsis" quantity="3" unit="column"><desc>non transcribed</desc><certainty match=".." locus="name"/></gap>');
    testTransform(null, "(Column: ca.3 non transcribed)", '<gap reason="ellipsis" quantity="3" unit="column" precision="low"><desc>non transcribed</desc></gap>');
    testTransform(null, "(Column: ca.3 non transcribed(?))", '<gap reason="ellipsis" quantity="3" unit="column" precision="low"><desc>non transcribed</desc><certainty match=".." locus="name"/></gap>');
    testTransform(null, "(Column: ? non transcribed)", '<gap reason="ellipsis" extent="unknown" unit="column"><desc>non transcribed</desc></gap>');
    testTransform(null, "(Column: ? non transcribed(?))", '<gap reason="ellipsis" extent="unknown" unit="column"><desc>non transcribed</desc><certainty match=".." locus="name"/></gap>');
    testTransform(null, "(Column: 3-5 non transcribed)", '<gap reason="ellipsis" atLeast="3" atMost="5" unit="column"><desc>non transcribed</desc></gap>');
    testTransform(null, "(Column: 3-5 non transcribed(?))", '<gap reason="ellipsis" atLeast="3" atMost="5" unit="column"><desc>non transcribed</desc><certainty match=".." locus="name"/></gap>');
});

describe("linenumber_specials", () => {
    testTransform(null, "2/3,ms. ", '<lb n="2/3,ms"/>');
    testTransform(null, "396/397,minf. ", '<lb n="396/397,minf"/>');
    testTransform(null, "18. ", '<lb n="18"/>');
    testTransform(null, "18,ms7. ", '<lb n="18,ms7"/>');
    testTransform(null, "8,ms. ", '<lb n="8,ms"/>');
    testTransform(null, "8ms. ", '<lb n="8ms"/>');
    testTransform(null, "8/ms. ", '<lb n="8/ms"/>');
    testTransform(null, "1/2. ", '<lb n="1/2"/>');
    testTransform(null, "3,4. ", '<lb n="3,4"/>');
    testTransform(null, "(1,ms, perpendicular)", '<lb n="1,ms" rend="perpendicular"/>');
    testTransform(null, "(1/side, perpendicular)", '<lb n="1/side" rend="perpendicular"/>');
    testTransform(null, "(1.-, perpendicular)", '<lb n="1" rend="perpendicular" break="no"/>');
    testTransform(null, "(2.-, inverse)", '<lb n="2" rend="inverse" break="no"/>');
    testTransform(null, "3.- ", '<lb n="3" break="no"/>');
    testTransform(null, "4. ", '<lb n="4"/>');
    testTransform(null, "<:ὑπηR 8.- [ρετῶ]ν=bgu 3 p.1|ed|[.7]ν:>", '<app type="editorial"><lem resp="bgu 3 p.1">ὑπηR <lb n="8" break="no"/><supplied reason="lost">ρετῶ</supplied>ν</lem><rdg><gap reason="lost" quantity="7" unit="character"/>ν</rdg></app>');
    testTransform(null, "<:Πα[νε]φρόμ 23.- μεως|ed|Πα[νε]φρέμμεως:>", '<app type="editorial"><lem>Πα<supplied reason="lost">νε</supplied>φρόμ <lb n="23" break="no"/>μεως</lem><rdg>Πα<supplied reason="lost">νε</supplied>φρέμμεως</rdg></app>');
    testTransform(null, "<:Πα[νε]φρόμ (2.-, inverse)μεως|ed|Πα[νε]φρέμμεως:>", '<app type="editorial"><lem>Πα<supplied reason="lost">νε</supplied>φρόμ <lb n="2" rend="inverse" break="no"/>μεως</lem><rdg>Πα<supplied reason="lost">νε</supplied>φρέμμεως</rdg></app>');
});

// def test_simple_reversibility
//  assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=1. test=>", "<S=.grc<=1. test=>"
//  assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=1. test1\n2. test2=>", "<S=.grc<=1. test1\n2. test2=>"
// end

describe("multiple_ab", () => {
    // everything is wrappen in abs before testing? but some tests have abs...
    // testTransform(null, '{.1ab}=><=12. {ab.1}', '<surplus><gap reason="illegible" quantity="1" unit="character"/>ab</surplus></ab><ab><lb n="12"/><surplus>ab<gap reason="illegible" quantity="1" unit="character"/></surplus>');

    // so here with explicit abs
    testTransform(null, "<={.1ab}=><=12. {ab.1}=>", '<ab><surplus><gap reason="illegible" quantity="1" unit="character"/>ab</surplus></ab><ab><lb n="12"/><surplus>ab<gap reason="illegible" quantity="1" unit="character"/></surplus></ab>', "BlockContent");
});

// TODO: round trip tests
// describe('line_number_formats', () => {
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=1. test=>", "<S=.grc<=1. test=>"
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=1a. test1a=>", "<S=.grc<=1a. test1a=>"
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=4/5. test45=>", "<S=.grc<=4/5. test45=>"
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=14/15. test1415=>", "<S=.grc<=14/15. test1415=>"
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=1,ms. test1ms=>", "<S=.grc<=1,ms. test1ms=>"
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=17,ms. test17ms=>", "<S=.grc<=17,ms. test17ms=>"
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=(1,ms, perpendicular) test1ms=>", "<S=.grc<=(1,ms, perpendicular) test1ms=>"
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=(1/side, perpendicular) test17ms=>", "<S=.grc<=(1/side, perpendicular) test17ms=>"
//     #above test with break no
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=1.- test=>", "<S=.grc<=1.- test=>"
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=1a.- test1a=>", "<S=.grc<=1a.- test1a=>"
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=4/5.- test45=>", "<S=.grc<=4/5.- test45=>"
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=14/15.- test1415=>", "<S=.grc<=14/15.- test1415=>"
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=1,ms.- test1ms=>", "<S=.grc<=1,ms.- test1ms=>"
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=17,ms.- test17ms=>", "<S=.grc<=17,ms.- test17ms=>"
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=(1,ms.-, perpendicular) test1ms=>", "<S=.grc<=(1,ms.-, perpendicular) test1ms=>"
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=(1/side.-, perpendicular) test17ms=>", "<S=.grc<=(1/side.-, perpendicular) test17ms=>"
// });



describe("linenumber_funky_special", () => {
    testTransform(null, "18. ", '<lb n="18"/>');
    testTransform(null, "18,ms7. ", '<lb n="18,ms7"/>');
    testTransform(null, "8,ms. ", '<lb n="8,ms"/>');
    testTransform(null, "8ms. ", '<lb n="8ms"/>');
    testTransform(null, "8/ms. ", '<lb n="8/ms"/>');
    testTransform(null, "1/2. ", '<lb n="1/2"/>');
    testTransform(null, "3,4. ", '<lb n="3,4"/>');
    testTransform(null, "(1,ms, perpendicular)", '<lb n="1,ms" rend="perpendicular"/>');
    testTransform(null, "(1/side, perpendicular)", '<lb n="1/side" rend="perpendicular"/>');
});

describe("p5_linenumber_funky_special_break_no", () => {
    testTransform(null,  "18.- ", '<lb n="18" break="no"/>');
    testTransform(null,  "18,ms7.- ", '<lb n="18,ms7" break="no"/>');
    testTransform(null,  "8,ms.- ", '<lb n="8,ms" break="no"/>');
    testTransform(null,  "8ms.- ", '<lb n="8ms" break="no"/>');
    testTransform(null,  "8/ms.- ", '<lb n="8/ms" break="no"/>');
    testTransform(null,  "1/2.- ", '<lb n="1/2" break="no"/>');
    testTransform(null,  "3,4.- ", '<lb n="3,4" break="no"/>');
    testTransform(null,  "(1,ms.-, perpendicular)", '<lb n="1,ms" rend="perpendicular" break="no"/>');
    testTransform(null,  "(1/side.-, perpendicular)", '<lb n="1/side" rend="perpendicular" break="no"/>');
});

// TODO: round trip tests
// def test_line_numbering_reversibility_exhaustive
//     #(1..100).each do |num_lines|
//     str = ''
//       #(1..num_lines).each do |this_line|
//         (1..100).each do |this_line|
//           str += "#{this_line}. test#{this_line}\n"
//         end
//         str.chomp!
//         # I think the line below doing Leiden+ wrapper will have to moved/rethougt if the the outter loop is reactivated
//         #str = "<=" + str + "=>"
//         str = "<S=.grc<=" + str + "=>"
//         assert_equal_non_xml_to_xml_to_non_xml str, str
//       #end
//     #end
//   end
//
//   def test_xml_trailing_newline_stripped
//     # added \n at end to prove newline not stripped anymore
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=1. test\n=>", "<S=.grc<=1. test\n=>"
//     assert_equal_non_xml_to_xml_to_non_xml "<S=.grc<=1. test1\n2. test2\n=>", "<S=.grc<=1. test1\n2. test2\n=>"
//   end
//
//   def test_unicode_greek_reversibility
//     assert_equal_non_xml_to_xml_to_non_xml '<S=.grc<=1. ςερτυθιοπασδφγηξκλζχψωβνμ=>', '<S=.grc<=1. ςερτυθιοπασδφγηξκλζχψωβνμ=>'
//   end


describe("dclp_141", () => {
    // TODO: roundtrip tests

    // clear, but incomprehensible letters
    // https://github.com/DCLP/dclpxsltbox/issues/141
    const foo = "!abc!";
    const bar = "<orig>abc</orig>";
    testTransform(null, foo, bar);

    // assert_equal_xml_fragment_to_non_xml_to_xml_fragment bar, bar
    // bar = '<lb n="11" break="no"/><orig>ν</orig> τὸ <orig>συλ</orig><gap reason="lost" quantity="1" unit="character"/><orig>φες</orig>'
    // assert_equal_xml_fragment_to_non_xml_to_xml_fragment bar, bar
});

// TODO: roundtrip tests
// def test_dclp_177
//     # specify corresp for a textpart div (e.g., fragment ID)
//     foo = '<S=.grc<D=.1.column.#FR365<=foo=>=D>'
//     bar = transform_non_xml_to_xml(foo)
//     assert_equal(bar, '<div xml:lang="grc" type="edition" xml:space="preserve" xmlns:xml="http://www.w3.org/XML/1998/namespace"><div n="1" subtype="column" type="textpart" corresp="#FR365"><ab>foo</ab></div></div>')
//     assert_equal_edition_roundtrip(foo)
//   end

describe("", () => {});
describe("", () => {});
describe("", () => {});
describe("", () => {});

describe("nested_glyphs", () => {
    testTransform(null, "<:*star*|reg|text:>", '<choice><reg><g type="star"/></reg><orig>text</orig></choice>');
    testTransform(null, "<:*star*|alt|text:>", '<app type="alternative"><lem><g type="star"/></lem><rdg>text</rdg></app>');
    testTransform(null, "<:*star*|ed|text:>", '<app type="editorial"><lem><g type="star"/></lem><rdg>text</rdg></app>');
    testTransform(null, "[*star*]", '<supplied reason="lost"><g type="star"/></supplied>');
    testTransform(null, "¯*star*¯", '<hi rend="supraline"><g type="star"/></hi>');
    testTransform(null, "¯_*star*_¯", '<hi rend="supraline-underline"><g type="star"/></hi>');
    testTransform(null, "|_*star*_|", '<supplied evidence="parallel" reason="undefined"><g type="star"/></supplied>');
    testTransform(null, "_[*star*]_", '<supplied evidence="parallel" reason="lost"><g type="star"/></supplied>');
    testTransform(null, '"*star*"', '<q><g type="star"/></q>');
    testTransform(null, "〚*star*〛", '<del rend="erasure"><g type="star"/></del>');
    testTransform(null, "||interlin:*star*||", '<add place="interlinear"><g type="star"/></add>');
    testTransform(null, "||bottom:*star*||", '<add place="bottom"><g type="star"/></add>');
    testTransform(null, "<|*star*|>", '<add rend="sling" place="margin"><g type="star"/></add>');
    testTransform(null, "<_*star*_>", '<add rend="underline" place="margin"><g type="star"/></add>');
    testTransform(null, "\\*star*/", '<add place="above"><g type="star"/></add>');
    testTransform(null, "//*star*\\\\", '<add place="below"><g type="star"/></add>');
    testTransform(null, "{*star*}", '<surplus><g type="star"/></surplus>');
    testTransform(null, "<*star*>", '<supplied reason="omitted"><g type="star"/></supplied>');
});

describe("own_tests", () => {
   testTransform(null, "[.1]vestig[.1] blavestig blavestig", '<gap reason="lost" quantity="1" unit="character"/>vestig<gap reason="lost" quantity="1" unit="character"/> bla<gap reason="illegible" extent="unknown" unit="character"><desc>vestiges</desc></gap>blavestig');
   testTransform(null, "[lost.5lin(?) (?)]", '<supplied reason="lost" cert="low"><gap reason="lost" quantity="5" unit="line"><certainty match=".." locus="name"/></gap></supplied>');
   testTransform(null, "[vestig.5lin(?) (?)]", '<supplied reason="lost" cert="low"><gap reason="illegible" quantity="5" unit="line"><desc>vestiges</desc><certainty match=".." locus="name"/></gap></supplied>');
   testTransform(null, "[vac.5(?) (?)][vac.?(?) (?)]", '<supplied reason="lost" cert="low"><space quantity="5" unit="character"><certainty match=".." locus="name"/></space></supplied><supplied reason="lost" cert="low"><space extent="unknown" unit="character"><certainty match=".." locus="name"/></space></supplied>');
   testTransform(null, "(|_(ηλίας)_|)", '<expan><supplied evidence="parallel" reason="undefined"><ex>ηλίας</ex></supplied></expan>');
   testTransform(null, "(|||top:bla|||)", '<abbr><add place="top">bla</add></abbr>');
   testTransform(null, "(|||top:bla|| blub|)", '<abbr><add place="top">bla</add> blub</abbr>');
   testTransform(null, "(||top:bla|| (blub))", '<expan><add place="top">bla</add> <ex>blub</ex></expan>');
   testTransform(null, "(|^top:bla^| (blub))", '<expan><hi rend="superscript">top:bla</hi> <ex>blub</ex></expan>');
   testTransform(null, "(|^bla^| (blub))", '<expan><hi rend="superscript">bla</hi> <ex>blub</ex></expan>');
   testTransform(null, "([bla(blub)(?)])", '<expan><supplied reason="lost" cert="low">bla<ex>blub</ex></supplied></expan>');
   testTransform(null, "((enaica))", "<expan><ex>enaica</ex></expan>");
   testTransform(null, "((en-aica))", "<expan><ex>en-aica</ex></expan>");
   testTransform(null, "lost.5lin ", '<gap reason="lost" quantity="5" unit="line"/> ');
   testTransform(null, "vestig.5lin ", '<gap reason="illegible" quantity="5" unit="line"><desc>vestiges</desc></gap> ');
   testTransform(null, "lin char", "lin char");
   testTransform(null, "1. d(^)", '1.<hi rend="circumflex">d</hi>');
   testTransform(null, "1.  d(^)", '<lb n="1"/><hi rend="circumflex">d</hi>');
   testTransform(null, "1.- d(^)", '1.-<hi rend="circumflex">d</hi>');
   testTransform(null, "1.-  d(^)", '<lb n="1" break="no"/><hi rend="circumflex">d</hi>');
   testTransform(null, ".ca.4", '.<gap reason="illegible" quantity="4" unit="character" precision="low"/>');
   testTransform(null, "*stacking-line*", '<g type="stacking-line"/>');
   testTransform(null, "1\n2. ", '1\n<lb n="2"/>');
   testTransform(null, "1\n2.- ", '1\n<lb n="2" break="no"/>');
//   testTransform(null, '(ex(pan?))', '<expan>ex<ex cert="low">pan</ex>')
    testTransform(null, "lost.ca.5lin ", '<gap reason="lost" quantity="5" unit="line" precision="low"/> ');
    testTransform(null, "vestig.ca.5lin ", '<gap reason="illegible" quantity="5" unit="line" precision="low"><desc>vestiges</desc></gap> ');
    testTransform(null, "<:|subst|deletion:>", '<subst><add place="inline"/><del rend="corrected">deletion</del></subst>');
    testTransform(null, "<:lemma|alt|:>", '<app type="alternative"><lem>lemma</lem><rdg/></app>');
    testTransform(null, "<:|alt|reading:>", '<app type="alternative"><lem/><rdg>reading</rdg></app>');
    testTransform(null, "<:|ed|reading:>", '<app type="editorial"><lem/><rdg>reading</rdg></app>');
    testTransform(null, "<:lemma|ed|:>", '<app type="editorial"><lem>lemma</lem><rdg/></app>');
    testTransform(null, "<:|ed|:>", '<app type="editorial"><lem/><rdg/></app>');
    testTransform(null, "<:lem||ed||rdg1|rdg2|||:>", '<app type="editorial"><lem>lem</lem><rdg>rdg1</rdg><rdg>rdg2</rdg><rdg/><rdg/><rdg/></app>');
    testTransform(null, "vac. \n  x", "vac. \n  x");
    testTransform(null, "[ca.6(?)]", '<gap reason="lost" quantity="6" unit="character" precision="low"><certainty match=".." locus="name"/></gap>');
    testTransform(null, "[ca.6(?)] ", '<gap reason="lost" quantity="6" unit="character" precision="low"><certainty match=".." locus="name"/></gap> ');
    testTransform(null, "Apolliṇạri", "Apolli<unclear>na</unclear>ri");
    testTransform(null, "<.4(?)>  [.6(?)]", "<gap reason=\"omitted\" quantity=\"4\" unit=\"character\"><certainty match=\"..\" locus=\"name\"/></gap>  <gap reason=\"lost\" quantity=\"6\" unit=\"character\"><certainty match=\"..\" locus=\"name\"/></gap>");

   // diacritic certLow vs. wrapped certLow (XSugar is inconsistent here)
    testTransform(null, "SuppliedLost         [ ⲓ(¨)(?)]", 'SuppliedLost         <supplied reason="lost" cert="low"><hi rend="diaeresis">ⲓ</hi></supplied>');
    testTransform(null, "SuppliedParallel     |_ ⲓ(¨)(?)_|", 'SuppliedParallel     <supplied evidence="parallel" reason="undefined"><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></supplied>');
    testTransform(null, "SuppliedParallelLost _[ ⲓ(¨)(?)]_", 'SuppliedParallelLost <supplied evidence="parallel" reason="lost"><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></supplied>');
    testTransform(null, "SuppliedOmitted      < ⲓ(¨)(?)>", 'SuppliedOmitted      <supplied reason="omitted"><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></supplied>');
    testTransform(null, "Erasure              〚 ⲓ(¨)(?)〛", 'Erasure              <del rend="erasure"><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></del>');
    testTransform(null, "Erasure              〚X ⲓ(¨)(?)〛", 'Erasure              <del rend="cross-strokes"><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></del>');
    testTransform(null, "Erasure              〚/ ⲓ(¨)(?)〛", 'Erasure              <del rend="slashes"><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></del>');
    testTransform(null, "InsertionAbove       \\ ⲓ(¨)(?)/", 'InsertionAbove       <add place="above"><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></add>');
    testTransform(null, "InsertionBelow       // ⲓ(¨)(?)\\\\", 'InsertionBelow       <add place="below"><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></add>');
    testTransform(null, "InsertionMargin      ||top: ⲓ(¨)(?)||", 'InsertionMargin      <add place="top"><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></add>');
    testTransform(null, "MarginSling          <| ⲓ(¨)(?)|>", 'MarginSling          <add rend="sling" place="margin"><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></add>');
    testTransform(null, "MarginUnderline      <_ ⲓ(¨)(?)_>", 'MarginUnderline      <add rend="underline" place="margin"><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></add>');
    testTransform(null, "TextSubscript        \\| ⲓ(¨)(?)|/", 'TextSubscript        <hi rend="subscript"><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></hi>');
    testTransform(null, "Surplus              { ⲓ(¨)(?)}", 'Surplus              <surplus><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></surplus>');
    testTransform(null, "AbbrevUnresolved     (| ⲓ(¨)(?)|)", 'AbbrevUnresolved     <abbr><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></abbr>');
    testTransform(null, "AbbrevInnerLostEx    (bla[blub(ex) ⲓ(¨)(?)]bla)", 'AbbrevInnerLostEx    <expan>bla<supplied reason="lost">blub<ex>ex</ex><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></supplied>bla</expan>');
    // testTransform(null, 'OrthoReg             <: ⲓ(¨)(?)|reg| ⲓ(¨)(?):>', 'OrthoReg             <choice><reg cert="low"><hi rend="diaeresis">ⲓ</hi></reg><orig><hi rend="diaeresis">ⲓ</hi><certainty match=".." locus="value"/></orig></choice>');
    testTransform(null, "AlternateReading     <: ⲓ(¨)(?)|alt| ⲓ(¨)(?):>", 'AlternateReading     <app type="alternative"><lem><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></lem><rdg><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></rdg></app>');
    testTransform(null, "ScribalCorrection    <: ⲓ(¨)(?)|subst| ⲓ(¨)(?):>", 'ScribalCorrection    <subst><add place="inline"><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></add><del rend="corrected"><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></del></subst>');
    // testTransform(null, 'SpellingCorrection   <: ⲓ(¨)(?)|corr| ⲓ(¨)(?):>', 'SpellingCorrection   <choice><corr cert="low"><hi rend="diaeresis">ⲓ</hi></corr><sic><hi rend="diaeresis">ⲓ</hi><certainty match=".." locus="value"/></sic></choice>');
    testTransform(null, "EditorialCorrection  <: ⲓ(¨)(?)|ed| ⲓ(¨)(?):>", 'EditorialCorrection  <app type="editorial"><lem><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></lem><rdg><hi rend="diaeresis">ⲓ<certainty match=".." locus="value"/></hi></rdg></app>');


   // maybe someone finds glyphs erased with slashes...
    testTransform(null, "〚/*asfd*〛", '<del rend="slashes"><g type="asfd"/></del>');

    // Document structure
    testTransform("One Div", "<S=.grc\n<D=.r <= => =D>", "<div xml:lang=\"grc\" type=\"edition\" xml:space=\"preserve\">\n<div n=\"r\" type=\"textpart\"> <ab> </ab> </div></div>", "Document");
    testTransform("Two Divs", "<S=.grc\n<D=.r <= => =D>\n<D=.v <= => =D>", "<div xml:lang=\"grc\" type=\"edition\" xml:space=\"preserve\">\n<div n=\"r\" type=\"textpart\"> <ab> </ab> </div>\n<div n=\"v\" type=\"textpart\"> <ab> </ab> </div></div>", "Document");
    testTransform("One Ab and two Divs", "<S=.grc\n<= =>\n<D=.r <= => =D>\n<D=.v <= => =D>", "<div xml:lang=\"grc\" type=\"edition\" xml:space=\"preserve\">\n<ab> </ab>\n<div n=\"r\" type=\"textpart\"> <ab> </ab> </div>\n<div n=\"v\" type=\"textpart\"> <ab> </ab> </div></div>", "Document");
    testTransform("Two Abs and two Divs", "<S=.grc\n<= =>\n<= =>\n<D=.r <= => =D>\n<D=.v <= => =D>", "<div xml:lang=\"grc\" type=\"edition\" xml:space=\"preserve\">\n<ab> </ab>\n<ab> </ab>\n<div n=\"r\" type=\"textpart\"> <ab> </ab> </div>\n<div n=\"v\" type=\"textpart\"> <ab> </ab> </div></div>", "Document");
    testTransform("Two Abs", "<S=.grc\n<= =>\n<= =>", "<div xml:lang=\"grc\" type=\"edition\" xml:space=\"preserve\">\n<ab> </ab>\n<ab> </ab></div>", "Document");
    testTransform("One Ab and one Div inside Div", "<S=.grc\n<D=.r<=\n=><D=.i.column<=\n=>=D>\n=D>", "<div xml:lang=\"grc\" type=\"edition\" xml:space=\"preserve\">\n<div n=\"r\" type=\"textpart\"><ab>\n</ab><div n=\"i\" subtype=\"column\" type=\"textpart\"><ab>\n</ab></div>\n</div></div>", "Document");

    // aegyptus;90;44
   testTransform(null, "ἕ̣ν̣̄".normalize("NFC"), '<unclear>ἕ</unclear><hi rend="supraline"><unclear>ν</unclear></hi>'.normalize("NFC"));

    // aegyptus;94;70_4r
    testTransform(null, "(15, outdent)ἀπὸ ὁμολόγου λαογραφίας τῆς κώμης vac. [.?]".normalize("NFC"), '<lb n="15" rend="outdent"/>ἀπὸ ὁμολόγου λαογραφίας τῆς κώμης vac. <gap reason="lost" extent="unknown" unit="character"/>'.normalize("NFC"));

    // aegyptus;94;72_4v (unclear U+10178 GREEK THREE QUARTERS SIGN, surrogate pair)
    testTransform(null, "<#𐅸̣=3/4#>", '<num value="3/4"><unclear>𐅸</unclear></num>');

    // aegyptus;98;143_1 // glyph without space after
    testTransform(null, "Ζμε̣ν*apostrophe*τπῶ".normalize("NFC"), 'Ζμ<unclear>ε</unclear>ν<g type="apostrophe"/>τπῶ'.normalize("NFC") );

    // analpap;29;109 (glyph inside SuppliedLost)
    testTransform(null, "[μος στοιχεῖ μοι *stauros*]".normalize("NFC") ,'<supplied reason="lost">μος στοιχεῖ μοι <g type="stauros"/></supplied>'.normalize("NFC"));

    // apf;57;95_97 (vestig standalone cert low)
    testTransform(null, "2. vestig(?)  (γί(νεται))".normalize("NFC"), '<lb n="2"/><gap reason="illegible" extent="unknown" unit="character"><desc>vestiges</desc><certainty match=".." locus="name"/></gap> <expan>γί<ex>νεται</ex></expan>'.normalize("NFC"));

    // bgu.1.52.txt (token words ("margin", "left") as text)
    testTransform(null, "21. /*in the margin to the left of lines 4-6*/", '<lb n="21"/><note xml:lang="en">in the margin to the left of lines 4-6</note>');

    // bgu;12;2139 (supraline unclear with combining character)
    testTransform(null, "ί̣̄", '<hi rend="supraline"><unclear>ί</unclear></hi>');

    // bgu;14;2431 (superscript as inline content in abbr/expan)
    testTransform(null, "(|^κ̣^|(ατοίκων))".normalize("NFC"), '<expan><hi rend="superscript"><unclear>κ</unclear></hi><ex>ατοίκων</ex></expan>'.normalize("NFC"));

    // bgu.14.2433 (add above followed by glyph: \xyz/*stauros* interfering with /* note */
    testTransform(null, "\\ <#κη=28#> <#𐅵=1/2#> /*parens-punctuation-closing*".normalize("NFC"), '<add place="above"> <num value="28">κη</num> <num value="1/2">𐅵</num> </add><g type="parens-punctuation-closing"/>'.normalize("NFC"));

    // bgu.14.2441 (vestig with characters before, no space)
    testTransform(null, "Διοφαντvestig ", 'Διοφαντ<gap reason="illegible" extent="unknown" unit="character"><desc>vestiges</desc></gap>');

    // bgu.16.2576 (Superscript inside unresolved abbrev)
    testTransform(null, "(||^ω^||)", '<abbr><hi rend="superscript">ω</hi></abbr>');

    // bgu.2.408 (empty Reg in multi-reg EditorialCorrection [makes no sense...?])
    testTransform(null, "<:<τὸ <#δ=4#>>=W.G. Claytor, ZPE 222 (2022) 191||ed||<τὸ <#γ=3#>>=BL 8.26|:>".normalize("NFC"), '<app type="editorial"><lem resp="W.G. Claytor, ZPE 222 (2022) 191"><supplied reason="omitted">τὸ <num value="4">δ</num></supplied></lem><rdg resp="BL 8.26"><supplied reason="omitted">τὸ <num value="3">γ</num></supplied></rdg><rdg/></app>'.normalize("NFC"));

    // bgu.20.2851 (nested expans)
    testTransform(null, "((δραχμὰς) ((γίνονται)) (με(τὰ λόγον)))".normalize("NFC"), "<expan><ex>δραχμὰς</ex> <expan><ex>γίνονται</ex></expan> <expan>με<ex>τὰ λόγον</ex></expan></expan>".normalize("NFC"));

    // bgu.4.1114 (nested insertion above)
    testTransform(null, "\\ \\.2 Ὀ̣π̣τ̣ά̣τ̣ο̣υ̣ .2//".normalize(), '<add place="above"> <add place="above"><gap reason="illegible" quantity="2" unit="character"/> <unclear>Ὀπτάτου</unclear> <gap reason="illegible" quantity="2" unit="character"/></add></add>'.normalize());

    // bifao.117.108_5
    testTransform(null, "[ca.1-2]", '<supplied reason="lost"><gap reason="illegible" quantity="1" unit="character" precision="low"/>-2</supplied>');

    // c.ep.lat.163 (reserved keyword "ca" with diacrit)
    testTransform(null, "cạṣ", "c<unclear>as</unclear>");

    // c.ep.lat.222
    testTransform(null, "~| (ἡγεμ(όνι)) Φοινί̣ d//κης\\\\|~grc ".normalize(), '<foreign xml:lang="grc"> <expan>ἡγεμ<ex>όνι</ex></expan> Φοιν<unclear>ί</unclear> d<add place="below">κης</add></foreign>'.normalize());

    // cpr.18.27 (editorial note inside del)
    testTransform(null, "〚/*tachygraphy*/〛", '<del rend="erasure"><note xml:lang="en">tachygraphy</note></del>');

    // cpr.19.65 (' with supraline [but probably not what is meant because it's inside num, maybe they wanted a num rend=tick?)])
    // interesting: this test fails with normalization
    testTransform(null, "<#ῑβ̄ ̄'̄=1/12#>", '<num value="1/12"><hi rend="supraline">ιβ \'</hi></num>');

    // cpr.24.4 (unclear number in a sequence of numbers)
    testTransform(null, "1192̣", "119<unclear>2</unclear>");
    testTransform(null, ".1192̣", '<gap reason="illegible" quantity="119" unit="character"/><unclear>2</unclear>');

    // chla.20.709 ("lin" in expansion)
    testTransform(null, "(gal(linas))", "<expan>gal<ex>linas</ex></expan>");

    // cpr.36.52 (combining char problem, also in cpr.8.18 lb9 and o.claud.4.841)
    testTransform(null, "δύ̄".normalize(), 'δ<hi rend="supraline">ύ</hi>'.normalize());

    // cpr.7.8 (editorial note inside insertion above)
    testTransform(null, "\\κα̣ὶ̣ μὴ ὁμολογη〚.1〛/*?*//".normalize(), '<add place="above">κ<unclear>αὶ</unclear> μὴ ὁμολογη<del rend="erasure"><gap reason="illegible" quantity="1" unit="character"/></del><note xml:lang="en">?</note></add>'.normalize());

    // cpr.36.52
    testTransform(null, "δύ̄ο̄".normalize(), 'δ<hi rend="supraline">ύο</hi>'.normalize());

    // o.abu.mina.981
    testTransform(null, "κ̣α̣.2\n3.- ", '<unclear>κα</unclear><gap reason="illegible" quantity="2" unit="character"/>\n<lb n="3" break="no"/>');

    // o.brux.5
    testTransform(null, "Θ.5ῶ5.- τος".normalize(), 'Θ<gap reason="illegible" quantity="5" unit="character"/>ῶ<lb n="5" break="no"/>τος'.normalize());

    // o.heid.356 (number with space+tick on left side)
    testTransform(null, "<#κ̣ 'δ̣ '=1/24#>".normalize(), '<num value="1/24" rend="tick"><unclear>κ</unclear> \'<unclear>δ</unclear></num>'.normalize());

    // p.bagnall.43 (one space num with tick)
    testTransform(null, "<# '=#>", "<num> '</num>");
    testTransform(null, "<# '=3#>", '<num value="3"> \'</num>');

    // p.diog.10 (diacrit for digit)
    testTransform(null, " 3(´)", '<hi rend="acute">3</hi>');

    // p.flor.1.66 (uncertain diaeresis inside subscript)
    testTransform(null, "\\| ἱ(¨)(?)|/".normalize(), '<hi rend="subscript"><hi rend="diaeresis">ἱ<certainty match=".." locus="value"/></hi></hi>'.normalize());
    testTransform(null, "\\| ἱ(¨)(?)(?)|/".normalize(), '<hi rend="subscript"><hi rend="diaeresis">ἱ<certainty match=".." locus="value"/></hi><certainty match=".." locus="value"/></hi>'.normalize());

    // p.koelnaegypt.2.54 (uncertain diaeresis inside supplied lost)
    testTransform(null, "[ ⲓ(¨)(?)]", '<supplied reason="lost" cert="low"><hi rend="diaeresis">ⲓ</hi></supplied>');

    // p.heid.9.431
    testTransform(null, "40,afterR19.- δεῖξαι καὶ Σαραπ̣ί̣".normalize(), '<lb n="40,afterR19" break="no"/>δεῖξαι καὶ Σαρα<unclear>πί</unclear>'.normalize());

    // p.heid.10.447
    testTransform(null, "[14.- ο]", '<supplied reason="lost"><lb n="14" break="no"/>ο</supplied>');

    /// p.mich.1.42 (linebreak: latin characters only)
    testTransform(null, "11. 20Κρίτων. ".normalize(), '<lb n="11"/>20Κρίτων. '.normalize());

    // p.mich.8.490 (supraline inside supplied parallel
    testTransform(null, "|_¯Παχὼν <#κε=25#>¯_|".normalize(), '<supplied evidence="parallel" reason="undefined"><hi rend="supraline">Παχὼν <num value="25">κε</num></hi></supplied>'.normalize());

    // p.tebt.4.1114 (expan starting with number and comma (interference with LineBreakSpecial)
    testTransform(null, "(3,(γίνονται))".normalize(), "<expan>3,<ex>γίνονται</ex></expan>");

    // p.petr.kleon.11 (editorial note inside EditorialCorrection rdg
    testTransform(null, "<:γ[ε τὴ]ν=Wilcken||ed||[περὶ τὴ]ν=Mahaffy|[κατὰ τὴ]ν=Wilamowitz|/*also vielleicht ((κατ’)) αὐτήν γ[ε τὴ]ν*/=Van Beek:>".normalize(), '<app type="editorial"><lem resp="Wilcken">γ<supplied reason="lost">ε τὴ</supplied>ν</lem><rdg resp="Mahaffy"><supplied reason="lost">περὶ τὴ</supplied>ν</rdg><rdg resp="Wilamowitz"><supplied reason="lost">κατὰ τὴ</supplied>ν</rdg><rdg resp="Van Beek"><note xml:lang="en">also vielleicht <expan><ex>κατ’</ex></expan> αὐτήν γ<supplied reason="lost">ε τὴ</supplied>ν</note></rdg></app>'.normalize());

    // p.lond.2.328 (XSugar doesn't parse handshift inside one-line editorial note)
    testTransform(null, "$m7 /*possibly the same as $m1*/".normalize(), '<handShift new="m7"/><note xml:lang="en">possibly the same as $m1</note>'.normalize());
});

describe("idp_errors", () => {
    testTransform(null, "vestig.ca.5li ", 'vestig.<gap reason="illegible" quantity="5" unit="character" precision="low"/>li ');
    testTransform(null, "lost.ca.5li ", 'lost.<gap reason="illegible" quantity="5" unit="character" precision="low"/>li ');

    // analpap.23_24.319
    testTransform(null, "vestig.12.lin", 'vestig<gap reason="illegible" quantity="12" unit="character"/>.lin');

    // apf.66.36
    testTransform(null, "[ca.?]", '<supplied reason="lost">ca<gap reason="illegible" extent="unknown" unit="character"/></supplied>');

    // basp.47.96
    testTransform(null, "[.ca2-3]", '<supplied reason="lost">.ca2-3</supplied>');

    // basp.48.54
    testTransform(null, "[.ca2]", '<supplied reason="lost">.ca2</supplied>');

    // bgu.19.2801vlin9_17
    testTransform(null, "15. .ca20", '<lb n="15"/>.ca20');

    // bgu.4.1104 (also bgu.4.1122: 5.-)
    testTransform(null, "α̣ὐ̣10.-(το(ῦ))".normalize(), "<unclear>αὐ</unclear>10.-<expan>το<ex>ῦ</ex></expan>".normalize());

    // bgu.19.2764v, chla.11.484, cpr.10.39, p.iand.zen.78, p.mil.congr.xvii.pg21_22 ("range" of lines for lb)
    testTransform(null, "11-13. ", '11-<lb n="13"/>');

    // cpr.4.114 (also cpr.4.190)
    testTransform(null, "vestig.ca.15", 'vestig.<gap reason="illegible" quantity="15" unit="character" precision="low"/>');

    // cpr.4.52 (<: :> without identifier inside (|ed|, |reg| etc.), XSugar recognizes as SuppliedOmitted with content wrapped in ":")
    // cannot reproduce XSugar behavior using ambiguity without running intro
    // problems with Lezer's branch pruning behavior
    //testTransform(null, '<:ⲡ<:ὅρος=grc|reg|ϩⲟⲣ[ⲟⲥ]:>ⲫⲟⲣ[ⲟⲥ]:>'.normalize(), '<supplied reason="omitted">:ⲡ<choice><reg xml:lang="grc">ὅρος</reg><orig>ϩⲟⲣ<supplied reason="lost">ⲟⲥ</supplied></orig></choice>ⲫⲟⲣ<supplied reason="lost">ⲟⲥ</supplied>:</supplied>'.normalize())

    //cpr.4.72
    testTransform(null, "vestig.7cha", 'vestig<gap reason="illegible" quantity="7" unit="character"/>cha');

    // cpr.7.54 (illegible num chars followed by line break)
    testTransform(null, ".126.- ", '<gap reason="illegible" quantity="12" unit="character"/><lb n="6" break="no"/>');
    testTransform(null, "126.- ", '<lb n="126" break="no"/>');
    testTransform(null, ".123.-", '<gap reason="illegible" quantity="123" unit="character"/>.-');

    // o.frange.15 (space with diaeresis? intentional?)
    testTransform(null, "ⲧ  (¨)".normalize(), 'ⲧ<hi rend="diaeresis"> </hi>'.normalize());

    // o.frange.94 (line break wrapped + diacritic with one missing space inbetween)
    testTransform(null, "12.- ⲩ(¨)ⲥⲏⲥ ϫⲉ ϥ".normalize(), '12.-<hi rend="diaeresis">ⲩ</hi>ⲥⲏⲥ ϫⲉ ϥ'.normalize());

    // p.amh.2.95 (incomplete range)
    testTransform(null, ".2-[.10]", '<gap reason="illegible" quantity="2" unit="character"/>-<gap reason="lost" quantity="10" unit="character"/>');
    testTransform(null, "vac.2- lost.2- vestig.2-", '<space quantity="2" unit="character"/>- lost<gap reason="illegible" quantity="2" unit="character"/>- vestig<gap reason="illegible" quantity="2" unit="character"/>-');
    //testTransform(null, 'lost.2-lin vestig.2-lin vestig.2-char', 'lost<gap reason="illegible" quantity="2" unit="character"/>-lin vestig<gap reason="illegible" quantity="2" unit="character"/>-lin vestig<gap reason="illegible" quantity="2" unit="character"/>-char');

    // p.koeln.14.592 (supraline macron on dot and number)
    testTransform(null, ".̄1̄[.̄1̄]", '<hi rend="supraline">.1</hi><supplied reason="lost"><hi rend="supraline">.1</hi></supplied>');

    // p.koeln.16.647 (div corresp not starting with #)
    testTransform(null, "<S=.grc <D=.a.b.fragment <= => =D>", '<div xml:lang="grc" type="edition" xml:space="preserve"> <div n="a" subtype="b" type="textpart" corresp="fragment"> <ab> </ab> </div></div>', "Document");

    // o.douch.2.104 (empty filler)
    testTransform(null, "*filler*", '<g type="filler"/>');
});