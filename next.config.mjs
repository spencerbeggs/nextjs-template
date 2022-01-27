import "./lib/dotenv/config.mjs";

const sccsUtils = (filenames) => {
	return filenames
		.reduce((acc, filename) => {
			//const pathname = new URL(`src/styles/${folder}/${filename}`, import.meta.url).pathname;
			acc.push(`@import "${filename}";`);
			return acc;
		}, [])
		.join("\n");
};

/** @type {import('next').NextConfig} */
const customConfig = {
	assetPrefix: process.env.APP_ENV === "local" ? process.env.DEV_ASSET_PREFIX : "",
	swcMinify: process.env.APP_ENV !== "local",
	reactStrictMode: false,
	compress: process.env.APP_ENV !== "local",
	poweredByHeader: false,
	experimental: {
		// concurrentFeatures: true,
		// serverComponents: true,
		outputFileTracingRoot: false,
		disablePostcssPresetEnv: true,
		swcFileReading: false
	},
	images: {
		formats: ["image/avif", "image/webp"],
		domains: ["local.next.com", "spencerbeggs.local"]
	},
	sassOptions: {
		includePaths: [new URL("src/styles/utils", import.meta.url).pathname],
		prependData: sccsUtils(["_variables.scss", "_colors.scss", "_fonts.scss", "_mixins.scss"]),
		sourceMap: true
	},
	async headers() {
		return [
			{
				source: "/:path*",
				has: [
					{
						type: "query",
						key: "device",
						value: "(?<device>.*)"
					}
				],
				headers: [
					{
						key: "x-device",
						value: ":device"
					}
				]
			},
			{
				source: "/:path*",
				headers: [
					{
						key: "vary",
						value: "x-device"
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
					"process.env": Object.entries(process.env).reduce((acc, [key, value]) => {
						if (key.startsWith("NEXT_PUBLIC_")) {
							acc[key.replace("NEXT_PUBLIC_", "")] = JSON.stringify(value);
						}
						return acc;
					}, {})
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
};

export default customConfig;
