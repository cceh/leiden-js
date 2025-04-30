/* global leidenEditorView */

import {html, nothing, render} from "lit-html";
import {createRef, ref} from "lit-html/directives/ref.js";
import {syntaxTree} from "@codemirror/language";
import {NodeWeakMap} from "@lezer/common";
import {Annotation} from "@codemirror/state";
import {findClosestCertLowAncestor} from "@leiden-js/codemirror-lang-leiden-plus";

const syntaxTreeNodeMap = new NodeWeakMap();
export const selectTreeNodeAnnotation = Annotation.define();

function clearTreeNodeHighlight() {
    const treeContent = document.getElementById("parse-tree-content");
    const nodes = treeContent.querySelectorAll(":scope .tree-node.highlighted");
    nodes.forEach(node => node.classList.remove("highlighted"));
}

function createTreeNode(cursor) {
    const theRef = createRef();
    syntaxTreeNodeMap.cursorSet(cursor, theRef);

    const children = [];
    // If the node has children, dive in and create their nodes
    if (cursor.firstChild()) {
        do {
            if (cursor.name === "Text" && localStorage.getItem("hide-text-nodes") === "true") {
                continue;
            }
            if (cursor.type.is("Delims") && localStorage.getItem("hide-delim-nodes") === "true") {
                continue;
            }

            children.push(createTreeNode(cursor));
        } while (cursor.nextSibling());

        // Move back up to the parent node after processing children
        cursor.parent();
    }

    return html`
        <div ${ref(theRef)} class="tree-node" data-from=${cursor.from} data-to=${cursor.to} @click=${(e) => {
            e.stopPropagation();
            if (leidenEditorView) {
                clearTreeNodeHighlight();
                e.currentTarget.classList.toggle("highlighted");
                const from = Number(e.currentTarget.dataset.from);
                const to = Number(e.currentTarget.dataset.to);                
                leidenEditorView.dispatch({
                    selection: { anchor: from, head: to },
                    scrollIntoView: true,
                    annotations: selectTreeNodeAnnotation.of(true)
                });
                leidenEditorView.focus();
            }
        }}>
            <div class="node-content">
                ${ children.length > 0
                        ? html`<span class="toggle" @click=${((e) => {
                            e.stopPropagation();
                            const node = e.target.closest(".tree-node");
                            node.classList.toggle("collapsed");
                            e.target.textContent = node.classList.contains("collapsed") ? "+" : "−";
                        })}>−</span>` 
                        : html`<span class="spacer">&nbsp;</span>`
                }
                <span class="node-name">${cursor.name}</span>
            </div>
            ${ children.length > 0
                    ? html`<div class="children">${children}</div>`
                    : nothing }
        </div>
    `;
}

export function highlightCurrentNodeInTree(state) {
    clearTreeNodeHighlight();

    const syntaxNode = syntaxTree(state).resolve(state.selection.main.head, 0);

    let node;
    if (localStorage.getItem("hide-text-nodes") === "true" && syntaxNode.type.is("Text")) {
        node = syntaxNode.parent;
    } else if (localStorage.getItem("hide-delim-nodes") === "true" && syntaxNode.type.is("Delims")) {
        node = syntaxNode.parent;
    } else {
        node = syntaxNode;
    }

    const treeNodeRef = syntaxTreeNodeMap.get(node);
    if (!treeNodeRef) {
        return;
    }
    const treeNode = treeNodeRef.value;
    treeNode.classList.add("highlighted");
    treeNode.firstElementChild.scrollIntoView({ block: "center", behavior: "auto" });
}

let updateTreeTimeout = null;

export async function updateParseTree(view) {

    let rejectPromise;

    // Cancel any pending update
    if (updateTreeTimeout) {
        cancelAnimationFrame(updateTreeTimeout);
        rejectPromise?.();
    }
    
    return new Promise((resolve, reject) => {
        rejectPromise = reject;
        updateTreeTimeout = requestAnimationFrame(() => {
            const tree = syntaxTree(view.state);
            const treeContent = document.getElementById("parse-tree-content");

            render(createTreeNode(tree.cursor()), treeContent);
            updateTreeTimeout = null;
            resolve();
        });
    });
}

export function clearParseTree() {
    const treeContent = document.getElementById("parse-tree-content");
    render(nothing, treeContent);
}

export function updateDebugInfo(view) {
    const pos = view.state.selection.main.head;
    const line = view.state.doc.lineAt(pos);

    setTimeout(() => {
        const tree = syntaxTree(view.state);
        const token = tree.resolve(pos, 0);

        const certLowParent = findClosestCertLowAncestor(view.state);

        render(html`
            <div><span class="debug-label">Position: </span>${pos}</div>
            <div><span class="debug-label">Line: </span>${line.number}</div>
            <div><span class="debug-label">Token: </span>${token.name} <button @click=${() => console.log(token.node)}>log</button></div>
            <div><span class="debug-label">CertLowParent: </span>${
            certLowParent
                ? html`${certLowParent.name} <button @click=${() => console.log(certLowParent.node)}>log</button>`
                : html`none`
        }</div>
        `, document.getElementById("debug-info-content"));
    });
}

export function initTreeView(editorView) {
    const hideTextNodesCheckbox = document.querySelector("#hide-text-nodes");
    hideTextNodesCheckbox.addEventListener("input", () => {
        localStorage.setItem("hide-text-nodes", hideTextNodesCheckbox.checked);
        void updateParseTree(editorView);
    });

    const hideDelimNodesCheckbox = document.querySelector("#hide-delim-nodes");
    hideDelimNodesCheckbox.addEventListener("input", () => {
        localStorage.setItem("hide-delim-nodes", hideDelimNodesCheckbox.checked);
        void updateParseTree(editorView);
    });

    hideTextNodesCheckbox.checked = localStorage.getItem("hide-text-nodes") === "true";
    hideDelimNodesCheckbox.checked = localStorage.getItem("hide-delim-nodes") === "true";

    
    const debugOpen = localStorage.getItem("debug-open") === "true";
    
    if (debugOpen) {
        document.body.classList.remove("debug-closed");
    } else {
        document.body.classList.add("debug-closed");
    }
    
    if (debugOpen) {
        updateDebugInfo(editorView);
        void updateParseTree(editorView);
    }
}