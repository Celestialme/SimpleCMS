import Text from './Text.svelte';
import type { Params } from './types';
let widget = ({ label, db_fieldName }: Params) => {
	let field = {
		widget: Text,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName
	};

	return field;
};

export default widget;
