import { combineReducers, Reducer } from "redux";
import { SidebarState, SidebarActionTypes, SidebarActionVerbs } from "./types";

export function open(state = false, action: SidebarActionTypes): boolean {
	switch (action.type) {
		case SidebarActionVerbs.OPEN_SIDEBAR:
			return true;
		case SidebarActionVerbs.CLOSE_SIDEBAR:
			return false;
		case SidebarActionVerbs.TOGGLE_SIDEBAR:
			return !state;
		case SidebarActionVerbs.LOCATION_CHANGE:
			return false;
		default:
			return state;
	}
}

export const sidebar: Reducer<SidebarState> = combineReducers({
	open
});
