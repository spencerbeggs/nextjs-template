import { UAParser } from "ua-parser-js";
import { DETECT_BROWSER_DEVICE, DeviceActionTypes, DeviceState, ServerHeaders } from "./types";

export function detectBrowserDevice(userAgent: string): DeviceState {
	const UA = new UAParser(userAgent);
	const device = UA.getDevice();
	const browser = UA.getBrowser();
	return {
		browser: browser.name ?? null,
		desktop: device.type === undefined,
		mobile: device.type === "mobile",
		tablet: device.type === "tablet",
		tv: device.type === "smarttv"
	};
}

export function detectServerDevice(headers: ServerHeaders): DeviceState {
	return {
		browser: null,
		desktop: Boolean(headers["cloudfront-is-desktop-viewer"]) ?? null,
		mobile: Boolean(headers["cloudfront-is-mobile-viewer"]) ?? null,
		tablet: Boolean(headers["cloudfront-is-tablet-viewer"]) ?? null,
		tv: Boolean(headers["cloudfront-is-smarttv-viewer"]) ?? null
	};
}

export function setBrowserDevice(ua: string): DeviceActionTypes {
	return {
		type: DETECT_BROWSER_DEVICE,
		payload: detectBrowserDevice(ua)
	};
}
