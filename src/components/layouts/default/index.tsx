import { Sidebar } from "@components/nav";
import { TopNav } from "@components/nav/top-nav/top-nav.component";
import { Page } from "@components/page/page";
import styles from "./default-layout.module.scss";

export const DefaultLayout: React.FC = ({ children }) => {
	return (
		<main className={styles.main}>
			<TopNav />
			<Sidebar />
			<div className={styles.layout}>
				<Page>{children}</Page>
			</div>
		</main>
	);
};
