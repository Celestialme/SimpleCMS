import type { Display } from '../types';
import type { SelectList_Field, SelectList_Params } from './type';

let widget = ({
	// Accept parameters from collection
	title,
	icon,
	placeholder,
	required,
	localization,
	options,
	display
}: SelectList_Params) => {
	if (!display) display = (data: any, field: any, entry: any) => data;

	let field = {
		schema: {},
		title,
		icon,
		placeholder,
		required,
		localization,
		options,
		display
	} as SelectList_Field;

	field.schema[title] = 'string';

	field.widget = async () => {
		// @ts-ignore
		return (await import('./SelectList.svelte')).default;
	};
	return field;
};

export default widget;
