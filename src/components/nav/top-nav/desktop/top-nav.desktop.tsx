import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import styles from "./top-nav.desktop.module.css";

export const TopNavDesktop: React.FC = () => {
	const ref = useRef<HTMLElement>(null);
	const { pathname } = useRouter();

	return (
		<nav className={styles.topNav} ref={ref}>
			<div className={styles.menu}>
				<nav className={styles.desktop}>
					<Link className="link" href={pathname === "/" ? "/docs/adaptive-rendering" : "/"}>
						{pathname === "/" ? "Read the Docs" : "Home"}
					</Link>
				</nav>
			</div>
		</nav>
	);
};
