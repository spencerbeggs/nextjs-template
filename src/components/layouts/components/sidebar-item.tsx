import Link from "next/link";
import { useRouter } from "next/router";
import { FC, JSXElementConstructor, SVGProps, useEffect, useState } from "react";
import styles from "./sidebar-item.module.css";

type SideItemProps = {
	name: string;
	href: string;
	Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

export const SidebarItem: FC<SideItemProps> = ({ name, href, Icon }) => {
    const { pathname } = useRouter();
    const [current, setCurrent] = useState(pathname === href);

    useEffect(() => {
        setCurrent(pathname === href);
    }, [pathname]);

	return (
		<Link key={name} href={href}>
			<a className={current ? styles.current : styles.item}>
				<Icon className={current ? styles.icon_current : styles.icon_inactive} aria-hidden="true" />
				<span>{name}</span>
			</a>
		</Link>
	);
};
