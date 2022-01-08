import "../styles/main.scss";
import type { NextPage } from "next";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import Head from "next/head";
import { ReactElement, ReactNode, useEffect } from "react";
import { DeviceProvider } from "@contexts/device.context";
import { useResize } from "@hooks/use-resize";
import { wrapper } from "@util/store";
import { detectDevice, DeviceState } from "@util/store/device";

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
	const compare = useResize(200);
	useEffect(() => compare(device), [device]);
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

MyApp.getInitialProps = async (context: AppContext) => {
	const device = detectDevice(context?.ctx?.req?.headers);
	const appProps = await App.getInitialProps(context);
	return { ...appProps, device };
};

export default wrapper.withRedux(MyApp);
