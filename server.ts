import "./lib/dotenv/config.mjs";
import { readdir } from "fs/promises";
import { IncomingMessage, ServerResponse } from "http";
import { createSecureServer } from "http2";
import process from "process";
import chalk from "chalk";
import finalhandler from "finalhandler";
import next from "next";
import serveStatic from "serve-static";
import { sslCredentials } from "./lib/helpers/pem";

const publicUrl = new URL("public/", import.meta.url);

type PublicAsset = {
	filename: string;
	pathname: string;
};

async function* getFiles(dir: URL): AsyncGenerator<PublicAsset> {
	const dirents = await readdir(dir.pathname, { withFileTypes: true });
	for (const dirent of dirents) {
		const res = new URL(dirent.name, dir);
		if (dirent.isDirectory()) {
			yield* getFiles(res);
		} else {
			yield {
				filename: res.pathname.replace(`${dir.pathname}/`, ""),
				pathname: res.pathname.replace(`${dir.pathname}/`, "")
			};
		}
	}
}

const staticNames: Record<string, string[]> = {};
const staticPaths: string[] = [];
for await (const { filename, pathname } of getFiles(publicUrl)) {
	staticNames[filename] = [filename];
	staticPaths.push(pathname);
}

const staticServer = serveStatic(publicUrl.pathname);

const dev = process.env.NODE_ENV !== "production";
const app = next({
	dev
});

const handle = app.getRequestHandler();

await app.prepare();

const { credentials } = await sslCredentials({
	name: "foo",
	commonName: "local.next.com",
	folder: new URL(".ssl/", import.meta.url)
});

const server = createSecureServer({
	...credentials,
	allowHTTP1: true
});

server.on("request", (req: IncomingMessage, res: ServerResponse) => {
	const done = finalhandler(req, res);
	if (req.url && staticPaths.includes(req.url)) {
		return staticServer(req, res, () => done);
	}
});

server.on("request", (req: IncomingMessage, res: ServerResponse) => {
	if (
		req.url &&
		!req.url.startsWith("/_next/") &&
		!req.url.startsWith("/__nextjs_original-stack-frame") &&
		!staticPaths.includes(req.url)
	) {
		console.log(`[ ${chalk.green("GET")} ] ${req.url}`);
	}
	handle(req, res);
});

server.on("error", (err) => {
	console.log(err);
});

server.listen(3001, () => {
	console.log(`${chalk.green("ready")} - dev server available at ${process.env.SITE_DOMAIN}`);
});
