import { createAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { set } from "lodash-es";
import { HYDRATE } from "next-redux-wrapper";
import { IDevice } from "ua-parser-js";

export const detectDevice = createAsyncThunk("device/detect", async (ua: string) => {
	const { default: UAParser } = await import("ua-parser-js");
	const UA = new UAParser(ua);
	const result = UA.getDevice();
	return result;
});

type DeviceDetected = null | boolean;

export type DeviceState = Record<"mobile" | "tablet" | "desktop" | "tv", DeviceDetected>;

export type DeviceType = keyof DeviceState;

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
			set: (state, action) => {
				return {
					mobile: action.payload === "mobile",
					tablet: action.payload === "tablet",
					desktop: action.payload === "desktop",
					tv: action.payload === "tv"
				};
			}
		},
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

export const { set: setDevice } = slice.actions;