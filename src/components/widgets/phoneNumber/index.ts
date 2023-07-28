import PhoneNumber from './PhoneNumber.svelte';
import type { Params } from './types';
import { GuiSchema } from './guiSchema';

import { defaultContentLanguage } from '@src/stores/store';

const widget = ({
	label,
	db_fieldName,
	display,
	icon,
	// extras
	placeholder,
	count,
	minlength,
	maxlength,
	pattern,
	size,
	required,
	readonly,
	width
}: Params) => {
	if (!display) {
		display = async (data, field, entry, contentLanguage) => {
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return data[defaultContentLanguage] || 'NO entry';
		};
		display.default = true;
	}

	const widget: { type: any; key: 'PhoneNumber' } = { type: PhoneNumber, key: 'PhoneNumber' };

	const field = {
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		icon,
		// extras
		placeholder,
		count,
		minlength,
		maxlength,
		pattern,
		size,
		required,
		readonly,
		width
	};

	return { ...field, widget };
};

widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
