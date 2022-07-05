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

function Tutorials({ meta, ...rest }: PageProps) {
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
				<h1>Docs</h1>
			</div>
		</>
	);
}

export const config = {
	unstable_includeFiles: [".next/static/chunks/**/*.js"]
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, res }) => {
	await serverSide(store, req, res);
	return {
		props: {
			meta: {
				title: "Tutorials",
				description: "Get started with a walkthrough"
			}
		}
	};
});

Tutorials.getLayout = ShellLayout.single;

export default Tutorials;
