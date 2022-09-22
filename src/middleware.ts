import { chain, strictDynamic, chainMatch, isPageRequest, csp, reporting, CspSource } from "@next-safe/middleware";
import {  NextRequest, NextResponse, userAgent } from "next/server";
import { UAParser } from "ua-parser-js";
import { DeviceState } from "@util/store/device";

const isDev = process.env.NODE_ENV === "development";
	const origin = process.env.NEXT_PUBLIC_SITE_DOMAIN as CspSource;


const adaptiveMiddleware = (
	req: NextRequest
) => {
	let response = NextResponse.next();
	if (isPageRequest(req)) {
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
		response = NextResponse.rewrite(url);
		response.headers.append("x-device", type ?? "desktop");
		//console.log(response);
		//response.headers.append("cache-control", "public, s-maxage=300, stale-while-revalidate=59");
	}
	//const type = req.headers.get("Content-Type");
	//response.headers.append("x-device", ua.device.type ?? "desktop");
	// if (type?.startsWith("text/html")) {
	// 	console.log("TYYYP");

	// 	response.headers.append("x-device", device.type ?? "desktop");
	// 	response.headers.append("vary", "x-device, accept-encoding");
	// }
	return response;
};

const nextSafeMiddleware = () => {
	return csp({
		isDev,
		directives: {
			"default-src": ["self", "blob:", origin],
			"img-src": ["self", origin],
			"connect-src": ["self", "https://vitals.vercel-insights.com/v1/vitals", origin],
			"style-src": ["self", "unsafe-inline", origin],
			"style-src-elem": ["self", "unsafe-inline", origin],
			"script-src": ["self", origin],
			"script-src-elem": ["self", origin]
		}
	});
};


export default chain(adaptiveMiddleware, chainMatch(isPageRequest)(csp({
		isDev,
		directives: {
			"default-src": ["self", "blob:", origin],
			"img-src": ["self", origin],
			"connect-src": ["self", "https://vitals.vercel-insights.com/v1/vitals", origin],
			"style-src": ["self", "unsafe-inline", origin],
			"style-src-elem": ["self", "unsafe-inline", origin],
			"script-src": ["self", origin],
			"script-src-elem": ["self", origin]
		}
	}), nextSafeMiddleware(), strictDynamic(), reporting()));
