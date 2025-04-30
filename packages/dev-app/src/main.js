/* global leidenEditorView */
/* global xmlEditorView */

import { EditorView, showPanel } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { forceParsing, syntaxTree, syntaxTreeAvailable } from "@codemirror/language";
import { Annotation, Compartment, StateField } from "@codemirror/state";
import {
    fromXml as xmlToLeidenPlus,
    toXml as leidenPlusToXml,
    TransformationError as LeidenPlusTransformationError
} from "@leiden-js/transformer-leiden-plus";
import {
    fromXml as xmlToLeidenTrans,
    toXml as leidenTransToXml,
    TransformationError as LeidenTransTransformationError
} from "@leiden-js/transformer-leiden-trans";

import { xml } from "@codemirror/lang-xml";
import { linter, lintGutter, setDiagnosticsEffect } from "@codemirror/lint";
import "./styles/cardo.css";
import { oneDarkTheme } from "@codemirror/theme-one-dark";
import { leidenPlus } from "@leiden-js/codemirror-leiden-plus";

import { clearParseTree, highlightCurrentNodeInTree, initTreeView, updateDebugInfo, updateParseTree } from "./treeView";
import { leidenTranslation } from "@leiden-js/codemirror-leiden-trans";


/* LINTING / DIAGNOSTICS */

// State field that makes diagnostics set by linters accessible
const diagnosticsStateField = StateField.define({
    create: () => [],
    update: (currentDiagnostics, transaction) => {
        let diagnostics = currentDiagnostics;

        for (const effect of transaction.effects) {
            if (effect.is(setDiagnosticsEffect)) {
                diagnostics = effect.value;
            }
        }

        return diagnostics;
    },
});


// Create a status bar panel that shows only one diagnostic
function statusBarPanel(view) {
    let dom = document.createElement("div");
    return {
        dom,
        update(update) {
            const diagnostics = update.state.field(diagnosticsStateField);
            const firstDiagnostic = diagnostics?.[0];
            if (firstDiagnostic && firstDiagnostic.to <= update.state.doc.length) {
                const line = view.state.doc.lineAt(firstDiagnostic.from);
                dom.textContent = `${firstDiagnostic.message}: Line ${line.number}`;
            } else {
                dom.innerText = "";
            }
        }
    };
}


/* LANGUAGE FEATURES */

// Re-configurable editor extension compartment for the language extensions
const language = new Compartment;

function getLanguageExtensions(selectValue) {
    const [variant, topNode] = selectValue.split(".");
    // const config = {
    //     // highlightStyle: getHighlightStyle(),
    //     topNode
    // };
    const leidenHighlightStyle = themeCheckbox.checked ? "dark" : "light";
    const config = { topNode, leidenHighlightStyle };
    return variant === "leiden-plus"
        ? [leidenPlus(config)]
        : [leidenTranslation(config)];
}

function convertToXml(leiden) {
    const [variant, topNode] = languageSelect.value.split(".");
    return variant === "leiden-plus"
        ? leidenPlusToXml(leiden, topNode)
        : leidenTransToXml(leiden, topNode);
}

function convertToLeiden(xml) {
    const [variant] = languageSelect.value.split(".");
    if (variant === "leiden-plus") {
        return xmlToLeidenPlus(xml);
    } else {
        return xmlToLeidenTrans(xml);
    }
}


// Set up language select button
const languageSelect = document.querySelector("#language-select");
languageSelect.value = localStorage.getItem("leiden-variant") || "leiden-plus.Document";
languageSelect.addEventListener("change", () => {
    const value = languageSelect.value;
    localStorage.setItem("leiden-variant", value);
    leidenEditorView.dispatch({
        effects: language.reconfigure(getLanguageExtensions(value)),
        changes: {
            from: 0,
            to: leidenEditorView.state.doc.length,
            insert: localStorage.getItem(`doc-${value}`)
        }
    });
});



/* THEME */

function getTheme(isDark) {
    return isDark === "true" ? oneDarkTheme : [];
}

// Re-configurable editor extension compartment for the theme extension
const theme = new Compartment;


// Set up dark theme checkbox
const themeCheckbox = document.querySelector("#theme-checkbox");
themeCheckbox.checked = (localStorage.getItem("dark") || "false") === "true";
themeCheckbox.addEventListener("change", () => {
    const isDark = themeCheckbox.checked ? "true" : "false";
    localStorage.setItem("dark", isDark);
    leidenEditorView.dispatch({
        effects: [
            theme.reconfigure(getTheme(isDark)),
            language.reconfigure(getLanguageExtensions(languageSelect.value))
        ]
    });
});


function updateXml(leidenContent) {
    xmlEditorView.dispatch({ changes: {
            from: 0,
            to: xmlEditorView.state.doc.length,
            insert: convertToXml(leidenContent)
        },
        annotations: syncAnnotation.of(true)
    });
}

/*
 * EDITORS
 */

// Initially load doc for current language from local storage
const doc = localStorage.getItem(`doc-${languageSelect.value}`) || "Test your markup here";

// Create a transaction annotation for preventing infinite sync cycles when updating XML/Leiden
const syncAnnotation = Annotation.define();


/* SET UP THE LEIDEN EDITOR */

window.leidenEditorView = new EditorView({
    doc,
    extensions: [
        // Set to the currently selected language
        language.of(getLanguageExtensions(languageSelect.value)),

        // React to document changes
        EditorView.updateListener.of(async update => {
            if (update.transactions.some(tr => tr.annotation(syncAnnotation) === true)) {
                return;
            }

            const isReconfigured = update.transactions.some(tr => tr.reconfigured);
            if (update.docChanged || update.selectionSet || isReconfigured) {

                localStorage.setItem(`doc-${languageSelect.value}`, update.view.state.doc.toString());
                if (localStorage.getItem("xml-open") === "true") {
                    updateXml(update.view.state.doc.toString());
                }

                if (localStorage.getItem("debug-open") === "true") {
                    requestIdleCallback(async () => {
                        forceParsing(leidenEditorView, leidenEditorView.state.selection.main.head);
                        await updateParseTree(update.view);
                        highlightCurrentNodeInTree(update.state);
                    });
                }
            }
        }),

        // custom status bar panel that only shows one error max.
        diagnosticsStateField,
        showPanel.of(statusBarPanel),


        theme.of(getTheme(localStorage.getItem("dark") ?? "false")),
        EditorView.theme({
            ".cm-content": {
                fontFamily: "\"Cardo\", \"Lucida Grande\", \"IFAO-Grec Unicode\", \"Arial Unicode MS\", \"New Athena Unicode\", \"Athena Unicode\", \"Lucida Grande\", \"Verdana\", \"Tahoma\""
            }
        })
    ],
    parent: document.querySelector(".leiden-editor")
});


/* SET UP THE XML EDITOR */

// Find the XML element that raised a transformation error using the path
// returned by the XML->Leiden transformer
function findNodeByPath(state, path) {
    let current = syntaxTree(state).topNode;
    for (let [tagName, idx] of path) {
        idx = idx ?? 0;
        let matches = [];
        for (let c = current.firstChild; c; c = c.nextSibling) {
            if (c.name === "Element") {
                let openTag = c.getChild("OpenTag") || c.getChild("SelfClosingTag");
                let nameNode = openTag && openTag.getChild("TagName");
                if (nameNode && state.doc.sliceString(nameNode.from, nameNode.to) === tagName) {
                    matches.push(c);
                }
            }
        }
        if (!matches[idx]) return null; // no match
        current = matches[idx];
    }
    return current;
}

// State field that reacts to XML changes, updates the
// Leiden editor and tracks any transformation errors
const xmlStateField = StateField.define({
    create() {
        return [];
    },
    update(value, tr) {
        if (tr.annotation(syncAnnotation) === true) {
            return [];
        }


        if (tr.docChanged || tr.reconfigured) {
            const doc = new DOMParser().parseFromString(tr.state.doc.toString(), "text/xml").documentElement;
            try {
                leidenEditorView.dispatch({
                    changes: {
                        from: 0,
                        to: leidenEditorView.state.doc.length,
                        insert: convertToLeiden(doc)
                    },
                    annotations: syncAnnotation.of(true)
                });
            } catch (e) {
                console.log(e);
                if (e instanceof LeidenPlusTransformationError || e instanceof LeidenTransTransformationError) {
                    if (e.path.length > 0 && e.path[e.path.length - 1][0] === "parsererror") {
                        return [{
                            from: 0,
                            to: tr.state.doc.length,
                            severity: "error",
                            message: "Invalid XML"
                        }];
                    }

                    const node = findNodeByPath(tr.state, e.path);
                    if (!node) {
                        return [];
                    }
                    return [{
                        from: node.from,
                        to: node.to,
                        severity: "error",
                        message: e.message
                    }];
                } else {
                    throw e;
                }
            }
            return [];
        }

        return value;
    }
});


// Set up buttons for toggling XML editor
const xmlToggleButton = document.querySelector("#xml-toggle-button");
xmlToggleButton.addEventListener("click", () => {
    const panel = document.querySelector(".xml-container");
    panel.classList.toggle("hidden");
    const open = !panel.classList.contains("hidden");
    localStorage.setItem("xml-open", `${open}`);
    const content = open ? leidenEditorView.state.doc.toString() : "";
    updateXml(content);
});

const xmlPane = document.querySelector(".xml-container");
const xmlOpen = localStorage.getItem("xml-open") === "true";
xmlPane.classList.toggle("hidden", !xmlOpen);

// Set up the XML editor
window.xmlEditorView = new EditorView({
    doc: xmlOpen ? convertToXml(doc) : "",
    extensions: [
        basicSetup,
        language.of(xml()),
        diagnosticsStateField,
        xmlStateField,
        linter(view => {
            const diagnostics = [];
            syntaxTree(view.state).cursor().iterate(node => {
                if (node.type.isError || node.type.name === "MismatchedCloseTag") {
                    diagnostics.push({
                        from: node.from,
                        to: node.to,
                        severity: "error",
                        message: "Syntax error",
                    });
                }
            });
            return diagnostics;
        }),
        linter(view => view.state.field(xmlStateField)),
        lintGutter(),
        showPanel.of(statusBarPanel),
    ],
    parent: document.querySelector(".xml-editor")
});


/* SET UP DEBUG AREA */

const debugToggleButton = document.querySelector("#debug-toggle-button");
debugToggleButton.addEventListener("click",  () => {
    const bodyElement = document.body;
    bodyElement.classList.toggle("debug-closed");
    const open = !bodyElement.classList.contains("debug-closed");
    localStorage.setItem("debug-open", `${open}`);

    if (open) {
        updateDebugInfo(leidenEditorView);
        void updateParseTree(leidenEditorView);
    } else {
        clearParseTree();
    }
});

// Force CodeMirror to parse the whole document, then initialize the syntax tree view
new Promise((resolve) => {
    while (!syntaxTreeAvailable(leidenEditorView.state)) {
        forceParsing(leidenEditorView, leidenEditorView.state.doc.length);
    }
    resolve();

}).then(() => {
    initTreeView(leidenEditorView);
});
