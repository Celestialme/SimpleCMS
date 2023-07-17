import Date from './Date.svelte';
import type { Params } from './types';
import { GuiSchema } from './guiSchema';

import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';

const widget = ({
	label,
	db_fieldName,
	display,
	translated = false, // default no translation
	icon,
	// extras
	required
}: Params) => {
	if (!display) {
		// display for table
		display = async (data: any, field: any, entry: any, contentLanguage: any) => {
			// console.log(data);
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return translated
				? data[contentLanguage] || 'NO entry'
				: data[PUBLIC_CONTENT_LANGUAGES] || 'NO entry';
		};
	}

	const widget: { type: any; key: 'Date' } = { type: Date, key: 'Date' };

	const field = {
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		translated,
		icon,
		// extras
		required
	};

	return { ...field, widget };
};

widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
