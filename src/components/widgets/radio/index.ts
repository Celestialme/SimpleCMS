import type { Radio_Field, Radio_Params } from './types';

let widget = ({
	// accept parameters from collection
	title,
	icon,
	color,
	width,
	required,
	display
}: Radio_Params) => {
	if (!display) display = (data: any, field: any, entry: any) => data;

	let field = { schema: {}, title, icon, color, width, required, display } as Radio_Field;

	field.schema[title] = 'string';

	field.widget = async () => {
		// @ts-ignore
		return (await import('./Radio.svelte')).default;
	};
	return field;
};

export default widget;
