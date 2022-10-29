import type { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};
const DOMAIN_URL = process.env.NEXT_PUBLIC_SITE_DOMAIN as string;

const href = (path: string) => new URL(path, DOMAIN_URL).href;

export default function handler(req: NextRequest) {
	if (req.method === "GET") {
		return new Response(
			JSON.stringify({
				name: "Next.js Template",
				short_name: "nextjs-template",
				start_url: DOMAIN_URL,
				scope: "/",
				icons: [
					{ src: href("/android-chrome-192x192.png"), sizes: "192x192", type: "image/png" },
					{ src: href("/android-chrome-512x512.png"), sizes: "512x512", type: "image/png" },
					{
						src: href("/android-chrome-192x192.png"),
						sizes: "196x196",
						type: "image/png",
						purpose: "any maskable"
					}
				],
				theme_color: "#ffffff",
				background_color: "#ffffff",
				display: "standalone",
				prefer_related_applications: false
			}),
			{
				status: 200,
				headers: {
					"content-type": "application/manifest+json",
					"cache-contol": "s-maxage=3600"
				}
			}
		);
	} else {
		return new Response(null, { status: 404 });
	}
}
