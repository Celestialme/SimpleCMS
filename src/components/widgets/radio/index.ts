import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';
import Radio from './Radio.svelte';
import type { Params } from './types';

let widget = ({
	label,
	db_fieldName,
	display,
	translated = false, // default no translation
	// extras
	icon,
	color,
	required,
	readonly,
	width
}: Params) => {
	if (!display) {
		display = async (data: any, field: any, entry: any, contentLanguage: any) => {
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return translated ? data[contentLanguage] || 'NO entry' : data[PUBLIC_CONTENT_LANGUAGES] || 'NO entry';
		};
	}

	let widget: { widget: any } = { widget: Radio };

	let field = {
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		translated,
		// extras
		icon,
		color,
		required,
		readonly,
		width
	};

	return { ...field, ...widget };
};

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
