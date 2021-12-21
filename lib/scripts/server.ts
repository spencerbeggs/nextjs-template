import "../dotenv/config.mjs";
import { IncomingMessage, ServerResponse } from "http";
import { createSecureServer } from "http2";
import { hostname } from "os";
import process from "process";
import { parse } from "url";
import chalk from "chalk";
import next from "next";
import { cjsHack } from "../helpers/cjs-hack";
import { sslCredentials } from "../helpers/pem";
import { StaticServer } from "../helpers/static-server";
//import { createWebsocket } from "../helpers/websocket";

const { credentials } = await sslCredentials({
	name: "next",
	commonName: "local.next.com",
	folder: new URL("../../.ssl/", import.meta.url)
});

const server = createSecureServer({
	...credentials,
	allowHTTP1: true
});

//createWebsocket(server);

const app = next({
	dev: true,
	port: 3001,
	hostname: hostname()
});

const handle = app.getRequestHandler();

await app.prepare();
await cjsHack();

server.on("request", (req: IncomingMessage, res: ServerResponse) => {
	if (req.url === "/next/webpack-hmr") {
		console.log("/next/webpack-hmr");
	}
	const host = req.headers.host ?? "";
	if (host.endsWith(":80")) {
		res.writeHead(301, { Location: `https://${host.split(":")[0]}${req.url}` });
		res.end();
	}
});

const pub = await StaticServer.create(new URL("../../public/", import.meta.url));

server.on("request", pub.handler);

const media = await StaticServer.create(new URL("../../.next/static/media/", import.meta.url));

server.on("request", media.handler);

server.on("request", (req: IncomingMessage, res: ServerResponse) => {
	if (
		req.url &&
		!req.url.startsWith("/_next/") &&
		!req.url.startsWith("/__nextjs_original-stack-frame") &&
		req.url !== "/next/webpack-hmr" &&
		!pub.pathnames.includes(req.url) &&
		!media.pathnames.includes(req.url)
	) {
		console.log(`[ ${chalk.green("GET")} ] ${req.url}`);
	}
	const parsedUrl = parse(req.url || "/", true);
	handle(req, res, parsedUrl);
});

server.on("error", (err) => {
	console.log(err);
});
console.log(app.hostname);
server.listen(app.port, app.hostname, () => {
	console.log(`${chalk.green("ready")} - dev server available at ${process.env.SITE_DOMAIN}`);
});

process.on("uncaughtException", function (err) {
	console.log(err);
});
