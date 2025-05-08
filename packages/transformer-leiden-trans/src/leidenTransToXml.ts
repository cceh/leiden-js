import { SyntaxNode, TreeCursor } from "@lezer/common";
import { parser } from "@leiden-js/parser-leiden-trans";

function text(input: string, node: TreeCursor) {
    return input.substring(node.from, node.to);
}

export function leidenTransToXml(input: string, topNode = "Document", root = parser.configure({ top: topNode }).parse(input)) {
    const xml: string[] = [];
    const selfClosingNodeSet = new WeakSet<SyntaxNode>();

    root.iterate({
        enter: (node: TreeCursor) => {
            if (node.type.isError) {
                xml.push(`<!-- Error:${text(input, node)} -->`);
                return;
            }

            const name = node.name;

            switch (name) {
                case "Document":
                    // xml.push('<body xmlns:xml="http://www.w3.org/XML/1998/namespace">');
                    xml.push("<body>");
                    break;

                case "Translation":
                    xml.push("<div");
                    node.firstChild(); // TranslationStart
                    node.firstChild(); // LanguageId
                    if (node.name === "LanguageId") {
                        xml.push(` xml:lang="${text(input, node)}"`);
                    }
                    xml.push(' type="translation" xml:space="preserve">');
                    break;

                case "P":
                    node.firstChild(); // <=
                    node.nextSibling(); // content or end tag =>
                    if (node.type.is("Delims")) {
                        xml.push("<p/>");
                        node.parent();
                        return false;
                    } else {
                        node.prevSibling();
                        xml.push("<p>");
                    }
                    node.parent();
                    break;

                case "Div":
                    xml.push("<div");
                    node.firstChild(); // <D=.
                    node.nextSibling(); // N
                    xml.push(` n="${text(input, node)}"`);

                    if (node.nextSibling() && node.name === "Subtype") {
                        xml.push(` subtype="${text(input, node)}"`);
                    }

                    xml.push(' type="textpart">');
                    node.parent();
                    break;

                case "LineNum":
                case "LineNumBreak":
                    node.firstChild(); // "(("
                    node.nextSibling(); // Number
                    xml.push(`<milestone unit="line" n="${text(input, node)}"`);
                    if (name === "LineNumBreak") {
                        xml.push(' rend="break"');
                    }
                    xml.push("/>");
                    return false;

                case "Erasure":
                    xml.push("<del>");
                    break;

                // Gap is in the XSugar grammar, but it doesn't work??
                case "Gap": {
                    node.firstChild(); // Illegible or Lost
                    const reason = node.name === "Lost"
                        ? "lost"
                        : "illegible";
                    xml.push(`<gap reason="${reason}" extent="unknown" unit="character"/>`);
                    return false;
                }
                case "Note":
                    xml.push("<note>");
                    node.firstChild(); // "/*"
                    node.nextSibling(); // Content
                    xml.push(text(input, node));
                    node.parent();
                    xml.push("</note>");
                    return false;

                case "Term": {
                    xml.push("<term");
                    node.lastChild(); // ">"
                    node.prevSibling(); // Definition
                    xml.push(` target="${text(input, node)}"`);

                    node.prevSibling(); // =
                    node.prevSibling(); // Either LanguageId or Content
                    if (node.name === "LanguageId") {
                        xml.push(` xml:lang="${text(input, node)}"`);
                        node.prevSibling(); // Content
                    }

                    xml.push(">");
                    break;
                }

                case "Foreign": {
                    node.lastChild(); // ForeignEnd
                    node.lastChild(); // LanguageId
                    if (node.name === "LanguageId") {
                        xml.push(`<foreign xml:lang="${text(input, node)}">`);
                        node.parent(); // ForeignEnd
                    }
                    node.parent();
                    break;
                }

                case "App": {
                    let appResp;

                    xml.push("<app");
                    node.lastChild(); // :>

                    node.prevSibling(); // AppResp or AppType
                    if (node.name === "AppResp") {
                        appResp = text(input, node);
                        node.prevSibling(); // AppType
                    }
                    if (node.name === "AppType") {
                        xml.push(` type="${text(input, node)}"`);
                    }
                    xml.push("><lem");
                    if (appResp) {
                        xml.push(` resp="${appResp}"`);
                    }
                    xml.push(">");
                    node.parent();
                    break;
                }

                case "Text":
                case "Whitespace":
                    xml.push(text(input, node));
                    return false;
            }
        },
        leave: (node) => {
            if (selfClosingNodeSet.has(node.node)) {
                return;
            }

            switch (node.name) {
                case "Document":
                    xml.push("</body>");
                    break;
                case "Translation":
                    xml.push("</div>");
                    break;
                case "P":
                    xml.push("</p>");
                    break;
                case "Div":
                    xml.push("</div>");
                    break;
                case "Erasure":
                    xml.push("</del>");
                    break;
                case "Term":
                    xml.push("</term>");
                    break;
                case "Foreign":
                    xml.push("</foreign>");
                    break;
                case "App":
                    xml.push("</lem></app>");
                    break;
            }
        }
    });

    return xml.join("");
}