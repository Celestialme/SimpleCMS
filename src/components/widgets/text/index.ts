import Text from './Text.svelte';
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
	count,
	minlength,
	maxlength,
	prefix,
	suffix,
	required,
	readonly,
	disabled,
	localization,
	width
}: Params) => {
	if (!display) {
		display = async (data, field, entry, contentLanguage) => {
			return translated ? data[contentLanguage] || 'NO entry' : data[PUBLIC_CONTENT_LANGUAGE] || 'NO entry';
		};
	}

	let field = {
		widget: Text,
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		translated,
		// extras
		icon,
		placeholder,
		count,
		minlength,
		maxlength,
		prefix,
		suffix,
		required,
		readonly,
		disabled,
		localization,
		width
	};
	return field;
};

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
