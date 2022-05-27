import { createSlice, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { createRouterMiddleware, initialRouterState, routerReducer } from "connected-next-router";
import type { RouterState } from "connected-next-router/types";
import { NextPageContext } from "next";
import { HYDRATE, MakeStore, createWrapper, Context } from "next-redux-wrapper";
import { AppContext } from "next/app";
// eslint-disable-next-line import/no-named-as-default
import Router from "next/router";
import { AnyAction, applyMiddleware, combineReducers, Reducer, Store } from "redux";
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
	return state?.router && typeof window !== "undefined";
};

const reducer: Reducer<State, AnyAction> = (state, action) => {
	if (action.type === HYDRATE) {
		const nextState = {
			...state, // use previous state
			...action.payload
		};

		if (isRouter(state) && typeof window !== "undefined") {
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

		return combinedReducer(nextState, action);
	} else {
		//console.log("Default:", combinedReducer(state, action));
		return combinedReducer(state, action);
	}
};

export const initStore: MakeStore<Store> = function (context: Context) {
	const { asPath, req } = (context as AppContext).ctx || Router.router || {};
	const middleware = [promise, thunk, createRouterMiddleware()];
	if (typeof window !== "undefined") {
		const logger = createLogger({
			collapsed: true,
			diff: false
		});
		middleware.push(logger);
	}

	// const initialState = {
	// 	device: detectDevice(req?.headers),
	// 	nav: InitialNavState,
	// 	router: initialRouterState(asPath)
	// };
	//console.log(initialState);

	const counterSlice = createSlice({
		name: "counter",
		initialState: {
			value: 0
		},
		reducers: {
			incremented: (state) => {
				// Redux Toolkit allows us to write "mutating" logic in reducers. It
				// doesn't actually mutate the state because it uses the Immer library,
				// which detects changes to a "draft state" and produces a brand new
				// immutable state based off those changes
				state.value += 1;
			},
			decremented: (state) => {
				state.value -= 1;
			}
		}
	});

	return configureStore({
		reducer,
		middleware,
		devTools: true
	});
};

export const wrapper = createWrapper<Store>(initStore);
