import Currency from './Currency.svelte';
import type { Params } from './types';
import { GuiSchema } from './guiSchema';

import { defaultContentLanguage } from '@src/stores/store';

const widget = ({
	label,
	db_fieldName,
	display,
	icon,
	// extras
	currencyCode,
	placeholder,
	count,
	minlength,
	maxlength,
	step,
	negative,
	prefix,
	suffix,
	readonly,
	required,
	width
}: Params) => {
	if (!display) {
		// display for table
		display = async (data: any, field: any, entry: any, contentLanguage: any) => {
			//console.log(data);
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return data[defaultContentLanguage] || 'NO entry';
		};
	}

	const widget: { type: any; key: 'Currency' } = { type: Currency, key: 'Currency' };

	const field = {
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		icon,
		// extras
		currencyCode,
		placeholder,
		count,
		minlength,
		maxlength,
		step,
		negative,
		prefix,
		suffix,
		readonly,
		required,
		width
	};

	return { ...field, widget };
};

widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
