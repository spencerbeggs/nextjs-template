import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants.js";

export default async (phase: string): Promise<NextConfig> => {
	const isDev = phase === PHASE_DEVELOPMENT_SERVER;
	const isProd = phase === PHASE_PRODUCTION_BUILD;
	//const isProdServer = phase === PHASE_PRODUCTION_SERVER;
	const { hostname, origin } = new URL(process.env.NEXT_PUBLIC_SITE_DOMAIN as string);
	let imageDomains = [hostname];
	if (isDev) {
		const os = await import("os");
		imageDomains.push(os.hostname());
	}
	return {
		assetPrefix: origin,
		swcMinify: isProd,
		compress: isProd,
		poweredByHeader: false,
		i18n: {
			locales: ["en"],
			defaultLocale: "en"
		},
		reactStrictMode: true,
		experimental: {
			runtime: "experimental-edge",
			appDir: true,
			swcFileReading: true,
			modularizeImports: {
				"lodash-es": {
					transform: "lodash-es/{{member}}"
				}
			}
		},
		compiler: {
			removeConsole: isDev
				? false
				: {
						exclude: ["error"]
				  }
		},
		images: {
			formats: ["image/avif", "image/webp"],
			domains: imageDomains
		},
		async headers() {
			return [
				{
					source: "/:path*",
					has: [
						{
							type: "header",
							key: "x-device",
							value: "(<nonce>.*)"
						}
					],
					headers: [
						{
							key: "vary",
							value: "x-device,accept-encoding"
						}
					]
				}
				// {
				// 	source: "/:path*",
				// 	has: [
				// 		{
				// 			type: "header",
				// 			key: "csp-nonce",
				// 			value: "(<nonce>.*)"
				// 		}
				// 	],
				// 	headers: [
				// 		{
				// 			key: "x-csp-nonce",
				// 			value: ":nonce"
				// 		}
				// 	]
				// }
			];
		},
		webpack: (config, { webpack }) => {
			if (isDev) {
				config.module.rules.push({
					test: /\.js$/,
					loader: "string-replace-loader",
					options: {
						search: "${url}/_next/webpack-hmr",
						replace: `wss://${new URL(process.env.DEV_ASSET_PREFIX as string).host}/_next/webpack-hmr`,
					}
				});
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
	};

	// return nextPWA(
	// 	{
	// 		dest: "public/",
	// 		register: isProd,
	// 		skipWaiting: true,
	// 		runtimeCaching,
	// 		buildExcludes: [/middleware-manifest\.json$/],
	// 		disable: isDev
	// 	},
	// 	conf
	// )();
};
