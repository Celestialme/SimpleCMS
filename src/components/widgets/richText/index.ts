import richText from './richText.svelte';
import type { Params } from './types';
import { GuiSchema } from './guiSchema';

import { defaultContentLanguage } from '@src/stores/store';

const widget = ({
	label,
	db_fieldName,
	display,
	translated = false, // default no translation
	// extras
	placeholder,
	required
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
	const widget: { type: any; key: 'richText' } = { type: richText, key: 'richText' };

	const field = {
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		icon,
		// extras
		placeholder,
		required
	};

	return { ...field, widget };
};

widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
