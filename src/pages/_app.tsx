import "../styles/main.scss";
import type { NextPage } from "next";
import type {  AppProps } from "next/app";
import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import { DeviceProvider } from "@contexts/device.context";
import { useAdaptive } from "@hooks/use-adaptive";
import { wrapper } from "@util/store";
import { detectDevice, DeviceState, hydrate } from "@util/store/device";
import { IncomingMessage, ServerResponse } from "http";

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

interface MyAppProps extends AppPropsWithLayout {
	device: DeviceState;
}

const MyApp = ({ Component, pageProps, device }: MyAppProps) => {
	const getLayout = Component.getLayout || ((page) => page);
	useAdaptive();
	return (
		<DeviceProvider>
			<Head>
				<title key="title">App</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
				<link rel="manifest" href="/site.webmanifest"></link>
			</Head>
			{getLayout(<Component {...pageProps} />)}
		</DeviceProvider>
	);
};

MyApp.getServerSideProps = wrapper.getServerSideProps((store) => {
	const { dispatch } = store;
	return async (context) => {
		console.log(context.req.headers);
		const device = detectDevice(context.req.headers);
		let type = "desktop";
		if (device.mobile) {
			type = "mobile";
		}
		if (device.tablet) {
			type = "tablet";
		}
		context.res.setHeader("X-Device", type);
		dispatch(hydrate(device));
		return { props: { device } };
	};
});

export default wrapper.withRedux(MyApp);
