import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import UAParser from "ua-parser-js";

export default async function middleware(req: NextRequest) {
	const url = req.nextUrl;
	const parser = new UAParser(req.headers.get("user-agent") || undefined);
	const device = parser.getDevice();
	url.searchParams.set("device", device.type ?? "desktop");
	req.headers.set("X-Device-Type", device.type ?? "desktop");
	return NextResponse.rewrite(url);
}
