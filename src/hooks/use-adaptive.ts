import { throttle, isEqual } from "lodash-es";
import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { DeviceContext } from "@contexts/device.context";
import { setDevice } from "@util/store/device";

export const useAdaptive = () => {
	const { state } = useContext(DeviceContext);
	const dispatch = useDispatch();

	useEffect(() => {
		if (typeof window !== "undefined") {
			(async () => {
				const { default: UAParser } = await import("ua-parser-js");
				const resize = throttle(
					(evt) => {
						const UA = new UAParser(evt.target.navigator.userAgent);
						const newDevice = UA.getDevice();
						if (!isEqual(state, newDevice)) {
							dispatch(setDevice(newDevice));
						}
					},
					50,
					{ leading: true }
				);
				window.addEventListener("resize", resize);
				return () => {
					window.removeEventListener("resize", resize);
				};
			})();
		}
	}, []);
};
