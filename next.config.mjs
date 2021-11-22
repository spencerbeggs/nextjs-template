import { join, dirname } from "path";
import { env } from "process";
import { fileURLToPath } from "url";
import fs from "fs-extra";

let wrotePackageJson = false;

/** @type {import('next').NextConfig} */
function config(phase, nextConfig = {}) {
	const assetPrefix = process.env.SITE_DOMAIN;
	const __filename = fileURLToPath(new URL(import.meta.url));
	const __dirname = dirname(__filename);
	return Object.assign(
		{
			assetPrefix,
			//swcMinify: true,
			reactStrictMode: true,
			compress: true,
			poweredByHeader: false,
			experimental: {
				// concurrentFeatures: true,
				// serverComponents: true,
				// reactRoot: true
			},
			sassOptions: {
				includePaths: [join(__dirname, "src/util/scss")],
				prependData: `
				@import "_typography.scss";
				@import "_colors.scss";
				@import "_fonts.scss";
				@import "_variables.scss";
				@import "_mixins.scss";
			  `
					.trim()
					.split("\n")
					.map((line) => line.trim())
					.join("\n")
					.trim()
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
				// const { compilerOptions } = fs.readJSONSync(resolve(__dirname, "./tsconfig.json"));
				// Object.entries(compilerOptions.paths).forEach(([key, value]) => {
				// 	config.resolve.alias[key.replace("/*", "")] = join(__dirname, `${value[0].replace("*", "")}`);
				// });
				if (!wrotePackageJson) {
					// eslint-disable-next-line import/no-named-as-default-member
					fs.mkdirSync(join(__dirname, ".next"), { recursive: true });
					fs.writeFileSync(join(__dirname, ".next/package.json"), JSON.stringify({ type: "commonjs" }));
					wrotePackageJson = true;
				}
				return config;
			}
		}
	);
}

export default config();
