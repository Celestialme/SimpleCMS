import Currency from './Currency.svelte';
import type { Params } from './types';
import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';

const widget = ({
	label,
	db_fieldName,
	display,
	translated = false, // TODO: no translated need for this widget
	// extras
	currencyCode,
	icon,
	placeholder,
	prefix,
	suffix,
	min,
	max,
	step,
	negative,
	required
}: Params) => {
	if (!display) {
		display = async (data: any, field: any, entry: any, contentLanguage: any) => {
			console.log(data);
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return translated ? data[contentLanguage] || 'NO entry' : data[PUBLIC_CONTENT_LANGUAGES] || 'NO entry';
		};
	}

	let widget: { widget: any } = { widget: Currency };

	let field = {
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		// extras
		currencyCode,
		icon,
		placeholder,
		prefix,
		suffix,
		min,
		max,
		step,
		negative,
		required
	};

	return { ...field, ...widget };
};

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
