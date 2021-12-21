import "../styles/main.scss";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import type { ReactElement, ReactNode } from "react";
import { wrapper } from "@util/store";

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

let ws: WebSocket;

if (typeof window !== "undefined") {
	ws = new WebSocket(window.location.origin.replace(/^http/i, "ws"));
	// @ts-ignore
	window.ws = ws;

	ws.onmessage = (evt) => {
		console.log(evt);
	};
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout || ((page) => page);
	return getLayout(
		<>
			<Head>
				<title key="title">App</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
				<link rel="manifest" href="/site.webmanifest"></link>
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default wrapper.withRedux(MyApp);
