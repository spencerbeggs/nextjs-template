import { IncomingHttpHeaders } from "http";
import { createRouterMiddleware, initialRouterState, routerReducer } from "connected-next-router";
import type { RouterState } from "connected-next-router/types";
import { Context, createWrapper, HYDRATE, MakeStore } from "next-redux-wrapper";
import { AppContext } from "next/app";
// eslint-disable-next-line import/no-named-as-default
import Router from "next/router";
import { AnyAction, applyMiddleware, combineReducers, createStore, Reducer, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";
import { detectBrowserDevice, detectServerDevice, device, DeviceState, ServerHeaders } from "./device";
import { NavState, InitialNavState, nav } from "./nav";

export interface State {
	router: RouterState;
	device: DeviceState;
	nav: NavState;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hasHeaders = (req: any): req is IncomingHttpHeaders => {
	return req?.headers !== undefined;
};

const combinedReducer = combineReducers({
	router: routerReducer,
	device,
	nav
});

const reducer: Reducer<State, AnyAction> = (state, action) => {
	if (action.type === HYDRATE) {
		const nextState = {
			...state, // use previous state
			...action.payload
		};

		if (typeof window !== "undefined" && state?.router) {
			// preserve router value on client side navigation
			nextState.router = state.router;
			nextState.device = detectBrowserDevice(window.navigator.userAgent);
			nextState.nav = state.nav;
		}
		return nextState;
	} else if (action.type === "@@INIT" && typeof window === "object") {
		const nextState = {
			...state,
			device: detectBrowserDevice(window.navigator.userAgent),
			router: initialRouterState(`${window.location.pathname}${window.location.search}`),
			nav: InitialNavState
		};
		return combinedReducer(nextState, action);
	} else {
		return combinedReducer(state, action);
	}
};

export const initStore: MakeStore<Store> = function (context: Context) {
	const { asPath, req } = (context as AppContext).ctx || Router.router || {};
	const middleware = [promise, thunk, createRouterMiddleware()];
	let initialState;

	if (typeof window !== "undefined" && process.env.APP_ENV !== "production") {
		const logger = createLogger({
			collapsed: true,
			diff: false
		});
		middleware.push(logger);
	}

	if (hasHeaders(req) && process.env.APP_ENV === "local") {
		initialState = {
			device: detectBrowserDevice((req.headers as ServerHeaders)["user-agent"]),
			router: initialRouterState(asPath),
			nav: InitialNavState
		};
	} else if (hasHeaders(req) && process.env.APP_ENV !== "local") {
		initialState = {
			device: detectServerDevice(req.headers as ServerHeaders),
			router: initialRouterState(asPath),
			nav: InitialNavState
		};
	} else if (process.env.APP_ENV === "local" && typeof window === "object") {
		initialState = {
			device: detectBrowserDevice(window.navigator.userAgent),
			router: initialRouterState(asPath),
			nav: InitialNavState
		};
	}

	return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));
};

export const wrapper = createWrapper(initStore);
