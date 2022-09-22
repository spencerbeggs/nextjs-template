import { reporting } from "@next-safe/middleware/dist/api";

const consoleLogReporter = (data: Record<string, unknown>) => console.log(JSON.stringify(data, undefined, 2));

export default reporting(consoleLogReporter);
