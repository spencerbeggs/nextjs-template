import Link from "next/link";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useOnClickOutside } from "@hooks/use-on-click-outside";
import { closeSidebar } from "@util/actions";
import styles from "./top-nav.desktop.module.scss";

export const TopNavDesktop: React.FC = () => {
	const dispatch = useDispatch();
	const ref = useRef<HTMLElement>(null);

	useOnClickOutside(ref, () => {
		dispatch(closeSidebar());
	});

	return (
		<nav className={styles.topNav}>
			<div className={styles.menu}>
				<nav className={styles.desktop}>
					<Link href="/docs">Read the Docs</Link>
				</nav>
			</div>
		</nav>
	);
};
