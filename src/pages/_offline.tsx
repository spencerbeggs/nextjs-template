import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { NextPage } from "next";
import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import { useSelector } from "react-redux";
import { ShellLayout } from "@components/layouts/shell.layout";
import { AppState, serverSide, wrapper } from "@util/store";

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

interface PageProps {
	meta?: {
		title?: string;
		description: string;
	};
}

const Offline: NextPageWithLayout = ({ meta, ...rest }: PageProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { store, props } = wrapper.useWrappedStore(rest);
	const selectSelf = (state: AppState) => state;
	const isMobile = useSelector(createDraftSafeSelector(selectSelf, (state) => state.device.mobile));

	return (
		<>
			<Head>
				<title key="title">{`${meta?.title} | ${isMobile ? "Mobile" : "Desktop"}`}</title>
				<meta name="description" key="description" content={meta?.description} />
			</Head>
			<div>
				<h1>Offline</h1>
			</div>
		</>
	);
};

export const config = {
	unstable_includeFiles: [".next/static/chunks/**/*.js"]
};

export const getServerSideProps = wrapper.getServerSideProps((store) => gsspWithNonce(async ({ req, res }) => {
	await serverSide(store, req, res);
	return {
		props: {
			meta: {
				title: "Docs",
				description: "Read the docs."
			}
		}
	};
}));

Offline.getLayout = ShellLayout.single;

export default Offline;
