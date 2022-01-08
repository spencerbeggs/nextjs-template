import { IncomingHttpHeaders } from "http";
import { UAParser } from "ua-parser-js";
import { CloudfrontHeaders, DETECT_BROWSER_DEVICE, DeviceActionTypes, DeviceState, SET_DEVICE } from "./types";

export function parseUserAgent(userAgent?: string): DeviceState {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isCloudfront = (headers: any): headers is CloudfrontHeaders => {
	return (
		typeof window === "undefined" &&
		typeof headers !== "undefined" &&
		headers["cloudfront-is-desktop-viewer"] &&
		headers["cloudfront-is-mobile-viewer"] &&
		headers["cloudfront-is-tablet-viewer"] &&
		headers["cloudfront-is-smarttv-viewer"]
	);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isServerDevice = (headers: any): headers is IncomingHttpHeaders => {
	return headers?.["user-agent"] && typeof window === "undefined";
};

export function detectDevice(headers?: IncomingHttpHeaders): DeviceState {
	if (isCloudfront(headers)) {
		return {
			browser: null,
			desktop: Boolean(headers["cloudfront-is-desktop-viewer"]) ?? null,
			mobile: Boolean(headers["cloudfront-is-mobile-viewer"]) ?? null,
			tablet: Boolean(headers["cloudfront-is-tablet-viewer"]) ?? null,
			tv: Boolean(headers["cloudfront-is-smarttv-viewer"]) ?? null
		};
	} else if (isServerDevice(headers)) {
		return parseUserAgent(headers?.["user-agent"]);
	} else if (typeof window !== "undefined") {
		return parseUserAgent(window.navigator.userAgent);
	}
	return {
		browser: null,
		desktop: true,
		mobile: false,
		tablet: false,
		tv: false
	};
}

export function setBrowserDevice(ua: string): DeviceActionTypes {
	return {
		type: DETECT_BROWSER_DEVICE,
		payload: parseUserAgent(ua)
	};
}

export function hydrate(state: DeviceState): DeviceActionTypes {
	return {
		type: SET_DEVICE,
		payload: state
	};
}
