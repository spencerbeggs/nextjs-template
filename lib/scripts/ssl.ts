import "./config";
import { makeSsl } from "../helpers/pem";

await makeSsl({
	name: "next",
	commonName: "local.next.com",
	folder: new URL("../../../.ssl/", import.meta.url)
});

export {};
