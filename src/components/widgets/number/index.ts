import Number from './Number.svelte';
import type { Params } from './types';
import { GuiSchema } from './types';

import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';

const widget = ({
	label,
	db_fieldName,
	display,
	translated = false, // TODO: no translated need for this widget
	icon,
	// extras
	currencyCode,
	placeholder,
	prefix,
	suffix,
	minlength,
	maxlength,
	step,
	negative,
	readonly,
	required
}: Params) => {
	if (!display) {
		// display for table
		display = async (data, field, entry, contentLanguage) => {
			//console.log(data);
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return translated ? data[contentLanguage] || 'NO entry' : data[PUBLIC_CONTENT_LANGUAGES] || 'NO entry';
		};
	}

	let widget: { type: any; key: 'Number' } = { type: Number, key: 'Number' };

	let field = {
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		icon,
		// extras
		currencyCode,
		placeholder,
		prefix,
		suffix,
		minlength,
		maxlength,
		step,
		negative,
		readonly,
		required
	};

	return { ...field, widget };
};

widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
