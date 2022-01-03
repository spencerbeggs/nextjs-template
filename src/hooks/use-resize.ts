import useEventListener from "@use-it/event-listener";
import throttle from "lodash-es/throttle";
import { useState } from "react";

export const useResize = (ms = 0, onResize?: (height: number, width: number) => void): [width: number, height: number] => {
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	useEventListener(
		"resize",
		throttle(
			() => {
				const newWidth = window.innerWidth;
				const newHeight = window.innerHeight;
				if (width !== newWidth && typeof onResize === "function") {
					onResize(newWidth, newHeight);
				}
				setWidth(newWidth);
				setHeight(newHeight);
			},
			ms,
			{ leading: true }
		)
	);
	return [width, height];
};
