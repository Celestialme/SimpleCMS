import Text from './Text.svelte';
import type { Params } from './types';
import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';

let widget = ({
	label,
	db_fieldName,
	display,
	translated = false, // default no translation
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
	width
}: Params) => {
	if (!display) {
		display = async (data, field, entry, contentLanguage) => {
			const defaultContentLanguage = Object.keys(PUBLIC_CONTENT_LANGUAGES)[0];
			return translated ? data[contentLanguage] || 'NO entry' : data[defaultContentLanguage] || 'NO entry';
		};
	}

	let widget: { widget: any } = { widget: Text };

	let field = {
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
		width
	};

	return { ...field, ...widget };
};

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
