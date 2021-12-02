import { config } from "dotenv";
import dotenvExpand from "dotenv-expand";

// loads local .env file frust
if (process.env.APP_ENV === "local") {
	dotenvExpand(
		config({
			path: new URL("../../.env", import.meta.url).pathname
		})
	);
}

// loads target enviornment .env file from ./envs
dotenvExpand(
	config({
		path: new URL(`.env.${process.env.APP_ENV}`, import.meta.url).pathname
	})
);

// loads global env file which sets public Next.js globals
dotenvExpand(
	config({
		path: new URL(".env.public", import.meta.url).pathname
	})
);

export default new URL(`.env.${process.env.APP_ENV}`, import.meta.url).pathname;
