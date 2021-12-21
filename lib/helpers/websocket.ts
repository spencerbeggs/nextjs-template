import { IncomingMessage, Server } from "http";
import { hostname } from "os";
import ws, { WebSocketServer } from "ws";

export const createWebsocket = (server: Server) => {
	const wss = new WebSocketServer({
		server
	});

	server.on("connect", (req, res) => {
		wss.emit("HU");
	});

	wss.on("connection", function connection(ws, req) {
		console.log("wss connection...", req.url);

		"message,error,close,open,unexpected-response,upgrade".split(",").forEach((evt) => {
			ws.on(evt, (...args: unknown[]) => {
				console.log("ws " + evt + ": ", args);
			});
		});
	});

	"error,close".split(",").forEach((evt) => {
		wss.on(evt, (...args: unknown[]) => {
			console.log("wss " + evt + ": ", args);
		});
	});

	wss.on("headers", (...args: IncomingMessage[]) => {
		console.log("wss headers... url: ", (args[1] as IncomingMessage).url);
	});

	return wss;
};
