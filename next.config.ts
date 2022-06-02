import type { NextConfig } from "next";
//@ts-ignore
import runtimeCaching from "next-pwa/cache.js";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";
import withPWA from "next-pwa";


export default async (phase: string): Promise<NextConfig> => {
	const config = withPWA({
		assetPrefix:
			process.env.APP_ENV === "local" ? process.env.NEXT_PUBLIC_STATIC_DOMAIN : process.env.NEXT_PUBLIC_STATIC_DOMAIN,
		swcMinify: phase !== PHASE_DEVELOPMENT_SERVER,
		compress: phase !== PHASE_DEVELOPMENT_SERVER,
		poweredByHeader: false,
		i18n: {
			locales: ["en"],
			defaultLocale: "en"
		},
		pwa: {
			dest: "public",
			register: true,
			skipWaiting: true,
			runtimeCaching,
			buildExcludes: [/middleware-manifest.json$/],
			disable: phase === PHASE_DEVELOPMENT_SERVER
		},
		reactStrictMode: true,
		experimental: {
			runtime: "edge",
			reactRoot: true,
			disablePostcssPresetEnv: false,
			swcFileReading: true
		},
		images: {
			formats: ["image/avif", "image/webp"],
			domains: [new URL(process.env.NEXT_PUBLIC_SITE_DOMAIN ?? "").hostname, "spencerbeggs.local"]
		},
		async headers() {
			return [
				{
					source: "/:path*",
					headers: [
						{
							key: "Vary",
							value: "x-device, Accept-Encoding"
						},
						{
							key: "X-DNS-Prefetch-Control",
							value: "on"
						},
						{
							key: "X-XSS-Protection",
							value: "1; mode=block"
						},
						{
							key: "X-Frame-Options",
							value: "SAMEORIGIN"
						},
						{
							key: "X-Content-Type-Options",
							value: "nosniff"
						},
						{
							key: "Referrer-Policy",
							value: "origin-when-cross-origin"
						},
						{
							key: "Strict-Transport-Security",
							value: "max-age=63072000; includeSubDomains; preload"
						}
					]
				}
			];
		},
		webpack: (config, { webpack, isServer }) => {
			if (isServer) {
				// Mirror's Next.js environment variables configuration with
				config.plugins.push(
					new webpack.DefinePlugin({
						"process.env": Object.entries(process.env as Record<string, string>).reduce((acc, [key, value]) => {
							if (key.startsWith("NEXT_PUBLIC_")) {
								acc[key.replace("NEXT_PUBLIC_", "")] = JSON.stringify(value);
							}
							return acc;
						}, {} as Record<string, string>)
					})
				);
			}

			config.plugins.push(
				// provides commonly used modules and their exports as global variables
				// when ever the global is refeferenced in a module
				new webpack.ProvidePlugin({
					react: "react",
					React: "react",
					Component: ["react", "Component"],
					PureComponent: ["react", "PureComponent"],
					memo: ["react", "memo"],
					Fragment: ["react", "Fragment"],
					useState: ["react", "useState"],
					useEffect: ["react", "useEffect"],
					useRef: ["react", "useRef"],
					useReducer: ["react", "useReducer"],
					useCallback: ["react", "useCallback"],
					useLayoutEffect: ["react", "useLayoutEffect"],
					createRef: ["react", "createRef"],
					createElement: ["react", "createElement"],
					GetServerSideProps: ["next", "GetServerSideProps"],
					NextPageContext: ["next", "NextPageContext"]
				})
			);

			//config.infrastructureLogging = { debug: /PackFileCache/ };
			return config;
		}
	});
	
	//console.log(config);
	return config;
};
