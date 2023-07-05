import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';
import Seo from './Seo.svelte';
import type { Params } from './types';

let widget = ({
	label,
	db_fieldName,
	display,
	translated = false, // default no translation
	// extras
	icon,
	required,
	width
}: Params) => {
	if (!display) {
		display = async (data: any, field: any, entry: any, contentLanguage: any) => {
			console.log(data);
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return translated ? data[contentLanguage] || 'NO entry' : data[PUBLIC_CONTENT_LANGUAGES] || 'NO entry';
		};
	}

	let widget: { widget: any } = { widget: Seo };

	let field = {
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		translated,
		// extras
		icon,
		required,
		width
	};

	return { ...field, ...widget };
};

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
