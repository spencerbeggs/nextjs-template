import "./_app.css";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import { DeviceProvider } from "@contexts/device.context";
import { useAdaptive } from "@hooks/use-adaptive";
import { wrapper } from "@util/store";
import { detectDevice, DeviceState, hydrate } from "@util/store/device";

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

interface MyAppProps extends AppPropsWithLayout {
	device: DeviceState;
}

const MyApp = ({ Component, pageProps }: MyAppProps) => {
	const getLayout = Component.getLayout || ((page) => page);
	useAdaptive();

	// useEffect(() => {
	// 	if (typeof window !== "undefined" && "serviceWorker" in navigator) {
	// 		window.addEventListener("load", function () {
	// 			navigator.serviceWorker.register("/sw.js").then(
	// 				function (registration) {
	// 					console.log("Service Worker registration successful with scope: ", registration.scope);
	// 				},
	// 				function (err) {
	// 					console.log("Service Worker registration failed: ", err);
	// 				}
	// 			);
	// 		});
	// 	}
	// }, []);

	return (
		<DeviceProvider>
			<Head>
				<title key="title">App</title>
				<meta key="viewport" name="viewport" content="width=device-width, initial-scale=1" />
				<meta key="theme-color" name="theme-color" content="#fb31aa" />
				<meta key="csp-nonce" property="csp-nonce" content={process.env.NONCE} />
				<link key="apple-touch-icon" rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
				<link key="icon-32x32" rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
				<link key="icon-16x16" rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
				<link key="manifest" rel="manifest" href="/site.webmanifest"></link>
			</Head>
			{getLayout(<Component {...pageProps} />)}
		</DeviceProvider>
	);
};

MyApp.getInitialProps = wrapper.getInitialAppProps((store) => async ({ ctx: { req, res } }) => {
	const { dispatch } = store;
	const device = detectDevice(req?.headers);
	let type = "desktop";
	if (device.mobile) {
		type = "mobile";
	}
	if (device.tablet) {
		type = "tablet";
	}
	res?.setHeader("X-Device", type);
	dispatch(hydrate(device));
	return { pageProps: {} };
});

export default wrapper.withRedux(MyApp);
