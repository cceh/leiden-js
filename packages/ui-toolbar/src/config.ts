import {EditorState, Facet, StateField, Transaction} from "@codemirror/state";
import {EditorView} from "@codemirror/view";

type ItemType = "divider" | "action" | "menu" | "split"

interface ItemBase {
    id: string
    type: ItemType
    label: string
    active: boolean
}

export interface ActionItemBase extends ItemBase {
    action: (view: EditorView) => boolean
}

export interface ActionItem extends ActionItemBase {
    type: "action"
}

export type MenuItem = (ActionItem | MenuTrigger) & {
    info?: string
}

interface MenuTrigger extends ItemBase {
    type: "menu"
    items: MenuItem[]
}

interface ToolbarItemBase {
    tooltip?: string
}

export interface ToolbarHoverActionBase {
    hoverAction?: {
        enter: (view: EditorView) => void
        leave: (view: EditorView) => void
    }
}

export type ToolbarActionItem = ActionItem & ToolbarItemBase & ToolbarHoverActionBase
export type ToolbarMenuTrigger = MenuTrigger & ToolbarItemBase
export type ToolbarSplitItem =
    Omit<ToolbarActionItem, "type"> &
    Omit<ToolbarMenuTrigger, "type"> &
    ToolbarHoverActionBase & {
    type: "split",
    menuTooltip?: string
}

export type ToolbarItem = ToolbarActionItem | ToolbarMenuTrigger | ToolbarSplitItem | DividerItem

export interface DividerItem {
    type: "divider"
}

export interface ToolbarConfig {
    items: ToolbarItem[],
    contextItems?: ToolbarItem[]
}

export const toolbarConfigFacet = Facet.define<(state: EditorState) => ToolbarConfig, (state: EditorState) => ToolbarConfig>({
    combine(inputs) {
        return inputs[inputs.length - 1]
    }
})

const applyConfig = (state: EditorState): ToolbarConfig => {
    const configFn = state.facet(toolbarConfigFacet)
    return configFn(state)
}

export const toolbarConfigStateField = StateField.define<ToolbarConfig>({
    create(state) {
        return applyConfig(state)
    },
    update(_value: ToolbarConfig, transaction: Transaction) {
        return applyConfig(transaction.state)
    }
})