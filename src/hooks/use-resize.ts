import throttle from "lodash-es/throttle";
import { useState, useContext, useEffect } from "react";
import { DeviceContext } from "@contexts/device.context";
import { parseUserAgent, DeviceState } from "@util/store/device";

export const useResize = (ms: 200) => {
	const { state, update } = useContext(DeviceContext);
	const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
	const [height, setHeight] = useState(typeof window !== "undefined" ? window.innerHeight : 0);

	const compare = (deviceState: DeviceState) => {
		if (typeof window !== undefined) {
			if (!Object.is(state, deviceState)) {
				update(deviceState);
			}
		}
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			const resize = throttle(
				() => {
					const newWidth = window.innerWidth;
					const newHeight = window.innerHeight;
					if (width !== newWidth || newHeight !== height) {
						const newDevice = parseUserAgent(window.navigator.userAgent);
						compare(newDevice);
					}
					setWidth(newWidth);
					setHeight(newHeight);
				},
				ms,
				{ leading: true }
			);
			window.addEventListener("resize", resize);
			return () => {
				window.removeEventListener("mousemove", resize);
			};
		}
	}, []);

	return compare;
};
