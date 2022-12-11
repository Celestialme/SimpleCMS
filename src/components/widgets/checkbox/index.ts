import type { Display } from "../types";

export default ({
	// accept parameters from collection
	title,
	icon,
	color,
	required,
	display,
}: {
	// Defines type of collections
	title: string;
	icon?: string;
	color?: string;
	required?: boolean;
	display?: Display;
}) => {
	if (!display) display = (data: any, field: any, entry: any) => data;

	let field: any = { schema: {}, title, icon, color, required, display };

	field.schema[title] = "string";

	field.widget = async () => {
		// @ts-ignore
		return (await import("./Checkbox.svelte")).default;
	};
	return field;
};
