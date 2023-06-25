import Email from './Email.svelte';
import type { Params } from './types';
import { PUBLIC_CONTENT_LANGUAGE } from '$env/static/public';

let widget = ({
	label,
	db_fieldName,
	display,
	translated = false,
	// extras
	icon,
	placeholder,
	required,
	localization
}: Params) => {
	if (!display) {
		display = async (data, field, entry, contentLanguage) => {
			return translated ? data[contentLanguage] || 'NO entry' : data[PUBLIC_CONTENT_LANGUAGE] || 'NO entry';
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
		required,
		localization
	};

	return { ...field, ...widget };
};

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
