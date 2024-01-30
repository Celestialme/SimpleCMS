import { getFieldName, getGuiFields } from '@src/utils/utils';
import Relation from './Relation.svelte';
import { type Params, GuiSchema, GraphqlSchema } from './types';
import { getCollections } from '@src/collections';
const widget = (params: Params) => {
	let display;
	display = async ({ data, collection, field, entry, contentLanguage }) => {
		let relative_collection = (await getCollections()).find((c) => c.name == field.relation);
		let relative_field = relative_collection?.fields.find((f) => getFieldName(f) == field.displayPath);
		return data[getFieldName(relative_field)]
			? await relative_field?.display({
					data: data[getFieldName(relative_field)],
					collection,
					field: relative_field,
					entry,
					contentLanguage
			  })
			: '';
	};
	display.default = true;

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
		width: params.width,
		displayPath: params.displayPath
	};

	return { ...field, widget };
};
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
widget.aggregations = {
	transformations: (info) => {
		let field = info.field as ReturnType<typeof widget>;
		return [
			{ $project: { relation: { $toObjectId: '$relation' } } },
			{ $lookup: { from: field.relation.toLocaleLowerCase(), localField: 'relation', foreignField: '_id', as: 'relative_document' } },
			{ $unwind: '$relative_document' },
			{ $project: { relation: '$relative_document' } },
			{ $project: { relative_document: 0 } }
		];
	}
} as Aggregations;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
