import Text from './Text.svelte';
import type { Params } from './types';
let widget = ({ label, db_fieldName, display }: Params) => {
	if (!display) {
		display = async (data) => data;
	}

	let field = {
		widget: Text,
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName
	};
	return field;
};
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
