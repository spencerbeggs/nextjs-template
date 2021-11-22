import Head from "next/head";
import { useDispatch } from "react-redux";
import { useResize } from "@hooks/use-resize";
import { setBrowserDevice } from "@util/store/device";
import styles from "./default-layout.module.scss";

export const DefaultLayout: React.FC = ({ children }) => {
	const dispatch = useDispatch();

	// handle resize for app
	useResize(200, function () {
		dispatch(setBrowserDevice(window.navigator.userAgent));
	});

	return (
		<div className={styles.layout}>
			<Head>
				<title>CoinDesk Process</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
				<link rel="manifest" href="/site.webmanifest"></link>
			</Head>
			{children}
		</div>
	);
};
