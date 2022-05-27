import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import UAParser from "ua-parser-js";

export default async function middleware(req: NextRequest) {
	const parser = new UAParser(req.headers.get("user-agent") || undefined);
	const device = parser.getDevice();
	const res = NextResponse.next();
	res.headers.append("X-Device", device.type ?? "desktop");
	return res;
}
