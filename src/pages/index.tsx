import Head from "next/head";
import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { DefaultLayout } from "@components/layouts/default";
import { State } from "@util/store";
import styles from "./home.module.scss";

export default function Home() {
	const isMobile = useSelector<State, boolean>((state) => Boolean(state.device.mobile));
	return (
		<>
			<Head>
				<title key="title">Home</title>
			</Head>
			<div className={styles.home}>
				<h1>{isMobile ? "Mobile" : "Desktop"}</h1>
			</div>
		</>
	);
}

Home.getLayout = function getLayout(page: ReactElement) {
	return <DefaultLayout>{page}</DefaultLayout>;
};
