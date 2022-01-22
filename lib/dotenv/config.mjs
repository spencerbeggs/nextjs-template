import { config } from "dotenv";
import { expand } from "dotenv-expand";

// loads local .env file first
if (process.env.APP_ENV === "local") {
	expand(
		config({
			path: new URL("../../.env", import.meta.url).pathname
		})
	);
}

// loads target environment .env file from ./envs
expand(
	config({
		path: new URL(`.env.${process.env.APP_ENV}`, import.meta.url).pathname
	})
);

// loads global env file which sets public Next.js globals
expand(
	config({
		path: new URL(".env.public", import.meta.url).pathname
	})
);

export default new URL(`.env.${process.env.APP_ENV}`, import.meta.url).pathname;
