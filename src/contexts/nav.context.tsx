import { createCtx } from "@helpers/context";

export interface TopNavContextProps {
	section: string;
	title: string;
}

export const [TopNavContext, TopNavProvider] = createCtx<TopNavContextProps>({
	section: "",
	title: ""
});
