import { findById } from '@src/utils/utils';
import Relation from './Relation.svelte';
import type { Params } from './types';
let widget = ({ label, db_fieldName, display, relation }: Params) => {
	if (!display) {
		display = async (data) => {
			if (typeof data == 'string') {
				data = await findById(data, relation);
			}
			return data?.text?.en;
		};
	}

	let field = {
		widget: Relation,
		display,
		schema: { [db_fieldName || label]: String },
		label,
		db_fieldName,
		relation
	};
	return field;
};
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
