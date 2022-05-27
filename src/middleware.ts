// eslint-disable-next-line @next/next/no-server-import-in-page
import type { NextRequest } from "next/server";
// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from "next/server";
import UAParser from "ua-parser-js";

export default async function middleware(req: NextRequest) {
	const parser = new UAParser(req.headers.get("user-agent") || undefined);
	const device = parser.getDevice();
	const res = NextResponse.next();
	res.headers.append("X-Device", device.type ?? "desktop");
	return res;
}
