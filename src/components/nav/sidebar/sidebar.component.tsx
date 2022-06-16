import slugify from "@sindresorhus/slugify";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useOnClickOutside } from "@hooks/use-on-click-outside";
import { setOpen } from "@util/store/nav";
import styles from "./sidebar.module.css";

interface SubnavItemProps {
	title: string;
	base: string;
}

const SubnavItem: React.FC<SubnavItemProps> = ({ title, base }) => {
	const router = useRouter();
	const href = `/${base}/${slugify(title)}`;
	const isActive = href === router.asPath;
	return (
		<li className={styles.subnavItem}>
			<Link href={href}>
				<a className={isActive ? styles.subnavLinkActive : styles.subnavLink}>{title}</a>
			</Link>
		</li>
	);
};

interface SubnavProps {
	title: string;
	pages: string[];
}

export const Subnav: React.FC<SubnavProps> = ({ title, pages }) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const base = slugify(title);
	const [open] = useState(router.asPath.split("/")[1] === base);
	return (
		<ul className={styles.subnav}>
			<li
				className={styles.subnavTitle}
				onClick={() => {
					dispatch(setOpen(!open));
				}}
			>
				{title}
				<span className={open ? styles.chevronDown : styles.chevronRight}>
					<Image alt="foo" src={new URL("./expand.svg", import.meta.url).pathname} width={12} height={9} />
				</span>
			</li>
			<li className={open ? styles.subnavItemsWrapperActive : styles.subnavItemsWrapper}>
				<ul className={open ? styles.subnavItemsActive : styles.subnavItems}>
					{pages.map((title) => (
						<SubnavItem key={title} base={base} title={title} />
					))}
				</ul>
			</li>
		</ul>
	);
};

export const Sidebar: React.FC = () => {
	//const dispatch = useDispatch();
	const ref = useRef<HTMLElement>(null);
	//const open = useSelector((state) => state.nav.sidebar.open);
	const open = false;
	useOnClickOutside(ref, () => {
		if (open) {
			//dispatch(closeSidebar());
		}
	});

	return (
		<nav className={open ? styles.sidebar : styles.sidebarClosed} ref={ref}>
			<div className={styles.sidebarInner}>
				<Link href="/">
					<a className={styles.logo}>
						<Image alt="logo" src={new URL("./coindesk-logo.svg", import.meta.url).pathname} width={140} height={23} />
					</a>
				</Link>
			</div>
		</nav>
	);
};
