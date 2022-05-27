import styles from "./page.module.css";

type Props = { children: React.ReactNode };

export const Page: React.FC<Props> = ({ children }) => (
	<section className={styles.wrapper}>
		<div className={styles.inner}>{children}</div>
	</section>
);
