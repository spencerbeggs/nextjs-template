import { Middleware, strictDynamic, chain, nextSafe, reporting } from "@next-safe/middleware";
import { NextRequest, NextResponse, userAgent } from "next/server";
import { UAParser } from "ua-parser-js";
import { DeviceState } from "@util/store/device";

const isDev = process.env.NODE_ENV === "development";
const reportOnly = process.env.CSP_REPORT_ONLY === "true" ? true : undefined;

const isHtml = (req: NextRequest | undefined) => {
	if (!req) {
		return false;
	}
	const last = req.nextUrl.pathname.split("/").pop();
	return last && !last.includes(".") && !req.nextUrl.pathname.startsWith("/_next/");
};

const adaptiveMiddleware: Middleware = async (req, evt, res, next) => {
	const response = NextResponse.next();
	if (isHtml(req)) {
		const { ua } = userAgent(req);
		const parser = new UAParser(ua);
		const device = parser.getDevice();
		const state: DeviceState = {
			mobile: device.type === "mobile",
			tablet: device.type === "tablet",
			desktop: device.type === undefined,
			tv: device.type === "smarttv"
		};
		const type = Object.keys(device).find((key) => state[key as keyof DeviceState] === true);
		response.headers.append("x-device", type ?? "desktop");
		response.headers.append("cache-control", "public, s-maxage=300, stale-while-revalidate=59");
	}
	//const type = req.headers.get("Content-Type");
	//response.headers.append("x-device", ua.device.type ?? "desktop");
	// if (type?.startsWith("text/html")) {
	// 	console.log("TYYYP");

	// 	response.headers.append("x-device", device.type ?? "desktop");
	// 	response.headers.append("vary", "x-device, accept-encoding");
	// }
	return next ? next(response) : response;
};

const nextSafeMiddleware = nextSafe(() => {
	const origin = process.env.NEXT_PUBLIC_SITE_DOMAIN as string;
	return {
		isDev,
		contentSecurityPolicy: {
			reportOnly,
			"default-src": ["'self' blob:", origin],
			"img-src": ["'self'", origin],
			"connect-src": ["'self'", "https://vitals.vercel-insights.com/v1/vitals", origin],
			"style-src": ["'self'", "'unsafe-inline'", origin],
			"style-src-elem": ["'self'", "'unsafe-inline'", origin],
			"script-src": ["'self'", origin],
			"script-src-elem": ["'self'", origin]
		},
		permissionsPolicy: false,
		permissionsPolicyDirectiveSupport: ["standard"],
		referrerPolicy: "no-referrer",
		xssProtection: "1; mode=block",
		frameOptions: "DENY"
	};
});

const reportingMiddleware = reporting(() => {
	const { href } = new URL("/api/reporting", process.env.NEXT_PUBLIC_SITE_DOMAIN);
	return {
		csp: {
			reportUri: process.env.CSP_REPORT_URI || href
		},
		reportTo: {
			max_age: 1800,
			endpoints: [
				{
					url: process.env.REPORT_TO_ENDPOINT_DEFAULT || href
				}
			]
		}
	};
});

export default chain(adaptiveMiddleware, nextSafeMiddleware, strictDynamic(), reportingMiddleware);
