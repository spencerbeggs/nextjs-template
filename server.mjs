import "./lib/dotenv/config.mjs";
import { readdir } from "fs/promises";
import { createSecureServer } from "http2";
import { resolve, dirname } from "path";
import process from "process";
import { parse } from "url";
import chalk from "chalk";
import finalhandler from "finalhandler";
import fs from "fs-extra";
import next from "next";
import originalUrl from "original-url";
import serveStatic from "serve-static";

const __dirname = dirname(new URL(import.meta.url).pathname);

async function* getFiles(dir) {
	const dirents = await readdir(dir, { withFileTypes: true });
	for (const dirent of dirents) {
		const res = resolve(dir, dirent.name);
		if (dirent.isDirectory()) {
			yield* getFiles(res);
		} else {
			yield {
				filename: res.replace(`${__dirname}/public/`, ""),
				pathname: res.replace(`${__dirname}/public`, "")
			};
		}
	}
}

const staticNames = {};
const staticPaths = [];
for await (const { filename, pathname } of getFiles("./public")) {
	staticNames[filename] = [filename];
	staticPaths.push(pathname);
}

const staticServer = serveStatic(`${__dirname}/public`);

const dev = process.env.NODE_ENV !== "production";
const app = next({
	dev
});
const handle = app.getRequestHandler();

try {
	var key = fs.readFileSync("./.ssl/server/key.pem");
	var cert = fs.readFileSync("./.ssl/server/cert.pem");
} catch (err) {
	console.log(chalk.red("SSL cert and key missing. Generate them before running the dev server: yarn ssl"));
	process.exit(0);
}
await app.prepare();

const server = createSecureServer({ key, cert, allowHTTP1: true }, (req, res) => {
	if (staticPaths.includes(req.url)) {
		return staticServer(req, res, finalhandler(req, res));
	}
	const { full, port } = originalUrl(req);
	let parsed = new URL(full);
	if (port === 80) {
		parsed.port = 443;
		parsed.protocol = "https:";
		res.writeHead(301, {
			Location: parsed.toString()
		});
		res.end();
		return;
	}
	if (!req.url.startsWith("/_next/")) {
		console.log(`[ ${chalk.green("GET")} ] ${req.url}`);
	}
	const url = parse(req.url, true);
	// Adds CSP to all pages but video and live channel embeds
	res.setHeader("x-content-type-options", "nosniff;");
	res.setHeader("content-security-policy", "upgrade-insecure-requests;");
	if (!url.pathname.endsWith("/embed")) {
		res.setHeader("content-security-policy", "frame-ancestors 'none';");
		res.setHeader("x-frame-options", "deny");
	}
	handle(req, res, url);
});

server.listen(3001, (err) => {
	if (err) throw err;
	console.log(`[ ${chalk.green("ready")} ] Dev server available at ${process.env.SITE_DOMAIN}`);
});
