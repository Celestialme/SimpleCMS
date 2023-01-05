import type { Seo_Field, Seo_Params } from './types';

let widget = ({
	// accept parameters from collection
	title,
	icon,
	required,
	localization,
	display
}: Seo_Params) => {
	if (!display)
		display = async (data: any, field: any, entry: any) => {
			return data || 'No Value';
		};
	let field = {
		schema: {},
		title,
		icon,
		required,
		localization,
		display
	} as Seo_Field;

	field.schema[title] = { String: String };

	field.widget = async () => {
		// @ts-ignore
		return (await import('./Seo.svelte')).default;
	};
	return field;
};

export default widget;
