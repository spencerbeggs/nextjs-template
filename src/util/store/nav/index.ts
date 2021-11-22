import { combineReducers } from "redux";
import { sidebar } from "./sidebar/reducer";
import { SidebarState } from "./sidebar/types";

export type NavState = {
	sidebar: SidebarState;
};

export const InitialNavState: NavState = {
	sidebar: {
		open: false
	}
};

export const nav = combineReducers({
	sidebar
});
