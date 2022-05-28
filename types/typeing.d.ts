import { DeviceState } from "@util/store/device";
import { NavState } from "@util/store/nav";
import type { RouterState } from "connected-next-router";

export interface NextState {
	device: DeviceState;
	nav: NavState;
	router: RouterState;
}
