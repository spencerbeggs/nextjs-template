import { mkdirSync, writeFileSync } from "fs";
import { env } from "process";

let wrotePackageJson = false;

const sccsUtils = (filenames, folder) => {
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
	//const assetPrefix = process.env.SITE_DOMAIN;
	return Object.assign(
		{
			//assetPrefix,
			swcMinify: process.env.APP_ENV !== "local",
			reactStrictMode: true,
			compress: true,
			poweredByHeader: false,
			experimental: {
				outputFileTracingRoot: true,
				disablePostcssPresetEnv: true
				//concurrentFeatures: true
			},
			images: {
				formats: ["image/avif", "image/webp"]
			},
			sassOptions: {
				includePaths: [new URL("src/styles/utils", import.meta.url).pathname],
				prependData: sccsUtils(["_variables.scss", "_colors.scss", "_fonts.scss", "_mixins.scss"]),
				sourceMap: true
			}
		},
		nextConfig,
		{
			webpack: (config, { webpack, isServer }) => {
				// if (PHASE_DEVELOPMENT_SERVER) {
				// 	config.resolve.fallback.fs = false;
				// }
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

				// config.module.rules.unshift({
				// 	test: /\.s[ac]ss$/i,
				// 	use: [
				// 		"style-loader",
				// 		{
				// 			loader: "css-loader",
				// 			options: {
				// 				sourceMap: process.env.APP_ENV === "local"
				// 			}
				// 		},
				// 		{
				// 			loader: "sass-loader",
				// 			options: {
				// 			}
				// 		}
				// 	]
				// });

				// config.module.rules.unshift({
				// 	test: /\.(gif|png|svg|jpe?g)$/i,
				// 	issuer: /\.sc?ss$/,
				// 	use: [
				// 		{
				// 			loader: "file-loader",
				// 			options: {
				// 				name: "[name].[hash].[ext]",
				// 				outputPath: "./static/images",
				// 				publicPath: "/_next/static/media/"
				// 			}
				// 		},
				// 		{
				// 			loader: "image-webpack-loader",
				// 			options: {
				// 				disable: process.env.APP_ENV === "local"
				// 			}
				// 		}
				// 	]
				// });

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

				// eslint-disable-next-line import/no-named-as-default-member
				// const { compilerOptions } = fs.readJSONSync(join(__dirname, "./tsconfig.json"));
				// Object.entries(compilerOptions.paths).forEach(([key, value]) => {
				// 	config.resolve.alias[key.replace("*", "")] = join(__dirname, `${value[0].replace("*", "")}`);
				// });

				if (isServer && !wrotePackageJson) {
					// eslint-disable-next-line import/no-named-as-default-member
					mkdirSync(new URL(".next", import.meta.url), { recursive: true });
					writeFileSync(
						new URL(".next/package.json", import.meta.url).pathname,
						JSON.stringify({ type: "commonjs" }, null, "\t")
					);
					wrotePackageJson = true;
				}
				//config.infrastructureLogging = { debug: /PackFileCache/ };
				//console.log(config);
				return config;
			}
		}
	);
}

export default config();
