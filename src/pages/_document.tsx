import Document, { provideComponents } from "@next-safe/middleware/dist/document";
import { DocumentContext, Html, Main } from "next/document";

// weirdness: when running on Vercel, the response header set by middleware
// will be found in req, when serving a prod build with next start, it will be in res
const getCtxHeader = (ctx: DocumentContext, header: string) => {
	return (ctx.res?.getHeader(header) || ctx.req?.headers[header] || "").toString();
};

const CSP_NONCE_HEADER = "csp-nonce";

export default class CustomDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		//const nonce = getCtxHeader(ctx, CSP_NONCE_HEADER);
		// if (nonce) {
		// 	return { ...initialProps, nonce };
		// }
		return initialProps;
	}

	render() {
		// those components are automagically wired with strictDynamic
		const { Head, NextScript } = provideComponents(this.props);
		return (
			<Html lang="en-US">
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
