import "../dotenv/config.mjs";
import { IncomingMessage, ServerResponse } from "http";
import { createSecureServer, Http2ServerRequest, Http2ServerResponse } from "http2";
import { hostname } from "os";
import process from "process";
import chalk from "chalk";
import next from "next";
import { cjsHack } from "../helpers/cjs-hack";
import { log } from "../helpers/deep-log";
import { sslCredentials } from "../helpers/pem";

const site = new URL(process.env.SITE_DOMAIN as string);
const port = Number(process.env.PORT) || 3000;
process.env.DEV_ASSET_PREFIX = `https://${hostname()}:${port}`;

const { credentials } = await sslCredentials({
	name: "next",
	commonName: site.host,
	folder: new URL("../../.ssl/", import.meta.url)
});

// configure Next.js
const app = next({
	dev: true,
	port,
	hostname: hostname(),
	customServer: true
});
await cjsHack();
await app.prepare();
const handle = app.getRequestHandler();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHttp1Request = (req: any): req is IncomingMessage => {
	return req.httpVersion !== "2.0";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHttp1Response = (res: any): res is ServerResponse => {
	return res.req.httpVersion !== "2.0";
};

const server = createSecureServer({
	...credentials,
	allowHTTP1: true,
	settings: {
		enableConnectProtocol: true
	}
});

server.on("unknownProtocol", (socket) => {
	console.log("unknownProtocol", socket);
});

server.on("request", (req: Http2ServerRequest, res: Http2ServerResponse & ServerResponse) => {
	if (isHttp1Request(req) && isHttp1Response(res)) {
		const url = new URL(req.url, site.origin);
		const [, port] = req.headers.host?.split(":") ?? [];
		if (port === "80") {
			res.statusCode = 301;
			res.setHeader("Location", url.toString());
			res.end();
		}
		if (url.pathname.startsWith("/_next/image")) {
			if (url.searchParams.has("url")) {
				const target = new URL(url.searchParams.get("url") ?? "");
				if (target.origin === `https://${app.hostname}:${app.port}`) {
					url.searchParams.set("url", target.toString().replace(target.origin, ""));
					req.url = url.toString().replace(url.origin, "");
				}
			}
		}
		return handle(req, res);
	}
});

server.listen(app.port, app.hostname, () => {
	log(`${chalk.green("ready")} - dev server available at https://${app.hostname}:${app.port} -> ${site.origin}`);
});
export {};
