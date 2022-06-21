import { Middleware, strictDynamic, chain, nextSafe, reporting } from "@next-safe/middleware";
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

const nextSafeMiddleware = nextSafe((req: NextRequest) => {
	return {
		isDev,
		contentSecurityPolicy: {
			reportOnly,
			"frame-ancestors": "none",
			"script-src": `nonce-${process.env.NONCE}`,
			"img-src": "'self'",
			"object-src": "'none'"
		},
		tellSupported: new UAParser(req.headers.get("user-agent") || undefined),
		referrerPolicy:  "no-referrer",
		xssProtection: "1; mode=block",
		frameOptions: "DENY"
	};
});

const reportingMiddleware = reporting((req) => {
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
	adaptiveMiddleware,
	strictDynamic(),
	reportingMiddleware
);


