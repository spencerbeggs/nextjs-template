import { createAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { IDevice } from "ua-parser-js";

export const detectDevice = createAsyncThunk("device/detect", async (ua: string) => {
	const { default: UAParser } = await import("ua-parser-js");
	const UA = new UAParser(ua);
	const result = UA.getDevice();
	return result;
});

type DeviceDetected = null | boolean;

export type DeviceState = {
	mobile: DeviceDetected;
	desktop: DeviceDetected;
	tablet: DeviceDetected;
	tv: DeviceDetected;
};

const hydrate = createAction<{ device: IDevice }>(HYDRATE);

const initialState: DeviceState = {
	mobile: false,
	tablet: false,
	desktop: true,
	tv: false
};

const slice = createSlice({
	name: "device",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(hydrate, (state, action) => {
				return {
					...state,
					...action.payload.device
				};
			})
			.addCase(detectDevice.fulfilled, (state, action) => {
				return {
					mobile: action.payload.type === "mobile",
					tablet: action.payload.type === "tablet",
					desktop: action.payload.type === undefined,
					tv: action.payload.type === "smarttv"
				};
			})
			.addDefaultCase((state) => state);
	}
});

export default slice;
