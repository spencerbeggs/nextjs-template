import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useOnClickOutside } from "@hooks/use-on-click-outside";
import { useSelector } from "@hooks/use-selector";
import { closeSidebar, toggleSidebar } from "@util/actions";
import styles from "./top-nav.desktop.module.scss";
import { Adaptive } from "@components/globals/adaptive";
import Link from "next/link";
import { useRef } from "react";

export const TopNavDesktop: React.FC = () => {
	const dispatch = useDispatch();
	const ref = useRef<HTMLElement>(null);
	const open = useSelector((state) => state.nav.sidebar.open);

	const toggle = () => {
		dispatch(toggleSidebar(open));
	};

	useOnClickOutside(ref, () => {
		dispatch(closeSidebar());
	});

	return (
		<nav className={styles.topNav}>
			<div className={styles.menu}>
				<Adaptive>
					<nav className={styles.desktop}>
						<Link href="/docs">Read the Docs</Link>
					</nav>
				</Adaptive>
			</div>
		</nav>
	);
};
