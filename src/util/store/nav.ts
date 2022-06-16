import { createAction, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export type NavState = {
	sidebar: {
		open: boolean;
	};
};

export const setOpen = createAction<boolean>("setOpen");
const hydrate = createAction<{ nav: NavState }>(HYDRATE);

const slice = createSlice({
	name: "nav",
	initialState: {
		sidebar: {
			open: false
		}
	} as NavState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(hydrate, (state, action) => {
				return {
					...state,
					...action.payload.nav
				};
			})
			.addCase(setOpen, (state, action) => {
				state.sidebar.open = action.payload;
			})
			.addDefaultCase((state) => state);
	}
});

export default slice;
