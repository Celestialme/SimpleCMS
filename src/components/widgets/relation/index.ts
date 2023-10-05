import { findById } from '@src/utils/utils';
import Relation from './Relation.svelte';
import { type Params, GuiSchema, GraphqlSchema } from './types';
import { PUBLIC_CONTENT_LANGUAGE } from '$env/static/public';
const widget = ({ label, db_fieldName, display, relation }: Params) => {
	if (!display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			if (typeof data == 'string') {
				data = await findById(data, relation);
			}
			return Object.values(data)[1]?.[contentLanguage] || Object.values(data)[1]?.[PUBLIC_CONTENT_LANGUAGE] || Object.values(data)[1];
		};
		display.default = true;
	} else {
		let _display = display;
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			if (typeof data == 'string') {
				data = await findById(data, relation);
			}
			return _display?.({ data, collection, field, entry, contentLanguage });
		};
	}
	let widget: { type: any; key: 'Relation' } = { type: Relation, key: 'Relation' };

	let field = {
		display,
		label,
		db_fieldName,
		relation
	};

	return { ...field, widget };
};
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
