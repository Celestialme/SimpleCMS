import { getFieldName, getGuiFields } from '@src/utils/utils';
import Relation from './Relation.svelte';
import { type Params, GuiSchema, GraphqlSchema } from './types';
import { getCollections } from '@src/collections';
import widgets from '@src/components/widgets';
import deepmerge from 'deepmerge';
const widget = (params: Params) => {
	let display;
	display = async ({ data, collection, field, entry, contentLanguage }) => {
		let relative_collection = (await getCollections()).find((c) => c.name == field.relation);
		let relative_field = relative_collection?.fields.find((f) => getFieldName(f) == field.displayPath);
		return data?.[getFieldName(relative_field)]
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
	transformations: async (info) => {
		let field = info.field as ReturnType<typeof widget>;
		return [
			{
				$addFields: {
					convertedId: { $toObjectId: '$relation' }
				}
			},
			{ $project: { relation: 0 } },
			{ $lookup: { from: field.relation.toLocaleLowerCase(), localField: 'convertedId', foreignField: '_id', as: 'relative_document' } },
			{ $addFields: { relation: { $first: '$relative_document' } } },
			{ $project: { relative_document: 0, convertedId: 0 } }
		];
	},
	filters: async (info) => {
		let field = info.field as ReturnType<typeof widget>;
		let relative_collection = (await getCollections()).find((c) => c.name == field.relation);
		let relative_field = relative_collection?.fields.find((f) => getFieldName(f) == field.displayPath);
		let widget = widgets[relative_field.widget.key];
		let new_field = deepmerge(relative_field, { db_fieldName: 'relation.' + getFieldName(relative_field) }); //use db_fieldName since it overrides label.
		return widget?.aggregations?.filters({ field: new_field, filter: info.filter, contentLanguage: info.contentLanguage }) ?? [];
	},
	sorts: async (info) => {
		let field = info.field as ReturnType<typeof widget>;
		let relative_collection = (await getCollections()).find((c) => c.name == field.relation);
		let relative_field = relative_collection?.fields.find((f) => getFieldName(f) == field.displayPath);
		let widget = widgets[relative_field.widget.key];
		let new_field = deepmerge(relative_field, { db_fieldName: 'relation.' + getFieldName(relative_field) }); //use db_fieldName since it overrides label.
		return widget?.aggregations?.sorts({ field: new_field, sort: info.sort, contentLanguage: info.contentLanguage }) ?? [];
	}
} as Aggregations;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
