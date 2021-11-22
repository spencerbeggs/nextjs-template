import { HYDRATE } from "next-redux-wrapper";
import { DETECT_BROWSER_DEVICE, DETECT_SERVER_DEVICE, DeviceActionTypes, DeviceState } from "./types";

export const initialDeviceState: DeviceState = {
	browser: null,
	desktop: null,
	tablet: null,
	mobile: null,
	tv: null
};

export function device(state = initialDeviceState, action: DeviceActionTypes): DeviceState {
	switch (action.type) {
		case HYDRATE:
			return action.payload;
		case DETECT_SERVER_DEVICE:
			return action.payload;
		case DETECT_BROWSER_DEVICE:
			return action.payload;
		default:
			return state;
	}
}
