import "./config.js";
import { Socket } from "dgram";
import { IncomingMessage, request, ServerResponse } from "http";
import { connect, constants, createSecureServer, Http2ServerRequest, Http2ServerResponse } from "http2";
import { hostname } from "os";
import process from "process";
import chalk from "chalk";
import { head } from "lodash-es";
import next from "next";
import websocket from "websocket-stream";
import { Server, WebSocketServer } from "ws";
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
	commonName: site.host,
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

// const wss = createSecureServer({
// 	...credentials,
// 	allowHTTP1: false,
// 	settings: {
// 		enableConnectProtocol: true
// 	}
// });

// wss.on("stream", (stream, headers) => {
// 	if (headers[":method"] !== "CONNECT") {
// 		// Only accept CONNECT requests
// 		stream.close(constants.NGHTTP2_REFUSED_STREAM);
// 		return;
// 	}
// });

// wss.on("connect", (socket) => {
// 	console.log("upgrade", socket.localAddress);
// });

// wss.listen(3000, hostname(), () => {
// 	console.log("Listening on port 3000");
// });

// server.on("stream", (stream, headers) => {
// 	if (headers[":method"] !== "CONNECT") {
// 		// Only accept CONNECT requests
// 		stream.close(constants.NGHTTP2_REFUSED_STREAM);
// 		return;
// 	}
// });

	//const client = new WebSocketServer({ port: 3001});


server.on("connection", (socket: Socket) => {
	//const { port, addresss } = socket.address();
	socket.send("bar");
	//console.log(client);
	// client.handleUpgrade(request, socket, head, function done(ws) {
	// 	client.emit("connection", ws, request);
	// });
	// const { port, address: host } = socket.address();
	// client.addListener("connection", (ws, req) => {
	// 	console.log(ws);
	// 	console.log(req);

	// });
	// client.on("message", (data) => {
	// 	console.log(data);
	// 	socket.emit(data.toString());
	// });
});

// server.on("stream", (stream, headers) => {
// 	console.log("FFFF");
// 	if (headers[":method"] === "CONNECT") {
// 		stream.respond({
// 			"sec-websocket-protocol": headers["sec-websocket-protocol"]
// 		});
// 		const wss = websocket.createServer({ noServer: true });
// 		// @ts-ignore
// 		console.log(wss);
// 		// @ts-ignore
// 		wss.on("connection", function connection(ws, request, client) {
// 			// @ts-ignore
// 			ws.on("message", function message(data) {
// 				console.log(`Received message ${data} from user ${client}`);
// 			});
// 		});
// 	} else {
// 		// If it's any other method, just respond with 200 and "ok"
// 		stream.respond();
// 		stream.end("ok\n");
// 	}
// });

// configure Next.js
// @ts-ignore
const app = next({
	dev: true,
	port,
	isNextDevCommand: false,
	hostname: hostname(),
	customServer: true
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

server.listen(app.port, app.hostname, () => {
	log(`${chalk.green("ready")} - dev server available at https://${app.hostname}:${app.port} -> ${site.origin}`);
});

export { server };
