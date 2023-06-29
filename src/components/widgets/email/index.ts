import { PUBLIC_CONTENT_LANGUAGE } from '$env/static/public';
import Email from './Email.svelte';
import type { Params } from './types';
//email
let widget = ({ label, db_fieldName, display, translated = false }: Params) => {
	if (!display) {
		display = async (data, field, entry, contentLanguage) => {
			console.log(data);
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return translated ? data[contentLanguage] || 'NO entry' : data[PUBLIC_CONTENT_LANGUAGE] || 'NO entry';
		};
	}
	let widget: { widget: any } = { widget: Email };
	let field = {
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		translated
	};
	return { ...field, ...widget };
};
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
