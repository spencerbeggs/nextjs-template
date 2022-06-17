import Document, { provideComponents } from "@next-safe/middleware/dist/document";
import { DocumentContext, Html, Main } from "next/document";

export default class CustomDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
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
