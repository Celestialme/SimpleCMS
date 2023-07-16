import Checkbox from './Checkbox.svelte';
import type { Params } from './types';
import { GuiSchema } from './guiSchema';

import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';

const widget = ({
	// Accept parameters from collection
	label,
	db_fieldName,
	display,
	translated = false,
	// extras
	icon,
	color,
	width,
	required
}: Params) => {
	if (!display) {
		display = async (data, field, entry, contentLanguage) => {
			//console.log(data);
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return translated ? data[contentLanguage] || 'NO entry' : data[PUBLIC_CONTENT_LANGUAGES] || 'NO entry';
		};
	}

	let widget: { type: any; key: 'Checkbox' } = { type: Checkbox, key: 'Checkbox' };

	let field = {
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		translated,
		// extras
		icon,
		color,
		width,
		required
	};

	return { ...field, widget };
};

widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
