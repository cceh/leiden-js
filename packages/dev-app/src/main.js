import {EditorView, hoverTooltip, showPanel, showTooltip} from "@codemirror/view"
import {basicSetup} from "codemirror"
import {leidenPlus} from "@leiden-plus/codemirror-lang-leiden-plus";
import {syntaxTree} from "@codemirror/language";
import {NodeWeakMap} from "@lezer/common";
import {leidenTranslation} from "@leiden-plus/codemirror-lang-leiden-trans";
import {Annotation, Compartment, StateField} from "@codemirror/state";
import {fromXml as xmlToLeidenPlus, toXml as leidenPlusToXml, TransformationError as LeidenPlusTransformationError} from "@leiden-plus/transformer-leiden-plus";
import {fromXml as xmlToLeidenTrans, toXml as leidenTransToXml, TransformationError as LeidenTransTransformationError } from "@leiden-plus/transformer-leiden-trans";

import {xml} from "@codemirror/lang-xml";
import {linter, lintGutter, setDiagnosticsEffect} from "@codemirror/lint";
import {leidenToolbar, toolbarPanel} from "./toolbar";
import {html, nothing, render} from "lit-html";
import {createRef, ref} from "lit-html/directives/ref.js";

import './styles/cardo.css'

const syntaxTreeNodeMap = new NodeWeakMap();
const selectTreeNodeAnnotation = Annotation.define()

function clearTreeNodeHighlight() {
    const treeContent = document.getElementById('parse-tree-content');
    const nodes = treeContent.querySelectorAll(':scope .tree-node.highlighted');
    nodes.forEach(node => node.classList.remove('highlighted'));
}

function createTreeNode(cursor) {
    const theRef = createRef()
    syntaxTreeNodeMap.cursorSet(cursor, theRef);


   const children = []
    // If the node has children, dive in and create their nodes
    if (cursor.firstChild()) {
        do {
            if (cursor.name === "Text" && localStorage.getItem('hide-text-nodes') === 'true') {
                continue
            }
            if (cursor.type.is("Delims") && localStorage.getItem('hide-delim-nodes') === 'true') {
                continue
            }

            children.push(createTreeNode(cursor));
        } while (cursor.nextSibling());

        // Move back up to the parent node after processing children
        cursor.parent();
    }

    return html`
        <div ${ref(theRef)} class="tree-node" data-from=${cursor.from} data-to=${cursor.to} @click=${(e) => {
            e.stopPropagation();
            if (window.leidenEditorView) {
                clearTreeNodeHighlight()
                e.currentTarget.classList.toggle('highlighted');
                const from = Number(e.currentTarget.dataset.from);
                const to = Number(e.currentTarget.dataset.to);                
                window.leidenEditorView.dispatch({
                    selection: {anchor: from, head: to},
                    scrollIntoView: true,
                    annotations: selectTreeNodeAnnotation.of(true)
                });
                window.leidenEditorView.focus();
            }
        }}>
            <div class="node-content">
                ${ children.length > 0
                        ? html`<span class="toggle" @click=${((e) => {
                            e.stopPropagation();
                            const node = e.target.closest('.tree-node')
                            node.classList.toggle('collapsed');
                            e.target.textContent = node.classList.contains('collapsed') ? '+' : '−';
                        })}>−</span>` 
                        : html`<span class="spacer">&nbsp;</span>`
                }
                <span class="node-name">${cursor.name}</span>
            </div>
            ${ children.length > 0
                    ? html`<div class="children">${children}</div>`
                    : nothing }
        </div>
    `
}

function highlightCurrentNodeInTree(syntaxNode) {
    clearTreeNodeHighlight()

    let node
    if (localStorage.getItem('hide-text-nodes') === 'true' && syntaxNode.type.is("Text")) {
        node = syntaxNode.parent
    } else  if (localStorage.getItem('hide-delim-nodes') === 'true' && syntaxNode.type.is("Delims")) {
        node = syntaxNode.parent
    } else {
        node = syntaxNode
    }

    const treeNodeRef = syntaxTreeNodeMap.get(node);
    if (!treeNodeRef) {
        return
    }
    const treeNode = treeNodeRef.value;
    treeNode.classList.add('highlighted');
    treeNode.firstElementChild.scrollIntoView({block: 'center', behavior: 'auto'});
}

function updateParseTree(view) {
    const tree = syntaxTree(view.state);
    const treeContent = document.getElementById('parse-tree-content');
    render(createTreeNode(tree.cursor()), treeContent)

}
function updateDebugInfo(view, highlightNode = true) {
    const pos = view.state.selection.main.head;
    const line = view.state.doc.lineAt(pos);

    setTimeout(() => {
        const tree = syntaxTree(view.state);
        const token = tree.resolve(pos, 0);

        highlightNode && highlightCurrentNodeInTree(token);

        document.getElementById('debug-info-content').innerHTML = `
    <div><span class="debug-label">Position:</span>${pos}</div>
    <div><span class="debug-label">Line:</span>${line.number}</div>
    <div><span class="debug-label">Token:</span>${token.name}</div>
  `;
    })

}

function statusBarPanel(view) {
    let dom = document.createElement("div")
    return {
        dom,
        update(update) {
            const diagnostics = update.state.field(diagnosticsStateField)
            const firstDiagnostic = diagnostics?.[0]
            if (firstDiagnostic && firstDiagnostic.to <= update.state.doc.length) {
                const line = view.state.doc.lineAt(firstDiagnostic.from)
                dom.textContent = `${firstDiagnostic.message}: Line ${line.number}`
            } else {
                dom.innerText = ''
            }
        }
    }
}



function getLanguage(variant) {
    return variant === 'leiden-plus' ? leidenPlus() : leidenTranslation()
}


const language = new Compartment

const languageSelect = document.querySelector('#language-select');
languageSelect.value = localStorage.getItem('leiden-variant') || 'leiden-plus'
languageSelect.addEventListener('change', (e) => {
    localStorage.setItem('leiden-variant', e.target.value)
    window.leidenEditorView.dispatch({
        effects: language.reconfigure(getLanguage(e.target.value)),
        changes: {
            from: 0,
            to: window.leidenEditorView.state.doc.length,
            insert: localStorage.getItem(`doc-${e.target.value}`)
        }
    })
})

function convertToXml(leiden) {
    if (languageSelect.value === 'leiden-plus') {
        return leidenPlusToXml(leiden)
    } else {
        return leidenTransToXml(leiden)
    }
}

function convertToLeiden(xml) {
    if (languageSelect.value === 'leiden-plus') {
        return xmlToLeidenPlus(xml)
    } else {
        return xmlToLeidenTrans(xml)
    }
}

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



const doc = localStorage.getItem(`doc-${languageSelect.value}`) || "Test your markup here"
const syncAnnotation = Annotation.define()

// Create the editor view and store it globally for reference
window.leidenEditorView = new EditorView({
    doc,
    extensions: [
        basicSetup,
        language.of(getLanguage(languageSelect.value)),
        EditorView.updateListener.of(update => {
            if (update.transactions.some(tr => tr.annotation(syncAnnotation) === true)) {
                return
            }

            const isReconfigured = update.transactions.some(tr => tr.reconfigured)


            if (update.docChanged || update.selectionSet || isReconfigured) {
                if (localStorage.getItem('debug-open') === 'true') {
                    const scrollTree = !update.transactions.some(tr => tr.annotation(selectTreeNodeAnnotation) === true)
                    updateDebugInfo(update.view, scrollTree);
                }
            }


            if (update.docChanged || isReconfigured) {
                localStorage.setItem(`doc-${languageSelect.value}`, update.view.state.doc.toString())
                window.xmlEditorView.dispatch({changes: {
                        from: 0,
                        to: window.xmlEditorView.state.doc.length,
                        insert: convertToXml(update.view.state.doc.toString())
                    },
                    annotations: syncAnnotation.of(true)
                })
                if (localStorage.getItem('debug-open') === 'true') {
                    setTimeout(() => updateParseTree(update.view))
                }
            }
        }),
        diagnosticsStateField,
        lintGutter(),
        showPanel.of(statusBarPanel),
        leidenToolbar,
        EditorView.theme({
            ".cm-content": {
                fontFamily: `"Cardo", "Lucida Grande", "IFAO-Grec Unicode", "Arial Unicode MS", "New Athena Unicode", "Athena Unicode", "Lucida Grande", "Verdana", "Tahoma"`
            }
        })
    ],
    parent: document.querySelector('.leiden-editor')
});


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


const xmlStateField = StateField.define({
    create() {
        return []
    },
    update(value, tr) {
        if (tr.annotation(syncAnnotation) === true) {
            return []
        }

        if (tr.docChanged || tr.reconfigured) {
            const doc = new DOMParser().parseFromString(tr.state.doc.toString(), 'text/xml').documentElement
            try {
                if (localStorage.getItem('xml-open') === 'true') {
                    window.leidenEditorView.dispatch({ changes: {
                            from: 0,
                            to: window.leidenEditorView.state.doc.length,
                            insert: convertToLeiden(doc)
                        },
                        annotations: syncAnnotation.of(true)
                    })
                }
            } catch (e) {
                if (e instanceof LeidenPlusTransformationError || e instanceof LeidenTransTransformationError) {
                    const node = findNodeByPath(tr.state, e.path)
                    if (!node) {
                        return []
                    }

                    return [{
                        from: node.from,
                        to: node.to,
                        severity: "error",
                        message: e.message
                    }]
                } else {
                    throw e
                }
            }
            return []
        }

        return value;
    }
})


const hideTextNodesCheckbox = document.querySelector('#hide-text-nodes')
hideTextNodesCheckbox.addEventListener("input", (e) => {
    localStorage.setItem('hide-text-nodes', e.currentTarget.checked);
    updateParseTree(window.leidenEditorView);
})

const hideDelimNodesCheckbox = document.querySelector('#hide-delim-nodes')
hideDelimNodesCheckbox.addEventListener("input", (e) => {
    localStorage.setItem('hide-delim-nodes', e.currentTarget.checked);
    updateParseTree(window.leidenEditorView);
})

hideTextNodesCheckbox.checked = localStorage.getItem('hide-text-nodes') === 'true'
hideDelimNodesCheckbox.checked = localStorage.getItem('hide-delim-nodes') === 'true'

const debugToggleButton = document.querySelector('#debug-toggle-button')
debugToggleButton.addEventListener("click", (e) => {
    const panel = document.querySelector('.debug-pane')
    panel.classList.toggle('hidden')
    const open = !panel.classList.contains('hidden')
    localStorage.setItem('debug-open', `${open}`);
    if (open) {
        updateDebugInfo(window.leidenEditorView);
        updateParseTree(window.leidenEditorView);
    }
})
const debugPane = document.querySelector('.debug-pane')
const debugOpen = localStorage.getItem('debug-open') === 'true'
debugPane.classList.toggle('hidden', !debugOpen)

const xmlToggleButton = document.querySelector('#xml-toggle-button')
xmlToggleButton.addEventListener("click", (e) => {
    const panel = document.querySelector('.xml-container')
    panel.classList.toggle('hidden')
    const open = !panel.classList.contains('hidden')
    localStorage.setItem('xml-open', `${open}`);
    const content = open ? convertToXml(window.leidenEditorView.state.doc.toString()) : ""
    window.xmlEditorView.dispatch({changes: {
            from: 0,
            to: window.xmlEditorView.state.doc.length,
            insert: content
        },
        annotations: syncAnnotation.of(true)
    })
})

const xmlPane = document.querySelector('.xml-container')
const xmlOpen = localStorage.getItem('xml-open') === 'true'
xmlPane.classList.toggle('hidden', !xmlOpen)

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
                    })
                }
            })
            return diagnostics
        }),
        linter(view => view.state.field(xmlStateField)),
        lintGutter(),
        showPanel.of(statusBarPanel),
    ],
    parent: document.querySelector('.xml-editor')
})

// Initial update
if (debugOpen) {
    updateDebugInfo(window.leidenEditorView);
    updateParseTree(window.leidenEditorView);
}