// Date Widget
import type { Display } from "../types";
import type { Date_Field, Date_Params } from "./types";

let widget =  ({
	// Defines type of collections
	title,
	icon,
	required,
	display,
}: Date_Params) => {
	if (!display) display = (data: any, field: any, entry: any) => data;

	let field = { schema: {}, title, icon, required, display } as Date_Field;
	field.schema[title] = "string";

	field.widget = async () => {
		// @ts-ignore
		return (await import("./Date.svelte")).default;
	};
	return field;
};

export default widget