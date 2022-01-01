import "../dotenv/config.mjs";
import { createSecureServer } from "http2";
import { hostname } from "os";
import process from "process";
import Router from "@koa/router";
import chalk from "chalk";
import proxy from "http2-proxy";
import Koa from "koa";
import route from "koa-route";
import serve from "koa-static-server";
import websockify from "koa-websocket";
import next from "next";
import { cjsHack } from "../helpers/cjs-hack";
import { log } from "../helpers/deep-log";
import { sslCredentials } from "../helpers/pem";

// configure Next.js
const app = next({
	dev: true,
	port: 3001,
	hostname: hostname()
});
await cjsHack();
await app.prepare();
const handle = app.getRequestHandler();

// setup express with HTTP2
const koa = websockify(new Koa());
const router = new Router();
koa.ws.use(
	route.all("/", (ctx) => {
		// the websocket is added to the context as `ctx.websocket`.
		ctx.websocket.on("message", function (message) {
			// print message from the client
			console.log(message);
		});
	})
);
koa.use(
	serve({
		rootPath: "/_next/static/media/",
		rootDir: new URL("../../.next/static/media/", import.meta.url).pathname,
		last: false
	})
);
koa.use(
	serve({
		rootDir: new URL("../../public/", import.meta.url).pathname,
		last: false
	})
);
router.all("(.*)", async (ctx) => {
	console.log(`[ ${chalk.green("GET")} ] ${ctx.req.url}`);
	await handle(ctx.req, ctx.res);
	ctx.respond = false;
});
koa.use(async (ctx, next) => {
	ctx.res.statusCode = 200;
	await next();
});
koa.use(router.routes());

const { credentials } = await sslCredentials({
	name: "next",
	commonName: "local.next.com",
	folder: new URL("../../.ssl/", import.meta.url)
});
const server = createSecureServer(
	{
		...credentials,
		allowHTTP1: true
	},
	koa.callback()
);

server.on("error", (err: unknown) => {
	log(err);
});

server.listen(app.port, app.hostname, () => {
	log(`${chalk.green("ready")} - dev server available at ${process.env.SITE_DOMAIN}`);
});

server.on("upgrade", (req, socket, head) => {
	console.log(req.url);
	proxy.ws(req, socket, head, {
		hostname: "localhost",
		port: 9000
	});
});

// process.on("uncaughtException", function (err) {
// 	log(err);
// });
