import { createCtx } from "@helpers/context";
import { DeviceState } from "@util/store/device";

export const [DeviceContext, DeviceProvider] = createCtx<DeviceState>({
	mobile: null,
	desktop: null,
	tablet: null,
	tv: null,
	browser: null
});
