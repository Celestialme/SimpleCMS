import type { Display } from '../types';
import type { Seo_Field, Seo_Params } from './types';

let widget = ({
	// accept parameters from collection
	title,
	icon,
	color,
	required,
	display
}: Seo_Params) => {
	if (!display) display = (data: any, field: any, entry: any) => data;

	let field = { schema: {}, title, icon, color, required, display } as Seo_Field;

	field.schema[title] = 'string';

	field.widget = async () => {
		// @ts-ignore
		return (await import('./Seo.svelte')).default;
	};
	return field;
};

export default widget;
