export const OPEN_SIDEBAR = "OPEN_SIDEBAR";
export const CLOSE_SIDEBAR = "CLOSE_SIDEBAR";
export const TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR";

export enum SidebarActionVerbs {
	OPEN_SIDEBAR = "OPEN_SIDEBAR",
	CLOSE_SIDEBAR = "CLOSE_SIDEBAR",
	TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR",
	LOCATION_CHANGE = "@@router/LOCATION_CHANGE"
}

type SidebarAction = {
	type: SidebarActionVerbs;
};

export type SidebarActionTypes = SidebarAction;

export type SidebarState = {
	open: boolean;
};
