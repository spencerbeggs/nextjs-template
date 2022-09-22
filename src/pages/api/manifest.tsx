import type { NextApiRequest, NextApiResponse } from "next";

const DOMAIN_URL = process.env.NEXT_PUBLIC_SITE_DOMAIN as string;

const href = (path: string) => new URL(path, DOMAIN_URL).href;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        res.setHeader("Content-Type", "application/manifest+json");
        res.setHeader("Cache-Control", "s-maxage=3600");
		res.status(200).send({
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
		});
	} else {
		res.status(404);
	}
}
