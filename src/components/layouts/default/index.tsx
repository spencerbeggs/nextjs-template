import { Adaptive } from "@components/globals/adaptive";
import { TopNavDesktop } from "@components/nav";
import { TopNavMobile } from "@components/nav/top-nav/mobile/top-nav.mobile";
import { Page } from "@components/page/page";
import styles from "./default-layout.module.css";

type Props = { children: React.ReactNode };

export const DefaultLayout: React.FC<Props> = ({ children }) => {
	return (
		<main className={styles.main}>
			<Adaptive>
				<TopNavMobile />
				<TopNavDesktop />
			</Adaptive>
			<div className={styles.layout}>
				<Page>{children}</Page>
			</div>
		</main>
	);
};
