import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { IDevice } from "ua-parser-js";

type DeviceDetected = null | boolean;

export type DeviceState = {
	mobile: DeviceDetected;
	desktop: DeviceDetected;
	tablet: DeviceDetected;
	tv: DeviceDetected;
};

export const setDevice = createAction<IDevice>("setDevice");
const hydrate = createAction<{ device: IDevice }>(HYDRATE);

const slice = createSlice({
	name: "device",
	initialState: {
		mobile: null,
		tablet: null,
		desktop: null,
		tv: null
	} as DeviceState,
	reducers: {
	},
    extraReducers: (builder) => {
        builder
            .addCase(hydrate, (state, action) => {
				return {
					...state,
					...action.payload.device
				};
			})
            .addCase(setDevice, (state, action) => {
                return {
					mobile: action.payload.type === "mobile",
					tablet: action.payload.type === "tablet",
					desktop: action.payload.type === undefined,
					tv : action.payload.type === "smarttv"
				};
			})
			.addDefaultCase((state, action) => state);
	}
});

export default slice;

