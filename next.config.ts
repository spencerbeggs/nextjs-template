import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } from "next/constants.js";

export default async (phase: string): Promise<NextConfig> => {
	const isDev = phase === PHASE_DEVELOPMENT_SERVER;
	const isProd = phase === PHASE_PRODUCTION_BUILD || phase ===  PHASE_PRODUCTION_SERVER;
	const { hostname, origin } = new URL(process.env.NEXT_PUBLIC_SITE_DOMAIN as string);
	let imageDomains = [hostname];
	if (isDev) {
		const os = await import("os");
		imageDomains.push(os.hostname());
	}
	return {
		swcMinify: isProd,
		compress: isProd,
		poweredByHeader: false,
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
			domains: imageDomains,
			dangerouslyAllowSVG: true,
			contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
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
			if (isDev && process.env.APP_ENV === "local") {
				const localhost = new URL(process.env.DEV_ASSET_PREFIX as string).host;
				config.module.rules.push({
					test: /\.js$/,
					loader: "string-replace-loader",
					options: {
						search: "${url}/_next/webpack-hmr",
						replace: `wss://${localhost}/_next/webpack-hmr`
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
