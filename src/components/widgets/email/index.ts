import type { Display } from "../types";
import type { Email_Field, Email_Params } from "./type";

let widget = ({
	// Accept parameters from collection
	title,
	icon,
	placeholder,
	required,
	localization,
	display,
}: Email_Params) => {
	if (!display) display = (data: any, field: any, entry: any) => data;

	let field  = { schema: {}, title, icon, placeholder, required, localization, display } as Email_Field;

	field.schema[title] = "string";

	field.widget = async () => {
		// @ts-ignore
		return (await import("./Email.svelte")).default;
	};
	return field;
};

export default widget