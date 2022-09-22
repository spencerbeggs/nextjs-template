import { gsspWithNonce } from "@next-safe/middleware/dist/document";
import { createDraftSafeSelector } from "@reduxjs/toolkit";
import Head from "next/head";
import { useSelector } from "react-redux";
import { ShellLayout } from "@components/layouts/shell.layout";
import { AppState, serverSide, wrapper } from "@util/store";

interface PageProps {
	meta?: {
		title?: string;
		description: string;
	};
}

function FAQ({ meta, ...rest }: PageProps) {
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
				<h1>FAQ</h1>
			</div>
		</>
	);
}

export const config = {
	unstable_includeFiles: [".next/static/chunks/**/*.js"]
};

export const getServerSideProps = wrapper.getServerSideProps((store) => gsspWithNonce(async ({ req, res }) => {
	await serverSide(store, req, res);
	return {
		props: {
			meta: {
				title: "FAQ",
				description: "Frequently asked questions"
			}
		}
	};
}));

FAQ.getLayout = ShellLayout.single;

export default FAQ;
