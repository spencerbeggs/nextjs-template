import { Console } from "console";

const logger = new Console({
	stdout: process.stdout,
	stderr: process.stderr,
	inspectOptions: {
		depth: null
	}
});

const { log, dir, group, groupEnd } = logger;

export { log, dir, group, groupEnd };
