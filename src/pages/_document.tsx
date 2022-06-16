import Document, { Head, Html, Main, NextScript } from "next/document";

export default class extends Document {
	render() {
		//const { Head, NextScript } = provideComponents(this.props);
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
