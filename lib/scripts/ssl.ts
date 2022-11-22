import "./config";
import { hostname } from "os";
import { makeSsl } from "../helpers/pem";
const port = Number(process.env.PORT) || 3000;

await makeSsl({
	name: "next",
	commonName: "local.next.com",
	folder: new URL("../../../.ssl/", import.meta.url),
	altNames: ["local.next.com", `${hostname()}:${port}`]
});

export {};
