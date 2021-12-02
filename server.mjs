import "./lib/dotenv/config.mjs";
import { createSecureServer } from "http2";
import process from "process";
import chalk from "chalk";
import fs from "fs-extra";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({
	dev
});

try {
	var key = fs.readFileSync("./.ssl/server/key.pem");
	var cert = fs.readFileSync("./.ssl/server/cert.pem");
} catch (err) {
	console.log(chalk.red("SSL cert and key missing. Generate them before running the dev server: yarn ssl"));
	process.exit(0);
}
await app.prepare();

const server = createSecureServer({ key, cert, allowHTTP1: true });

server.on("request", (req, res) => {
	app.render(req, res, req.url ?? "");
});

server.on("error", (err) => {
	if (err) throw err;
	console.log(`[ ${chalk.green("ready")} ] Dev server available at ${process.env.SITE_DOMAIN}`);
});

server.listen(3001);
