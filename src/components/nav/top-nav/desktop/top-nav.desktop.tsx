import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useOnClickOutside } from "@hooks/use-on-click-outside";
import { closeSidebar } from "@util/actions";
import styles from "./top-nav.desktop.module.css";

export const TopNavDesktop: React.FC = () => {
	const dispatch = useDispatch();
	const ref = useRef<HTMLElement>(null);

	const { pathname } = useRouter();

	useOnClickOutside(ref, () => {
		dispatch(closeSidebar());
	});

	return (
		<nav className={styles.topNav}>
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
