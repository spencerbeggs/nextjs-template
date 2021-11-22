import { TypedUseSelectorHook, useSelector as useSelect } from "react-redux";
import { State } from "@util/store";

export const useSelector: TypedUseSelectorHook<State> = useSelect;
