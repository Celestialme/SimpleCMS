import Text from './Text.svelte';
import type { Params } from './types';
import { GuiSchema } from './guiSchema';

import { defaultContentLanguage } from '@src/stores/store';

const widget = ({
	label,
	db_fieldName,
	display,
	translated = false, // default no translation
	icon,
	// extras
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
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return translated
				? data[contentLanguage] || 'NO entry'
				: data[defaultContentLanguage] || 'NO entry';
		};
		display.default = true;
	}

	const widget: { type: any; key: 'Text' } = { type: Text, key: 'Text' };

	const field = {
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		translated,
		icon,
		// extras
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

	return { ...field, widget };
};

widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
