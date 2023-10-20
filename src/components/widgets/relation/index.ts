import { findById, getGuiFields } from '@src/utils/utils';
import Relation from './Relation.svelte';
import { type Params, GuiSchema, GraphqlSchema } from './types';
import { PUBLIC_CONTENT_LANGUAGE } from '$env/static/public';
const widget = (params: Params) => {
	let display;
	if (!params.display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			if (typeof data == 'string') {
				data = await findById(data, params.relation);
			}
			return Object.values(data)[1]?.[contentLanguage] || Object.values(data)[1]?.[PUBLIC_CONTENT_LANGUAGE] || Object.values(data)[1];
		};
		display.default = true;
	} else {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			if (typeof data == 'string') {
				data = await findById(data, params.relation);
			}
			return params.display?.({ data, collection, field, entry, contentLanguage });
		};
	}
	let widget: { type: any; key: 'Relation'; GuiFields: ReturnType<typeof getGuiFields> } = {
		type: Relation,
		key: 'Relation',
		GuiFields: getGuiFields(params, GuiSchema)
	};

	let field = {
		display,
		label: params.label,
		db_fieldName: params.db_fieldName,
		relation: params.relation
	};

	return { ...field, widget };
};
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
