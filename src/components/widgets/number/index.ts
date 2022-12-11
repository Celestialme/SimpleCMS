import type { Display } from "../types";

export default ({
	// Accept parameters from collection
	title,
	icon,
	placeholder,
	required,
	display,
}: {
	// Defines type of collections
	title: string;
	icon?: string;
	placeholder?: string;
	required?: boolean;
	display?: Display;
}) => {
	if (!display) display = (data: any, field: any, entry: any) => data;

	let field: any = { schema: {}, title, icon, placeholder, required, display };

	field.schema[title] = "string";

	field.widget = async () => {
		// @ts-ignore
		return (await import("./Number.svelte")).default;
	};
	return field;
};
