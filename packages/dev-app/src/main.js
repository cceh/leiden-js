import {EditorView, showPanel} from "@codemirror/view"
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
import {toolbarPanel} from "./toolbar";

const syntaxTreeNodeMap = new NodeWeakMap();

function createTreeNode(cursor) {
    const div = document.createElement('div');
    syntaxTreeNodeMap.cursorSet(cursor, div);

    div.className = 'tree-node';
    div.dataset.from = cursor.from;
    div.dataset.to = cursor.to;

    const content = document.createElement('div');
    content.className = 'node-content';

    // Check if the current node has children by attempting to move into them
    let hasChildren = cursor.firstChild();
    if (hasChildren) {
        // Move back up after checking
        cursor.parent();
    }

    if (hasChildren) {
        const toggle = document.createElement('span');
        toggle.className = 'toggle';
        toggle.textContent = '−';
        toggle.onclick = (e) => {
            e.stopPropagation();
            div.classList.toggle('collapsed');
            toggle.textContent = div.classList.contains('collapsed') ? '+' : '−';
        };
        content.appendChild(toggle);
    }

    const name = document.createElement('span');
    name.className = 'node-name';
    name.textContent = cursor.name;
    content.appendChild(name);
    div.appendChild(content);

    // Clicking the node selects the corresponding text in the editor
    div.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.leidenEditorView) {
            const from = Number(div.dataset.from);
            const to = Number(div.dataset.to);
            window.leidenEditorView.dispatch({
                selection: {anchor: from, head: to}
            });
            window.leidenEditorView.focus();
        }
    });

    // If the node has children, dive in and create their nodes
    if (hasChildren && cursor.firstChild()) {
        const childrenDiv = document.createElement('div');
        childrenDiv.className = 'children';

        do {
            childrenDiv.appendChild(createTreeNode(cursor));
        } while (cursor.nextSibling());

        // Move back up to the parent node after processing children
        cursor.parent();
        div.appendChild(childrenDiv);
    }

    return div;
}

function highlightCurrentNodeInTree(syntaxNode) {
    const treeContent = document.getElementById('parse-tree-content');
    const nodes = treeContent.querySelectorAll('.tree-node');
    nodes.forEach(node => node.classList.remove('highlighted'));

    const treeNode = syntaxTreeNodeMap.get(syntaxNode);
    treeNode.classList.add('highlighted');
    treeNode.scrollIntoView({block: 'center', behavior: 'auto'});
}

function updateDebugInfo(view) {
    const tree = syntaxTree(view.state);
    const pos = view.state.selection.main.head;
    const line = view.state.doc.lineAt(pos);

    // Update tree view
    const treeContent = document.getElementById('parse-tree-content');
    treeContent.innerHTML = '';
    const rootNode = createTreeNode(tree.cursor());
    treeContent.appendChild(rootNode);
    setTimeout(() => {
        // Highlight the current node corresponding to the cursor position
        const token = tree.resolveInner(pos);

        highlightCurrentNodeInTree(token);

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
                updateDebugInfo(update.view);
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
            }
        }),
        diagnosticsStateField,
        lintGutter(),
        showPanel.of(statusBarPanel),
        showPanel.of(toolbarPanel)
    ],
    parent: document.querySelector('.leiden-pane')
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
                window.leidenEditorView.dispatch({ changes: {
                        from: 0,
                        to: window.leidenEditorView.state.doc.length,
                        insert: convertToLeiden(doc)
                    },
                    annotations: syncAnnotation.of(true)
                })
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


window.xmlEditorView = new EditorView({
    doc: convertToXml(doc),
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
    parent: document.querySelector('.xml-pane')
})

// Initial update
updateDebugInfo(window.leidenEditorView);
