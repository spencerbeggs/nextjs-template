import "./lib/dotenv/config.mjs";
import { readFile, readdir } from "fs/promises";
import { createSecureServer } from "http2";
import { resolve, dirname } from "path";
import process from "process";
import chalk from "chalk";
import finalhandler from "finalhandler";
import next from "next";
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

console.log(staticPaths);

const staticServer = serveStatic(`${__dirname}/public`);

const dev = process.env.NODE_ENV !== "production";
const app = next({
	dev
});

const handle = app.getRequestHandler();

await app.prepare();

const server = createSecureServer({
	key: await readFile(new URL(".ssl/server/key.pem", import.meta.url)),
	cert: await readFile(new URL(".ssl/server/cert.pem", import.meta.url)),
	allowHTTP1: true
});

server.on("request", (req, res) => {
	if (staticPaths.includes(req.url)) {
		return staticServer(req, res, finalhandler(req, res));
	}
	if (!req.url.startsWith("/_next/")) {
		console.log(`[ ${chalk.green("GET")} ] ${req.url}`);
	}
	handle(req, res, req.url ?? "");
});

server.on("error", (err) => {
	if (err) throw err;
	console.log(`[ ${chalk.green("ready")} ] Dev server available at ${process.env.SITE_DOMAIN}`);
});

server.listen(3001);

export default server;
