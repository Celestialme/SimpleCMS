import { getGuiFields } from '@src/utils/utils';
import Relation from './Relation.svelte';
import { type Params, GuiSchema, GraphqlSchema } from './types';
import { PUBLIC_CONTENT_LANGUAGE } from '$env/static/public';
const widget = (params: Params) => {
	let display;
	if (!params.display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			return Object.values(data)?.[contentLanguage] || Object.values(data)?.[PUBLIC_CONTENT_LANGUAGE] || Object.values(data);
		};
		display.default = true;
	} else {
		display = params.display;
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
		relation: params.relation,
		width: params.width
	};

	return { ...field, widget };
};
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
widget.aggregations = (field: ReturnType<typeof widget>) => [
	{ $project: { relation: { $toObjectId: '$relation' } } },
	{ $lookup: { from: field.relation.toLocaleLowerCase(), localField: 'relation', foreignField: '_id', as: 'relative_document' } },
	{ $unwind: '$relative_document' },
	{ $project: { relation: '$relative_document' } },
	{ $project: { relative_document: 0 } }
];
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
