// DateRange Widget
import type { Display } from "../types";
import type { DateRange_Field, DateRange_Params } from "./type";
let widget =  ({
	// Defines type of collections
	title,
	icon,
	format,
	required,
	display,
}: DateRange_Params) => {
	if (!display) display = (data: any, field: any, entry: any) => data;

	let field  = { schema: {}, title, icon, format, required, display } as DateRange_Field;

	field.schema[title] = "string";

	field.widget = async () => {
		// @ts-ignore
		return (await import("./DateRange.svelte")).default;
	};
	return field;
};

export default widget