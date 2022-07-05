import { IncomingMessage, ServerResponse } from "http";
import { Action, configureStore, Middleware, nanoid, ThunkAction } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { createLogger } from "redux-logger";
import device, { detectDevice, DeviceState } from "./device";
import nav from "./nav";

const makeStore = () => {
	const isDev = process.env.NODE_ENV !== "production";
	const middleware: Middleware[] = [];
	if (isDev && typeof window !== "undefined") {
		middleware.push(
			createLogger({
				collapsed: true
			})
		);
	}
	return configureStore({
		reducer: {
			[device.name]: device.reducer,
			[nav.name]: nav.reducer
		},
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middleware),
		devTools: isDev && typeof window !== "undefined"
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const wrapper = createWrapper<AppStore>(makeStore);

export const serverSide = async (store: AppStore, req?: IncomingMessage, res?: ServerResponse) => {
	if (res) {
		res.setHeader("csp-nonce", nanoid());
		res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=259200");
	}
	if (req?.headers?.["user-agent"]) {
		await store.dispatch(detectDevice(req.headers["user-agent"]));
		const { device } = store.getState();
		const type = Object.keys(device).find((key) => device[key as keyof DeviceState] === true);
		res?.setHeader("x-device", type ?? "desktop");
	} else {
		console.log("__CLIENT__");
	}
};
