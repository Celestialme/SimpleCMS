import Currency from './Currency.svelte';

import { type Params, GuiSchema } from './types';
import { defaultContentLanguage } from '@src/stores/store';

// typesafe-i18n
import { get } from 'svelte/store';
import LL from '@src/i18n/i18n-svelte.js';

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
		display = async (data, field, entry, contentLanguage) => {
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return data[defaultContentLanguage] || get(LL).ENTRYLIST_Untranslated();
		};
		display.default = true;
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