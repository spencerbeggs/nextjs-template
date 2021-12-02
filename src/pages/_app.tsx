import type { AppProps } from "next/app";
import "../styles/main.scss";
import styles from "./app.module.scss";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<main className={styles.main}>
			<Component {...pageProps} />
		</main>
	);
}

export default MyApp;
