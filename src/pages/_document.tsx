import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
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