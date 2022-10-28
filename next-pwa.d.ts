import type { NextConfig } from "next";
import {  RuntimeCacheRule , GenerateSW, InjectManifest, RuntimeCacheRule } from "workbox-webpack-plugin";

export declare module "next-pwa" {

	export interface NextPWAConfig extends NextConfig {
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
		pwa: {
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
	}

	declare function withPwa(options: NextPWAConfig, NextConfig): () => NextConfig;
	export default withPwa;
}

export declare module "next-pwa/cache.js"; 


