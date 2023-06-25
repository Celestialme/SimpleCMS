import { findById } from '@src/utils/utils';
import Relation from './Relation.svelte';
import type { Params } from './types';
let widget = ({ label, db_fieldName, display, relation }: Params) => {
	if (!display) {
		display = async (data, field, entry, contentLanguage) => {
			if (typeof data == 'string') {
				data = await findById(data, relation);
			}
			return data?.text[contentLanguage];
		};
	}

	let widget: { widget: any } = { widget: Relation };

	let field = {
		display,
		schema: { [db_fieldName || label]: String },
		label,
		db_fieldName,
		relation
	};

	return { ...field, ...widget };
};

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
