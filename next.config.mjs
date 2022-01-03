import { env } from "process";

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
function config(phase, nextConfig = {}) {
	const assetPrefix = env.DEV_ASSET_PREFIX;
	return Object.assign(
		{
			assetPrefix,
			swcMinify: process.env.APP_ENV !== "local",
			reactStrictMode: true,
			compress: false,
			poweredByHeader: false,
			experimental: {
				outputFileTracingRoot: true,
				disablePostcssPresetEnv: true
			},
			images: {
				formats: ["image/avif", "image/webp"],
				domains: ["local.next.com", "spencerbeggs.local"]
			},
			sassOptions: {
				includePaths: [new URL("src/styles/utils", import.meta.url).pathname],
				prependData: sccsUtils(["_variables.scss", "_colors.scss", "_fonts.scss", "_mixins.scss"]),
				sourceMap: true
			}
		},
		nextConfig,
		{
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

				// Mirror's Next.js environment variables configuration with
				config.plugins.push(
					new webpack.DefinePlugin({
						"process.env": Object.entries(env).reduce((acc, [key, value]) => {
							if (key.startsWith("NEXT_PUBLIC_")) {
								acc[key.replace("NEXT_PUBLIC_", "")] = JSON.stringify(value);
							}
							return acc;
						}, {})
					})
				);

				//config.infrastructureLogging = { debug: /PackFileCache/ };
				//log(config);
				return config;
			}
		}
	);
}

export default config();
