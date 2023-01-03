import env from '@root/env';
import type { Text_Field, Text_Params } from './types';
let widget = ({
	title,
	icon,
	placeholder,
	count,
	prefix,
	suffix,
	required,
	localization,
	width,
	display
}: Text_Params) => {
	if (!display)
		display = async (data: any, field: any, entry: any) => {
			return data || 'No Value';
		};
	let field = {
		schema: {},
		title,
		icon,
		placeholder,
		count,
		prefix,
		suffix,
		required,
		localization,
		width,
		display
	} as Text_Field;
	field.schema[title] = { String: String };
	field.widget = async () => {
		// @ts-ignore
		return (await import('./Text.svelte')).default;
	};
	return field;
};

export default widget;
