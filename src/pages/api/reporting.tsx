import type { NextRequest } from "next/server";

export const config = {
	runtime: "experimental-edge"
};

export default function handler(req: NextRequest) {
	if (req.method === "POST") {
		return new Response(null, { status: 200 });

	} else {
		return new Response(null, { status: 404 });
	}
}

