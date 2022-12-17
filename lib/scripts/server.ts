import "./config.js";
import { IncomingMessage, ServerResponse } from "http";
import { createSecureServer, Http2ServerRequest } from "http2";
import { hostname } from "os";
import process from "process";
import chalk from "chalk";
import next from "next";
import { cjsHack } from "../helpers/cjs-hack.js";
import { log } from "../helpers/deep-log.js";
import { sslCredentials } from "../helpers/pem.js";

const site = new URL(process.env.SITE_DOMAIN as string);
const port = Number(process.env.PORT) || 3000;

if (process.env.APP_ENV === "local") {
	process.env.DEV_ASSET_PREFIX = `https://${hostname()}:${port}`;
}

// @ts-ignore
const { credentials } = await sslCredentials({
	name: "next",
	commonName: site.origin,
	folder: new URL("../../.ssl/", import.meta.url),
	altNames: [`${hostname()}:${port}`]
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHttp1Request = (req: any): req is IncomingMessage => {
	return req.httpVersion === "1.1";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHttp2Request = (req: any): req is Http2ServerRequest => {
	return req.httpVersion === "2.0";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHttp1Response = (res: any): res is ServerResponse => {
	return res.httpVersion !== "1.1";
};

const server = createSecureServer(
	{
		...credentials,
		allowHTTP1: true,
		origins: [site.origin, `https://${hostname()}:${port}`, `https://localhost:${port}`],
		settings: {
			enableConnectProtocol: true
		}
	},
	(req: Http2ServerRequest | IncomingMessage, res) => {
		if (isHttp2Request(req)) {
			console.log("HTTP2");
			res.writeHead(200, {
				"content-type": "application/json"
			});
			return res.end(
				JSON.stringify({
					alpnProtocol: req.stream.session.alpnProtocol as string,
					httpVersion: req.httpVersion
				})
			);
		}
		if (isHttp1Request(req) && isHttp1Response(res)) {
			console.log("HTTP1", req.url);
			if (req.headers.host) {
				const [, port] = req.headers.host.split(":");
				if (port === "80") {
					const redirect = new URL(req.url as string, site.origin);
					res.writeHead(301, {
						Location: redirect.toString()
					});
				}
			}
			return handle(req, res);
		}
	}
);

// configure Next.js
// @ts-ignore
const app = next({
	dev: true,
	port,
	isNextDevCommand: true,
	hostname: hostname(),
	customServer: true,
	// @ts-ignore
	httpServer: server,
	dir: new URL("../../", import.meta.url).pathname
});

// @ts-ignore
await cjsHack();
// @ts-ignore
await app.prepare();
const handle = app.getRequestHandler();

// server.on("request", (req: Http2ServerRequest, res: Http2ServerResponse) => {
// 	if (isHttp1Request(req) && isHttp1Response(res)) {
// 		if (req.headers.host) {
// 			const [, port] = req.headers.host.split(":");
// 			if (port === "80") {
// 				const redirect = new URL(req.url, site.origin);

// 				res.writeHead(301, {
// 					Location: redirect.toString()
// 				});
// 				res.end();
// 				return;
// 			}
// 		}
// 		return handle(req, res);
// 	} else {
// 		console.log(req.socket);
// 	}
// });

// server.on("connection", (socket) => {
// 	console.log(socket);
// 	socket.end();
// });

server.listen(app.port, app.hostname, () => {
	log(`${chalk.green("ready")} - dev server available at https://${app.hostname}:${app.port} -> ${site.origin}`);
});

export { server };
