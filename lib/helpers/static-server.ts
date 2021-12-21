import { readdir, mkdir } from "fs/promises";
import { IncomingMessage, ServerResponse } from "http";
import finalhandler from "finalhandler";
import serveStatic from "serve-static";

type PublicAsset = {
	filename: string;
	pathname: string;
};

export class StaticServer {
	static async *getFiles(dir: URL): AsyncGenerator<PublicAsset> {
		const dirents = await readdir(dir.pathname, { withFileTypes: true });
		for (const dirent of dirents) {
			const res = new URL(dirent.name, dir);
			if (dirent.isDirectory()) {
				yield* this.getFiles(res);
			} else {
				yield {
					filename: res.pathname.replace(`${dir.pathname}/`, ""),
					pathname: res.pathname.replace(`${dir.pathname}/`, "")
				};
			}
		}
	}
	static async create(url: URL): Promise<{
		handler: (req: IncomingMessage, res: ServerResponse) => void;
		filenames: Record<string, string[]>;
		pathnames: string[];
	}> {
		await mkdir(url, { recursive: true });
		const filenames: Record<string, string[]> = {};
		const pathnames: string[] = [];
		for await (const { filename, pathname } of this.getFiles(url)) {
			filenames[filename] = [filename];
			pathnames.push(pathname);
		}
		const server = serveStatic(url.pathname);
		const handler = (req: IncomingMessage, res: ServerResponse) => {
			const done = finalhandler(req, res);
			if (req.url && pathnames.includes(req.url)) {
				return server(req, res, () => done);
			}
		};
		return { handler, filenames, pathnames };
	}
}
