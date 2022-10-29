import { getCspInitialProps, provideComponents } from "@next-safe/middleware/dist/document";
import Document, { DocumentContext, Html, Main } from "next/document";

export default class CustomDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await getCspInitialProps({ ctx });
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
