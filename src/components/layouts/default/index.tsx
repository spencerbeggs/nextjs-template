import { TopNavDesktop } from "@components/nav";
import { TopNavMobile } from "@components/nav/top-nav/mobile/top-nav.mobile";
import { Page } from "@components/page/page";
import styles from "./default-layout.module.scss";
import { Adaptive } from "@components/globals/adaptive";
export const DefaultLayout: React.FC = ({ children }) => {
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
