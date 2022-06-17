import { nanoid } from "nanoid";
import type { NextConfig } from "next";
//@ts-ignore
import runtimeCaching from "next-pwa/cache.js";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants.js";
import withPWA from "next-pwa";

export default async (phase: string): Promise<NextConfig> => {
	const isDev = phase === PHASE_DEVELOPMENT_SERVER;
	const isProd = phase === PHASE_PRODUCTION_BUILD;
	const { hostname } = new URL(process.env.SITE_DOMAIN as string);
	const nonce = nanoid();
	const config = withPWA({
		assetPrefix: process.env.SITE_DOMAIN,
		swcMinify: isProd,
		compress: isProd,
		poweredByHeader: false,
		i18n: {
			locales: ["en"],
			defaultLocale: "en"
		},
		env: {
			NONCE: nonce
		},
		pwa: {
			dest: "public",
			register: isProd,
			skipWaiting: true,
			runtimeCaching,
			buildExcludes: [/middleware-manifest.json$/],
			disable: isDev
		},
		reactStrictMode: true,
		experimental: {
			runtime: "edge",
			reactRoot: true,
			disablePostcssPresetEnv: false,
			swcFileReading: true,
			browsersListForSwc: true,
			newNextLinkBehavior: true,
			images: { layoutRaw: true, remotePatterns: [] },
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
			domains: [hostname, "tailwindui.com", "images.unsplash.com", "spencerbeggs.local"]
		},
		async headers() {
			return [
				// {
				// 	source: "/:path*",
				// 	//@ts-ignore
				// 	headers: []
				// }
			];
		},
		webpack: (config, { webpack }) => {
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
