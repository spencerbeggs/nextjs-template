import Link from "next/link";
import { useRouter } from "next/router";
import {  FC, SVGProps, useEffect, useState } from "react";

type SideItemProps = {
	name: string;
	href: string;
	Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

type Extention = [value: boolean, classes: string];

class TW {
	static parse(str: string) {
		return new Set(str.split(" ").filter((part) => Boolean(part)));
	}
	static cn(base: string, ...extentions: Extention[]) {
		let classes = TW.parse(base);
		for (const [flag, additional] of extentions.values()) {
			if (flag === true) {
				classes = new Set([...classes, ...TW.parse(additional)]);
			} 
		}
		return Array.from(classes).join(" ");
	}
}

export const SidebarItem: FC<SideItemProps> = ({ name, href, Icon }) => {
    const { pathname } = useRouter();
    const [active, setActive] = useState(pathname === href);

    useEffect(() => {
        setActive(pathname === href);
	}, [pathname]);

	return (
		<Link
			data-x="sidebar-item"
			href={href}
			className={TW.cn(
				"flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-700",
				[active, "cursor-default bg-gray-700 text-white"],
				[!active, "text-gray-300 hover:text-white hover:bg-gray-900"]
			)}
		>
			<Icon
				className={TW.cn(
					"mr-3 h-6 w-6 flex-shrink-0",
					[active, "text-gray-400 group-hover:text-gray-300"],
					[!active, "text-gray-400 group-hover:text-gray-300"]
				)}
				aria-hidden="true"
			/>
			<span>{name}</span>
		</Link>
	);
};
