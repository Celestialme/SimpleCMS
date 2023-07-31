import Relation from './Relation.svelte';
import { findById } from '@src/utils/utils';

import type { Params } from './types';

const widget = ({ label, db_fieldName, display, relation }: Params) => {
	if (!display) {
		display = async (data, field, entry, contentLanguage) => {
			if (typeof data == 'string') {
				data = await findById(data, relation);
			}
			return data?.text[contentLanguage];
		};
		display.default = true;
	}

	const widget: { type: any; key: 'Relation' } = { type: Relation, key: 'Relation' };

	const field = {
		display,
		schema: { [db_fieldName || label]: String },
		label,
		db_fieldName,
		relation
	};

	return { ...field, widget };
};

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
