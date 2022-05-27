import { config } from "dotenv";
import { expand } from "dotenv-expand";
expand(
	config({
		path: new URL(`../../.env.local`, import.meta.url).pathname
	})
);

export default {};
