import { DeviceState } from "@util/store/device";
import { NavState } from "@util/store/nav";

export interface NextState {
	device: DeviceState;
	nav: NavState;
}
