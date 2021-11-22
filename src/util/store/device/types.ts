export const DETECT_BROWSER_DEVICE = "DETECT_BROWSER_DEVICE";
export const DETECT_SERVER_DEVICE = "DETECT_SERVER_DEVICE";
export const DETECT_DEVICE = "DETECT_DEVICE";
import { IncomingHttpHeaders } from "http";
import { HYDRATE } from "next-redux-wrapper";

type DeviceDetected = null | boolean;

export type DeviceState = {
	mobile: DeviceDetected;
	desktop: DeviceDetected;
	tablet: DeviceDetected;
	tv: DeviceDetected;
	browser: null | string;
};

export interface ServerHeaders extends IncomingHttpHeaders {
	"user-agent": string;
	"cloudfront-is-mobile-viewer"?: "true" | "false";
	"cloudfront-is-desktop-viewer"?: "true" | "false";
	"cloudfront-is-tablet-viewer"?: "true" | "false";
	"cloudfront-is-smarttv-viewer"?: "true" | "false";
}

interface BrowserDevice {
	type: typeof DETECT_BROWSER_DEVICE;
	payload: DeviceState;
}

interface ServerDevice {
	type: typeof DETECT_SERVER_DEVICE;
	payload: DeviceState;
}

interface HydrateDevice {
	type: typeof HYDRATE;
	payload: DeviceState;
}

export type DeviceActionTypes = BrowserDevice | ServerDevice | HydrateDevice;
