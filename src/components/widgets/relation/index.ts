import { getFieldName, getGuiFields } from '@src/utils/utils';
import Relation from './Relation.svelte';
import { type Params, GuiSchema, GraphqlSchema } from './types';
import { getCollections } from '@src/collections';
import widgets, { type ModifyRequestParams } from '@src/components/widgets';
import deepmerge from 'deepmerge';
import type { Schema } from '@src/collections/types';

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
		displayPath: params.displayPath,
		permissions: params.permissions
	};

	return { ...field, widget };
};

widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
widget.modifyRequest = async ({ field, data, user, type }: ModifyRequestParams<typeof widget>) => {
	if (type !== 'GET') {
		return data;
	}
	let { getCollectionModels } = await import('@src/routes/api/db');
	let relative_collection = (await getCollectionModels())[field.relation];
	let relative_collection_schema = (await getCollections()).find((c) => c.name == field.relation) as Schema;
	let response = (await relative_collection.findById(data)) as any;
	let result = {};
	for (let key in relative_collection_schema.fields) {
		let _field = relative_collection_schema.fields[key];
		let widget = widgets[_field.widget.key];

		result[getFieldName(_field)] = await widget.modifyRequest({
			collection: relative_collection,
			field: _field as ReturnType<typeof widget>,
			data: response[getFieldName(_field)],
			user,
			type
		});
	}

	return result;
};
widget.aggregations = {
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
