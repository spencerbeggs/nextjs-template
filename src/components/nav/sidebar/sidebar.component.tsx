import slugify from "@sindresorhus/slugify";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useOnClickOutside } from "@hooks/use-on-click-outside";
import { useSelector } from "@hooks/use-selector";
import { closeSidebar } from "@util/actions";
import logo from "./coindesk-logo.svg";
import expand from "./expand.svg";
import styles from "./sidebar.module.scss";

interface Subnav {
	title: string;
	pathname: string;
}

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

const Subnav: React.FC<SubnavProps> = ({ title, pages }) => {
	const router = useRouter();
	const base = slugify(title);
	const [open, setOpen] = useState(router.asPath.split("/")[1] === base);
	return (
		<ul className={styles.subnav}>
			<li
				className={styles.subnavTitle}
				onClick={() => {
					setOpen(!open);
				}}
			>
				{title}
				<span className={open ? styles.chevronDown : styles.chevronRight}>
					<Image alt="foo" src={expand} width={12} height={9} />
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
	const dispatch = useDispatch();
	const ref = useRef<HTMLElement>(null);
	const open = useSelector((state) => state.nav.sidebar.open);

	useOnClickOutside(ref, () => {
		if (open) {
			dispatch(closeSidebar());
		}
	});

	return (
		<nav className={open ? styles.sidebar : styles.sidebarClosed} ref={ref}>
			<div className={styles.sidebarInner}>
				<Link href="/">
					<a className={styles.logo}>
						<Image alt="logo" src={logo} width={140} height={23} />
					</a>
				</Link>

				<Subnav
					title="Learn"
					pages={["Research & Discovery", "Ideation", "Wireframe", "User Testing", "Final Design"]}
				/>
				<Subnav title="Newsletter" pages={["Research & Discovery", "User Testing", "Final Design"]} />
				<Subnav title="About Us" pages={["Research & Discovery", "Ideation", "Wireframe", "Final Design"]} />
				<Subnav
					title="Homepage"
					pages={["Research & Discovery", "Ideation", "User Testing", "Wireframe & Final Design"]}
				/>
				<Subnav
					title="Price"
					pages={["Research & Discovery", "Ideation", "Wireframe", "User Testing", "Final Design"]}
				/>
				<Subnav title="Article" pages={["Research & Discovery", "Ideation", "User Testing", "Final Design"]} />
				<Subnav title="Typography Exploration" pages={["Research & Discovery", "User Testing", "Logo Design"]} />
				<Subnav title="Podcast" pages={["Research & Discovery", "Wireframe"]} />
			</div>
		</nav>
	);
};
