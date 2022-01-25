import { Sidebar } from "@components/nav";
import { TopNavDesktop } from "@components/nav/top-nav/top-nav.component";
import { Page } from "@components/page/page";
import styles from "./default-layout.module.scss";
import { Adaptive } from "@components/globals/adaptive";
export const DefaultLayout: React.FC = ({ children }) => {
	return (
		<main className={styles.main}>
			<Adaptive>
				<Sidebar />
				<TopNavDesktop />
			</Adaptive>
			<div className={styles.layout}>
				<Page>{children}</Page>
			</div>
		</main>
	);
};
