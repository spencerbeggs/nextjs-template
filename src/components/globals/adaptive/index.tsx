import { Children, ReactNode } from "react";
import { useSelector } from "react-redux";
import { State } from "@util/store";

const shouldRenderMobile = (children: ReactNode, isMobile: boolean): ReactNode => {
	const count = Children.count(children);
	switch (count) {
		case 1:
			return isMobile ? Children.toArray(children)[0] : null;
		case 2:
			return isMobile ? Children.toArray(children)[0] : null;
		case 3:
			return isMobile ? Children.toArray(children)[0] : null;
		default:
			return null;
	}
};

const shouldRenderTablet = (children: ReactNode, isTablet: boolean): ReactNode => {
	const count = Children.count(children);
	switch (count) {
		case 1:
			return null;
		case 2:
			return isTablet ? (Children.toArray(children)[1] as ReactNode) : null;
		case 3:
			return isTablet ? (Children.toArray(children)[1] as ReactNode) : null;
		default:
			return null;
	}
};

const shouldRenderDesktop = (children: ReactNode, isDesktop: boolean, isTablet: boolean): ReactNode => {
	const count = Children.count(children);
	switch (count) {
		case 1:
			return null;
		case 2:
			return isDesktop || isTablet ? (Children.toArray(children)[1] as ReactNode) : null;
		case 3:
			return isDesktop ? (Children.toArray(children)[2] as ReactNode) : null;
		default:
			return null;
	}
};

type Props = { children: React.ReactNode };

export const Adaptive: React.FC<Props> = ({ children }) => {
	const isDesktop = useSelector((state: State) => state.device.desktop);
	const isTablet = useSelector((state: State) => state.device.tablet);
	const isMobile = useSelector((state: State) => state.device.mobile);
	const Mobile = shouldRenderMobile(children, isMobile ?? false);
	const Tablet = shouldRenderTablet(children, isTablet ?? false);
	const Desktop = shouldRenderDesktop(children, isDesktop ?? false, isTablet ?? false);
	return (
		<>
			{Mobile}
			{Tablet}
			{Desktop}
		</>
	);
};
