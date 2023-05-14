import Text from './Text.svelte';
import type { Params } from './types';
let widget = ({
	label,
	db_fieldName,
	icon,
	placeholder,
	count,
	minlength,
	maxlength,
	prefix,
	suffix,
	required,
	readonly,
	disabled,
	localization,
	width,
	display
}: Params) => {
	if (!display) {
		display = async (data) => data;
	}

	let field = {
		widget: Text,
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		// extras
		icon,
		placeholder,
		count,
		minlength,
		maxlength,
		prefix,
		suffix,
		required,
		readonly,
		disabled,
		localization,
		width
	};
	return field;
};
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
