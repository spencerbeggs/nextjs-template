import styles from "./page.module.scss";

export const Page: React.FC = ({ children }) => (
	<section className={styles.wrapper}>
		<div className={styles.inner}>{children}</div>
	</section>
);
