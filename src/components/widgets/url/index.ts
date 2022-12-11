import type { Display } from "../types";

export default ({
	// Accept parameters from collection
	title,
	icon,
	placeholder,
	required,
	localization,
	display,
}: {
	// Defines type of collections
	title: string;
	icon?: string;
	placeholder?: string;
	required?: boolean;
	localization?: boolean;
	display?: Display;
}) => {
	if (!display) display = (data: any, field: any, entry: any) => data;

	let field: any = { schema: {}, title, icon, placeholder, required, localization, display };

	field.schema[title] = "string";

	field.widget = async () => {
		// @ts-ignore
		return (await import("./Url.svelte")).default;
	};
	return field;
};
