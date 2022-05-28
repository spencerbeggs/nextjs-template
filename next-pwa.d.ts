import type { NextConfig } from "next";
import { GenerateSW, InjectManifest, RuntimeCacheRule } from "workbox-webpack-plugin";

export declare module "next-pwa" {

	interface ConfigOptions extends Partial<GenerateSW>, Partial<InjectManifest>, NextConfig {
		pwa: {
			dest: string;
			swSrc?: string;
			disable?: boolean;
			register?: boolean;
			scope?: string;
			sw?: string;
			publicExcludes?: string[];
			buildExcludes?: Array<string | RegExp | (() => string | RegExp)>;
			runtimeCaching?: RuntimeCacheRule;
			subdomainPrefix?: string;
		};
	}

	declare function withPwa(nextConfig: ConfigOptions): {
		webpack(
			config: ConfigOptions,
			options?: {
				buildId: string;
				dev: boolean;
				isServer: boolean;
				defaultLoaders: {
					babel: {
						cacheDirectory: boolean;
						cacheIdentifier: string;
						cacheCompression: boolean;
						customize: string | null;
					};
				};
			}
		): ConfigOptions;
	};

	export default withPwa;
}
