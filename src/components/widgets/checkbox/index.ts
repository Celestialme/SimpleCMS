import type { Display } from "../types";
import type { Checkbox_Field, Checkbox_Params } from "./types";

let widget =  ({
	// accept parameters from collection
	title,
	icon,
	color,
	required,
	display,
}: Checkbox_Params) => {
	if (!display) display = (data: any, field: any, entry: any) => data;

	let field = { schema: {}, title, icon, color, required, display } as Checkbox_Field;

	field.schema[title] = "string";

	field.widget = async () => {
		// @ts-ignore
		return (await import("./Checkbox.svelte")).default;
	};
	return field;
};

export default widget