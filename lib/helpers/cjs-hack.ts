import { mkdir, writeFile } from "fs/promises";

export async function cjsHack() {
	await mkdir(new URL("../../.next/", import.meta.url), { recursive: true });
	await writeFile(new URL("../../.next/package.json", import.meta.url), JSON.stringify({ type: "commonjs" }, null, "\t"));
}
