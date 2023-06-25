import { PUBLIC_CONTENT_LANGUAGE } from '$env/static/public';
import Text from './Text.svelte';
import type { Params } from './types';
let widget = ({ label, db_fieldName, display, translated = false }: Params) => {
	if (!display) {
		display = async (data, field, entry, contentLanguage) => {
			return translated ? data[contentLanguage] || 'NO entry' : data[PUBLIC_CONTENT_LANGUAGE] || 'NO entry';
		};
	}
	let widget: { widget: any } = { widget: Text };
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
