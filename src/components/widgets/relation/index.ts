import { findById } from '@src/utils/utils';
import Relation from './Relation.svelte';
import type { Params } from './types';
import { GuiSchema } from '../text/types';
const widget = ({ label, db_fieldName, display, relation }: Params) => {
	if (!display) {
		display = async (data, field, entry, contentLanguage) => {
			if (typeof data == 'string') {
				data = await findById(data, relation);
			}
			return data?.text[contentLanguage];
		};
	}
	let widget: { type: any; key: 'Relation' } = { type: Relation, key: 'Relation' };

	let field = {
		display,
		schema: { [db_fieldName || label]: String },
		label,
		db_fieldName,
		relation
	};

	return { ...field, widget };
};
widget.GuiSchema = GuiSchema;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
