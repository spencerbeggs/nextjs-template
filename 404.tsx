import { NextPage } from "next";
import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import {  wrapper } from "@util/store";

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

interface PageProps {
	meta?: {
		title?: string;
		description: string;
	};
}

const Custom404: NextPageWithLayout = ({ meta, ...rest }: PageProps) => {


	return (
		<>
			<Head>
				<title key="title">{meta?.title}</title>
				<meta name="description" key="description" content={meta?.description} />
			</Head>
			<div>
				<h1>404</h1>
			</div>
		</>
	);
};

export const config = {
	unstable_includeFiles: [".next/static/chunks/**/*.js"]
};

export const getStaticProps = wrapper.getStaticProps(() => async () => {
	return {
		props: {
			meta: {
				title: "404 - Page not found",
				description: "The requested URL was not found on this server."
			}
		}
	};
});


export default Custom404;
