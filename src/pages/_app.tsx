import "./_app.css";
import { throttle } from "lodash-es";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactElement, ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { wrapper } from "@util/store";
import { detectDevice, setDevice } from "@util/store/device";

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<NextPage> & {
	Component: NextPageWithLayout;
};

const assets = {
	icons: {
		icon180x180: new URL("/apple-touch-icon.png", process.env.NEXT_PUBLIC_SITE_DOMAIN).href,
		icon32x32: new URL("/favicon-32x32.png", process.env.NEXT_PUBLIC_SITE_DOMAIN).href,
		icon16x16: new URL("/favicon-16x16.png", process.env.NEXT_PUBLIC_SITE_DOMAIN).href
	},
	manifest: new URL("/api/manifest", process.env.NEXT_PUBLIC_SITE_DOMAIN).href
};


const MyApp: React.FC<AppPropsWithLayout> = ({ Component, ...rest }) => {
	const getLayout = Component.getLayout || ((page) => page);
	const { store, props } = wrapper.useWrappedStore({
		...rest
	});

	store.dispatch(setDevice(rest.router.query.device));

	useEffect(() => {
		if (typeof window !== "undefined") {
			(async () => {
				const resize = throttle(
					(evt) => {
						store.dispatch(detectDevice(evt.target.navigator.userAgent));
					},
					50,
					{ leading: true }
				);
				window.addEventListener("resize", resize);
				return () => {
					window.removeEventListener("resize", resize);
				};
			})();
		}
	}, []);

	return (
		<Provider store={store}>
			<Head>
				<title key="title">App</title>
				<meta key="viewport" name="viewport" content="width=device-width, initial-scale=1" />
				<meta key="theme-color" name="theme-color" content="#fb31aa" />
				<link key="apple-touch-icon" rel="apple-touch-icon" sizes="180x180" href={assets.icons.icon180x180} />
				<link key="icon-32x32" rel="icon" type="image/png" sizes="32x32" href={assets.icons.icon32x32} />
				<link key="icon-16x16" rel="icon" type="image/png" sizes="16x16" href={assets.icons.icon16x16} />
				<link key="manifest" rel="manifest" href={assets.manifest}></link>
			</Head>
			{getLayout(<Component {...props.pageProps} />)}
		</Provider>
	);
};

export default MyApp;
