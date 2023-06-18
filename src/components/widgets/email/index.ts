import Email from './Email.svelte';
import type { Params } from './types';

const widget = ({
	label,
	db_fieldName,
	// extras
	icon,
	placeholder,
	required,
	localization,
	display
}: Params) => {
	if (!display) {
		display = async (data) => data;
	}

	const field = {
		widget: Email,
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		// extras
		icon,
		placeholder,
		required,
		localization
	};
	return field;
};
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;