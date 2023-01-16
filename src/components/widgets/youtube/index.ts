import type { Display } from '../types';
import type { Youtube_Params, Youtube_Field } from './types';

export default ({
	// Accept parameters from collection
	db_fieldName,
	icon,
	placeholder,
	required,
	display
}: Youtube_Params) => {
	if (!display) display = (data: any, field: any, entry: any) => data;

	let field = {
		schema: {},
		db_fieldName,
		icon,
		placeholder,
		required,
		display
	} as Youtube_Field;

	field.schema[db_fieldName] = 'string';

	field.widget = async () => {
		// @ts-ignore
		return (await import('./Youtube.svelte')).default;
	};
	return field;
};
