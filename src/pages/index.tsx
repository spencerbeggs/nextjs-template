import Head from "next/head";
import React, { ReactElement } from "react";
import { DefaultLayout } from "@components/layouts/default";
import styles from "./home.module.scss";

export default function Home() {
	return (
		<>
			<Head>
				<title key="title">Home</title>
			</Head>
			<div className={styles.home}>
				<h1>Hello world!</h1>
			</div>
		</>
	);
}

Home.getLayout = function getLayout(page: ReactElement) {
	return <DefaultLayout>{page}</DefaultLayout>;
};
