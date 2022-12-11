// DateRange Widget
import type { Display } from "../types";

export default ({
	// Defines type of collections
	title,
	icon,
	format,
	required,
	display,
}: {
	// Defines type of collections
	title: string;
	icon?: string;
	format?: string;
	required?: boolean;
	display?: Display;
}) => {
	if (!display) display = (data: any, field: any, entry: any) => data;

	let field: any = { schema: {}, title, icon, format, required, display };

	field.schema[title] = "string";

	field.widget = async () => {
		// @ts-ignore
		return (await import("./DateRange.svelte")).default;
	};
	return field;
};
