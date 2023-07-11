import Email from './Email.svelte';
import type { Params } from './types';
import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';

let widget = ({
	label,
	db_fieldName,
	display,
	translated = false,
	// extras
	icon,
	placeholder,
	required
}: Params) => {
	if (!display) {
		display = async (data: any, field: any, entry: any, contentLanguage: any) => {
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return translated ? data[contentLanguage] || 'NO entry' : data[PUBLIC_CONTENT_LANGUAGES] || 'NO entry';
		};
	}

	let widget: { widget: any } = { widget: Email };

	let field = {
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		translated,
		// extras
		icon,
		placeholder,
		required
	};

	return { ...field, ...widget };
};

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
