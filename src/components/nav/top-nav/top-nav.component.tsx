import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { TopNavContext } from "@contexts/nav.context";
import { useOnClickOutside } from "@hooks/use-on-click-outside";
import { useSelector } from "@hooks/use-selector";
import { closeSidebar, toggleSidebar } from "@util/actions";
import menu from "./menu.svg";
import styles from "./top-nav.module.scss";

const MenuTitle: React.FC = () => {
	const isMobile = useSelector((state) => state.device.mobile);
	const {
		state: { section, title }
	} = useContext(TopNavContext);
	const [headline, setHeadline] = useState<string | null>(null);

	useEffect(() => {
		const newHeadline = [section, title].filter((str) => Boolean(str)).join(" — ");
		setHeadline(newHeadline);
	}, [section, title]);

	return <h1 className={!isMobile ? styles.menuTitle : styles.menuTitleHidden}>{headline}</h1>;
};

export const TopNav: React.FC = () => {
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
				<Image alt="logo" src={menu} width={20} height={18} onClick={() => toggle()} />
				<MenuTitle />
			</div>
		</nav>
	);
};
