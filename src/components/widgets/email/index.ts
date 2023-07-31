import Email from './Email.svelte';

import { type Params, GuiSchema } from './types';
import { defaultContentLanguage } from '@src/stores/store';

const widget = ({
	// Accept parameters from collection
	label,
	db_fieldName,
	display,
	// extras
	icon,
	placeholder,
	required
}: Params) => {
	if (!display) {
		display = async (data, field, entry, contentLanguage) => {
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return data[defaultContentLanguage] || 'NO entry';
		};
		display.default = true;
	}
	const widget: { type: any; key: 'Email' } = { type: Email, key: 'Email' };

	const field = {
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		// extras
		icon,
		placeholder,
		required
	};

	return { ...field, widget };
};

widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
