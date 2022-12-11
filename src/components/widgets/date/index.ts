// Date Widget
import type { Display } from "../types";

export default ({
	// Defines type of collections
	title,
	icon,
	required,
	display,
}: {
	// Defines type of collections
	title: string;
	icon?: string;
	required?: boolean;
	localization?: boolean;
	display?: Display;
}) => {
	if (!display) display = (data: any, field: any, entry: any) => data;

	let field: any = { schema: {}, title, icon, required, display };
	field.schema[title] = "string";

	field.widget = async () => {
		// @ts-ignore
		return (await import("./Date.svelte")).default;
	};
	return field;
};
