import {
	Middleware,
	strictDynamic,
	chain,
	nextSafe,
	reporting,
	pullCspFromResponse,
	pushCspToResponse
} from "@next-safe/middleware";
// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

const isDev = process.env.NODE_ENV === "development";
const reportOnly = !!process.env.CSP_REPORT_ONLY;

const adaptiveMiddleware: Middleware = (req, evt, res, next) => {
	const parser = new UAParser(req.headers.get("user-agent") || undefined);
	const device = parser.getDevice();
	const response = NextResponse.next();
	response.headers.append("Cache-Control", "public, s-maxage=300, stale-while-revalidate=59");
	response.headers.append("X-Device", device.type ?? "desktop");
	return next ? next(response) : response;
};

const nextSafeMiddleware = nextSafe(() => {
	return {
		isDev,
		contentSecurityPolicy: {
			reportOnly: true,
			"frame-ancestors": "none",
			"script-src": `'nonce-${process.env.NONCE}'`,
			"img-src": "'self'",
			"object-src": "'none'"
		},
		referrerPolicy: "no-referrer",
		xssProtection: "1; mode=block",
		frameOptions: "DENY"
	};
});

const clearCspDirectives: Middleware = (req, evt, res) => {
	if (res) {
		let csp = pullCspFromResponse(res);
		if (csp) {
			//@ts-ignore
			csp["default-src"] = undefined;
			//@ts-ignore
			csp["font-src"] = undefined;
			//@ts-ignore
			csp["style-src"] = undefined;
			//@ts-ignore
			csp["img-src"] = undefined;
			pushCspToResponse(csp, res);
		}
	}
};

const reportingMiddleware = reporting(() => {
	const nextApiReportEndpoint = `/api/reporting`;
	return {
		csp: {
			reportUri: process.env.CSP_REPORT_URI || nextApiReportEndpoint
		},
		reportTo: {
			max_age: 1800,
			endpoints: [
				{
					url: process.env.REPORT_TO_ENDPOINT_DEFAULT || nextApiReportEndpoint
				}
			]
		}
	};
});

export default chain(
	nextSafeMiddleware,
	clearCspDirectives,
	strictDynamic({
		reportOnly: true
	}),
	reportingMiddleware,
	adaptiveMiddleware
);
