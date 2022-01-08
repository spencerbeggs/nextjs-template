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
import { detectDevice, device, DeviceState, parseUserAgent } from "./device";
import { NavState, InitialNavState, nav } from "./nav";

export type State = {
	router: RouterState;
	device: DeviceState;
	nav: NavState;
};

const combinedReducer = combineReducers({
	router: routerReducer,
	device,
	nav
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isRouter = (state: any): state is State => {
	return state?.router && typeof window === "undefined";
};

const reducer: Reducer<State, AnyAction> = (state, action) => {
	console.log(action);
	if (action.type === HYDRATE) {
		const nextState = {
			...state, // use previous state
			...action.payload
		};

		if (isRouter(state) && typeof window !== "undefined") {
			console.log(state);
			// preserve router value on client side navigation
			nextState.router = state.router;
			nextState.device = parseUserAgent(window.navigator.userAgent);
			nextState.nav = state.nav;
		}
		return nextState;
	} else if (action.type.startsWith("@@redux/INIT") && !isRouter(state) && typeof window !== "undefined") {
		const nextState = {
			...(state ?? {}),
			device: parseUserAgent(window.navigator.userAgent),
			router: initialRouterState(`${window.location.pathname}${window.location.search}`),
			nav: InitialNavState
		};
		console.log("@@redux/INIT", nextState);
		return combinedReducer(nextState, action);
	} else {
		console.log("Default:", combinedReducer(state, action));
		return combinedReducer(state, action);
	}
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isLocal = (process: any): process is NodeJS.Process => {
	return process?.env?.APP_ENV === "local" && typeof window !== "undefined";
};

export const initStore: MakeStore<Store> = function (context: Context) {
	console.log("Init store:", context);
	const { asPath, req } = (context as AppContext).ctx || Router.router || {};
	console.log(Router.router);
	const middleware = [promise, thunk, createRouterMiddleware()];

	const initialState = {
		device: detectDevice(req?.headers),
		nav: InitialNavState,
		router: initialRouterState(asPath)
	};

	if (isLocal(process)) {
		const logger = createLogger({
			collapsed: true,
			diff: false
		});
		middleware.push(logger);
	}

	console.log(initialState);

	return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));
};

export const wrapper = createWrapper(initStore);
