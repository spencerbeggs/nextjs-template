import {
	strictDynamic,
	chainMatch,
	isPageRequest,
	csp,
	reporting,
	CspSource,
	nextSafe,
	ChainableMiddleware
} from "@next-safe/middleware";
import { NextResponse, userAgent } from "next/server";
import { UAParser } from "ua-parser-js";
import { DeviceState } from "@util/store/device";

let isDev = process.env.NODE_ENV === "development";
const origin = process.env.NEXT_PUBLIC_SITE_DOMAIN as CspSource;

const adaptiveMiddleware: ChainableMiddleware = async (req, evt, ctx) => {
	const url = req.nextUrl.clone();
	const { ua } = userAgent(req);
	const parser = new UAParser(ua);
	const device = parser.getDevice();
	const state: DeviceState = {
		mobile: device.type === "mobile",
		tablet: device.type === "tablet",
		desktop: device.type === undefined,
		tv: device.type === "smarttv"
	};
	const type = Object.keys(state).find((key) => state[key as keyof DeviceState] === true);
	url.searchParams.set("device", type ?? "desktop");
	const response = ctx.res.get();
	if (response instanceof NextResponse) {
		response.headers.append("x-device", type ?? "desktop");
	}
};

const featurePolicyMiddleware: ChainableMiddleware = async (req, evt, ctx) => {
	const standard = {
		accelerometer: [],
		//"ambient-light-sensor": [],
		autoplay: [],
		//battery: [],
		camera: [],
		"cross-origin-isolated": [],
		"display-capture": [],
		"document-domain": [],
		"encrypted-media": [],
		//"execution-while-not-rendered": [],
		//"execution-while-out-of-viewport": [],
		fullscreen: [],
		geolocation: [],
		gyroscope: [],
		magnetometer: [],
		microphone: [],
		midi: [],
		//"navigation-override": [],
		payment: [],
		"picture-in-picture": [],
		"publickey-credentials-get": [],
		"screen-wake-lock": [],
		"sync-xhr": [],
		usb: [],
		//"web-share": [],
		"xr-spatial-tracking": []
	};
	const parseValues = (values: string[]) => {
if (values.includes("*")) {
			return "*";
		}
		return values.map((value) => `'${value}'`).join(" ");
	};
	const response = ctx.res.get();
	if (response instanceof NextResponse) {
		response.headers.append(
			"Permissions-Policy",
			Object.entries(standard)
				.reduce((acc, [key, values]) => {
					acc.push(`${key}=(${parseValues(values)})`);
					return acc;
				}, [] as string[]).join(",")
		);
	}

};

const securityMiddleware = [
	csp({
		isDev,
		directives: {
			"default-src": [origin],
			"img-src": ["self", origin],
			"connect-src": ["self", "https://vitals.vercel-insights.com/v1/vitals", origin],
			"style-src-elem": ["self", "unsafe-inline", origin],
			"script-src": isDev ? ["self", "unsafe-inline", "unsafe-eval"] : [origin],
			"style-src": isDev ? ["self", "unsafe-inline", "unsafe-eval"] : [origin],
			"script-src-elem": ["self", origin]
		}
		//reportOnly: isDev,
	}),
	strictDynamic({
		extendScriptSrc: true
	}),
	reporting()
];

export default chainMatch(isPageRequest)(adaptiveMiddleware, featurePolicyMiddleware, ...securityMiddleware);
