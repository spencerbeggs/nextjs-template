import { throttle, isEqual } from "lodash-es";
import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { DeviceContext } from "@contexts/device.context";
import { hydrate } from "@util/actions";
import { parseUserAgent } from "@util/store/device";

export const useAdaptive = () => {
	const { state, update } = useContext(DeviceContext);
	const dispatch = useDispatch();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const resize = throttle(
				(evt) => {
					const newDevice = parseUserAgent(evt.target.navigator.userAgent);
					if (!isEqual(state, newDevice)) {
						dispatch(hydrate(newDevice));
						update(newDevice);
					}
				},
				50,
				{ leading: true }
			);
			window.addEventListener("resize", resize);
			return () => {
				window.removeEventListener("resize", resize);
			};
		}
	}, []);
};
