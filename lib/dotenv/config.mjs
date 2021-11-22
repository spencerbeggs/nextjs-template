import { resolve } from "path";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

// loads local .env file frust
if (process.env.APP_ENV === "local") {
	dotenvExpand(
		dotenv.config({
			path: resolve(process.cwd(), ".env")
		})
	);
}

// loads target enviornment .env file from ./envs
dotenvExpand(
	dotenv.config({
		path: resolve(process.cwd(), `./lib/dotenv/.env.${process.env.APP_ENV}`)
	})
);

// loads global env file which sets public Next.js globals
dotenvExpand(
	dotenv.config({
		path: resolve(process.cwd(), "./lib/dotenv/.env.public")
	})
);

export default resolve(process.cwd(), `./lib/dotenv/.env.${process.env.APP_ENV}`);
