import { createDraftSafeSelector } from "@reduxjs/toolkit";
import Image from "next/image";
import React, { useRef } from "react";
import { useDispatch , useSelector } from "react-redux";
import { useOnClickOutside } from "@hooks/use-on-click-outside";
import type { AppState } from "@util/store";
import { setOpen } from "@util/store/nav";
import styles from "./top-nav.mobile.module.css";

export const TopNavMobile: React.FC = () => {
	const dispatch = useDispatch();
	const ref = useRef<HTMLElement>(null);
	const selectSelf = (state: AppState) => state;
 	const isOpen = useSelector(createDraftSafeSelector(selectSelf, (state) => state.nav.sidebar.open));
	const toggle = () => {
		dispatch(setOpen(!isOpen));
	};

	useOnClickOutside(ref, () => {
		dispatch(setOpen(false));
	});

	return (
		<nav className={styles.mobile}>
			<Image alt="logo" src={new URL("./menu.svg", import.meta.url).pathname} width={20} height={18} onClick={() => toggle()} />
		</nav>
	);
};
