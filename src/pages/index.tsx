import { createDraftSafeSelector } from "@reduxjs/toolkit";
import Head from "next/head";
import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { DefaultLayout } from "@components/layouts/default";
import { AppState } from "@util/store";
import styles from "./home.module.css";

export default function Home() {
	const selectSelf = (state: AppState) => state;
	const isMobile = useSelector(createDraftSafeSelector(selectSelf, (state) => state.device.mobile));
	return (
		<>
			<Head>
				<title key="title">{isMobile ? "mobile" : "desktop"}</title>
				<meta
					name="description"
					key="description"
					content="This repo is a GitHub template that can be used to deploy a barebones webapp with in minutes."
				/>
			</Head>
			<div className={styles.home}>
				<article className={styles.article}>
					<h1>Steal This Template...</h1>
					<p className={styles.tout}>
						⚡ <a href="https://nextjs.org/">Next.js 12</a> ⚡{" "}
						<a href="https://tailwindcss.com/">Tailwind CSS</a> ⚡{" "}
						<a href="https://www.typescriptlang.org/">TypeScript</a> ⚡ <a href="https://redux.js.org/">Redux</a>{" "}
						⚡ Local SSL ⚡ Vercel ⚡
					</p>
					<p>This repo is a GitHub template that can be used to deploy a barebones webapp with in minutes.</p>
					<h2>Features</h2>
					<ul className={styles.ul}>
						<li>Next.js 12 with Server-Side Modules</li>
						<li>Tailwind with all the plugins</li>
						<li>Local SSL server</li>
						<li>VSCode intergration</li>
						<li>Figma project export graphics</li>
						<li>Adaptive SSR rendering</li>
						<li>Deploy to Vercel in minutes</li>
						<li>Bootstrap script</li>
					</ul>
				</article>
			</div>
		</>
	);
}

Home.getLayout = function getLayout(page: ReactElement) {
	return <DefaultLayout>{page}</DefaultLayout>;
};
