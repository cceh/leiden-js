import {EditorState, Facet, StateField, Transaction} from "@codemirror/state";
import {EditorView} from "@codemirror/view";

// Base properties
interface BaseProps {
    id: string;
    label: string | HTMLElement;
    active?: boolean;
}

interface MenuTriggerProps {
    items: MenuItem[];
}

interface ToolbarItemProps {
    tooltip?: string;
}

export interface ActionCapableItem {
    action: (view: EditorView) => void;
}


export interface HoverActionCapableItem {
    hoverAction?: {
        enter: (view: EditorView) => void;
        leave: (view: EditorView) => void;
    };
}

// Menu item types
export interface ActionItem extends BaseProps, ActionCapableItem {
    type: "action";
    info?: string;
}

export interface MenuTrigger extends BaseProps, MenuTriggerProps {
    type: "menu";
    info?: string;
}

export type MenuItem = ActionItem | MenuTrigger;

// Toolbar item types
export type ToolbarActionItem = ActionItem & ToolbarItemProps & HoverActionCapableItem;

export type ToolbarMenuTrigger = MenuTrigger & ToolbarItemProps;

export type ToolbarSplitItem = BaseProps &
    ActionCapableItem &
    MenuTriggerProps &
    ToolbarItemProps &
    HoverActionCapableItem & {
    type: "split";
    menuTooltip?: string;
};

export interface DividerItem {
    type: "divider";
}

export type ToolbarItem = ToolbarActionItem | ToolbarMenuTrigger | ToolbarSplitItem | DividerItem;


// Configuration
export interface ToolbarConfig {
    items: ToolbarItem[];
    contextItems?: ToolbarItem[];
}

export type ToolbarConfigProvider = (state: EditorState) => ToolbarConfig;

export const toolbarConfig = Facet.define<ToolbarConfigProvider, ToolbarConfigProvider>({
    combine(inputs) {
        return inputs[inputs.length - 1]
    }
})

const applyConfig = (state: EditorState): ToolbarConfig => {
    const configFn = state.facet(toolbarConfig)
    return configFn(state)
}

export const toolbarConfigStateField = StateField.define<ToolbarConfig>({
    create(state) {
        return applyConfig(state)
    },
    update(value: ToolbarConfig, transaction: Transaction) {
        if (transaction.reconfigured || transaction.docChanged || transaction.selection) {
            return applyConfig(transaction.state)
        }

        return value
    }
})