import "./_app.css";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import { DeviceProvider } from "@contexts/device.context";
import { useAdaptive } from "@hooks/use-adaptive";
import { wrapper } from "@util/store";
import { setDevice } from "@util/store/device";;

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};


const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
	const getLayout = Component.getLayout || ((page) => page);
	useAdaptive();

	return (
		<DeviceProvider>
			<Head>
				<title key="title">App</title>
				<meta key="viewport" name="viewport" content="width=device-width, initial-scale=1" />
				<meta key="theme-color" name="theme-color" content="#fb31aa" />
				<link
					key="apple-touch-icon"
					rel="apple-touch-icon"
					sizes="180x180"
					href={new URL("/apple-touch-icon.png", process.env.NEXT_PUBLIC_SITE_DOMAIN).href}
				></link>
				<link
					key="icon-32x32"
					rel="icon"
					type="image/png"
					sizes="32x32"
					href={new URL("/favicon-32x32.png", process.env.NEXT_PUBLIC_SITE_DOMAIN).href}
				></link>
				<link
					key="icon-16x16"
					rel="icon"
					type="image/png"
					sizes="16x16"
					href={new URL("/favicon-16x16.png", process.env.NEXT_PUBLIC_SITE_DOMAIN).href}
				></link>
				<link
					key="manifest"
					rel="manifest"
					href={new URL("/site.webmanifest", process.env.NEXT_PUBLIC_SITE_DOMAIN).href}
				></link>
			</Head>
			{getLayout(<Component {...pageProps} />)}
		</DeviceProvider>
	);
};

MyApp.getInitialProps = wrapper.getInitialAppProps((store) => async ({ ctx: { req, res } }) => {
	if (req?.headers) {
		const { default: UAParser } = await import("ua-parser-js");
		const UA = new UAParser(req?.headers["user-agent"]);
		const result = UA.getDevice();
		res?.setHeader("X-Device", result.type ?? "desktop");
		store.dispatch(setDevice(result));
	}
	return { pageProps: {} };
});

export default wrapper.withRedux(MyApp);
