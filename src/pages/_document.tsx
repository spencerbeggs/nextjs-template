import Document, { Head, Html, Main, NextScript } from "next/document";

export default class extends Document {
	render() {
		//const { Head, NextScript } = provideComponents(this.props);
		return (
			<Html lang="en-US">
				<Head nonce={process.env.NONCE} />
				<body>
					<Main />
					<NextScript nonce={process.env.NONCE} />
				</body>
			</Html>
		);
	}
}
