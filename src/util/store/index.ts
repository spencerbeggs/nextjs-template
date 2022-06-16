import { Action, configureStore,  Middleware, ThunkAction } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { default as logger } from "redux-logger";
import device from "./device";
import nav from "./nav";

const makeStore = () => {
	const isDev = process.env.NODE_ENV !== "production";
	const middleware: Middleware[] = [];
	if (isDev && typeof window !== "undefined") {
		middleware.push(logger);
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


export const wrapper = createWrapper<AppStore>(makeStore);

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;


