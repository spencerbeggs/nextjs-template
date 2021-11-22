import { SidebarActionVerbs, SidebarActionTypes } from "./types";

export function openSidebar(): SidebarActionTypes {
	return {
		type: SidebarActionVerbs.OPEN_SIDEBAR
	};
}

export function closeSidebar(): SidebarActionTypes {
	return {
		type: SidebarActionVerbs.CLOSE_SIDEBAR
	};
}

export function toggleSidebar(current: boolean) {
	const next = !current;
	return {
		type: next ? SidebarActionVerbs.OPEN_SIDEBAR : SidebarActionVerbs.CLOSE_SIDEBAR,
		payload: next
	};
}
