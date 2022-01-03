import { useDispatch } from "react-redux";
import { Sidebar } from "@components/nav";
import { TopNav } from "@components/nav/top-nav/top-nav.component";
import { Page } from "@components/page/page";
import { useResize } from "@hooks/use-resize";
import { setBrowserDevice } from "@util/store/device";
import styles from "./default-layout.module.scss";

export const DefaultLayout: React.FC = ({ children }) => {
	const dispatch = useDispatch();

	// handle resize for app
	useResize(200, function () {
		dispatch(setBrowserDevice(window.navigator.userAgent));
	});

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
