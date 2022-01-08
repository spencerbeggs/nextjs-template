import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import UAParser from "ua-parser-js";

export default async function middleware(req: NextRequest) {
	console.log(req);
	const parser = new UAParser(req.headers.get("user-agent") || undefined);
	const device = parser.getDevice();
	req.headers.set("X-Device-Type", device.type ?? "desktop");
	const response = NextResponse.next();
	response.headers.set("X-Device-Type", device.type ?? "desktop");
	return response;
}
