import type { NextConfig } from "next";
import {  RuntimeCacheRule , GenerateSW, InjectManifest, RuntimeCacheRule } from "workbox-webpack-plugin";

export declare module "next-pwa" {

	interface NextPWAOptions {
			dest: string;
			swSrc?: string;
			disable?: boolean;
			register?: boolean;
			scope?: string;
			sw?: string;
			publicExcludes?: string[];
			buildExcludes?: Array<string | RegExp | (() => string | RegExp)>;
			skipWaiting?: boolean;
			runtimeCaching?: RuntimeCacheRule;
			subdomainPrefix?: string;
	}

	interface ConfigOptions extends NextConfig, Partial<GenerateSW>, Partial<InjectManifest> {
		pwa: NextPWAOptions;
	}

	declare function withPwa(func: (phase: string) => Promise<NextConfig>): ConfigOptions;
	export default withPwa;
}

export declare module "next-pwa/cache.js"; 


