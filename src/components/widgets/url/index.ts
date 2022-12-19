import type { Display } from "../types";
import type { Url_Params,Url_Field } from "./types";

export default ({
	// Accept parameters from collection
	title,
	icon,
	placeholder,
	required,
	localization,
	display,
}: Url_Params) => {
	if (!display) display = (data: any, field: any, entry: any) => data;

	let field = { schema: {}, title, icon, placeholder, required, localization, display } as Url_Field;

	field.schema[title] = "string";

	field.widget = async () => {
		// @ts-ignore
		return (await import("./Url.svelte")).default;
	};
	return field;
};
