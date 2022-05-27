import Image from "next/image";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useOnClickOutside } from "@hooks/use-on-click-outside";
import { useSelector } from "@hooks/use-selector";
import { closeSidebar, toggleSidebar } from "@util/actions";
import styles from "./top-nav.mobile.module.css";

export const TopNavMobile: React.FC = () => {
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
		<nav className={styles.mobile}>
			<Image alt="logo" src={new URL("./menu.svg", import.meta.url).pathname} width={20} height={18} onClick={() => toggle()} />
		</nav>
	);
};
