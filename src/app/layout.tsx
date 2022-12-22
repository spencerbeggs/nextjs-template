import "./global.css";
import { Inter } from "@next/font/google";
import { ShellLayout } from "./components/shell";

type Props = {
	children?: React.ReactNode;
};

const assets = {
	icons: {
		icon180x180: new URL("/apple-touch-icon.png", process.env.NEXT_PUBLIC_SITE_DOMAIN).href,
		icon32x32: new URL("/favicon-32x32.png", process.env.NEXT_PUBLIC_SITE_DOMAIN).href,
		icon16x16: new URL("/favicon-16x16.png", process.env.NEXT_PUBLIC_SITE_DOMAIN).href
	},
	manifest: new URL("/api/manifest", process.env.NEXT_PUBLIC_SITE_DOMAIN).href
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: Props) {
	return (
		<html lang="en-US" className={inter.className}>
			<head>
				<meta key="viewport" name="viewport" content="width=device-width, initial-scale=1" />
				<link key="icon-16x16" rel="icon" type="image/png" sizes="16x16" href={assets.icons.icon16x16} />
				<link key="icon-32x32" rel="icon" type="image/png" sizes="32x32" href={assets.icons.icon32x32} />
				<link
					key="apple-touch-icon"
					type="image/png"
					rel="apple-touch-icon"
					sizes="180x180"
					href={assets.icons.icon180x180}
				/>
				<meta key="theme-color" name="theme-color" content="#fb31aa" />
				<link key="manifest" rel="manifest" href={assets.manifest}></link>
			</head>
			<body>
				<ShellLayout>{children}</ShellLayout>
			</body>
		</html>
	);
}

export const revalidate = 600;
