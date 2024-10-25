import { getFieldName, getGuiFields } from '@src/utils/utils';
import { type Params, GuiSchema } from './types';
import { getCollections } from '@src/collections';
import widgets, { type ModifyRequestParams } from '@src/components/widgets';
import deepmerge from 'deepmerge';
import type { CollectionTypes, Schema } from '@src/collections/types';
const WIDGET_NAME = 'Relation' as const;
const widget = <
	K extends CollectionTypes[T][number],
	T extends keyof CollectionTypes & keyof CollectionTypes
>(
	params: Params<K, T>
) => {
	let display;
	display = async ({ data, collection, field, entry, contentLanguage }) => {
		let relative_collection = (await getCollections())[field.relation];

		let relative_field = relative_collection?.fields.find(
			(f) => getFieldName(f) == field.displayPath
		);

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

	let widget = {
		Name: WIDGET_NAME,
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
widget.Name = WIDGET_NAME;
widget.GuiSchema = GuiSchema;
widget.modifyRequest = async ({
	field,
	data,
	user,
	type,
	id
}: ModifyRequestParams<typeof widget>) => {
	let _data = data.get();

	if (type !== 'GET' || !_data) {
		return;
	}
	let { getCollectionModels } = await import('@src/routes/api/db');
	let relative_collection_schema = (await getCollections())[field.relation] as Schema;
	let relative_collection = (await getCollectionModels())[relative_collection_schema.id];
	let response = (await relative_collection.findById(_data)) as any;
	let result = { _id: response?._id };
	for (let key in relative_collection_schema.fields) {
		let _field = relative_collection_schema.fields[key];
		let widget = widgets[_field.widget.Name];
		result[getFieldName(_field)] = response?.[getFieldName(_field)];
		let data = {
			get() {
				return response?.[getFieldName(_field)];
			},
			update(newData) {
				result[getFieldName(_field)] = newData;
			}
		};
		if ('modifyRequest' in widget) {
			await widget.modifyRequest({
				collection: relative_collection,
				field: _field as ReturnType<typeof widget>,
				data,
				user,
				type,
				id
			});
		}
	}
	data.update(result);
};
widget.aggregations = {
	filters: async (info) => {
		let field = info.field as ReturnType<typeof widget>;
		let relative_collection = (await getCollections())[field.relation];
		let relative_field = relative_collection?.fields.find(
			(f) => getFieldName(f) == field.displayPath
		);
		let widget = widgets[relative_field.widget.Name];
		let new_field = deepmerge(relative_field, {
			db_fieldName: 'relation.' + getFieldName(relative_field)
		}); //use db_fieldName since it overrides label.
		return (
			widget?.aggregations?.filters({
				field: new_field,
				filter: info.filter,
				contentLanguage: info.contentLanguage
			}) ?? []
		);
	},
	sorts: async (info) => {
		let field = info.field as ReturnType<typeof widget>;
		let relative_collection = (await getCollections())[field.relation];
		let relative_field = relative_collection?.fields.find(
			(f) => getFieldName(f) == field.displayPath
		);
		let widget = widgets[relative_field.widget.Name];
		let new_field = deepmerge(relative_field, {
			db_fieldName: 'relation.' + getFieldName(relative_field)
		}); //use db_fieldName since it overrides label.
		return (
			widget?.aggregations?.sorts({
				field: new_field,
				sort: info.sort,
				contentLanguage: info.contentLanguage
			}) ?? []
		);
	}
} as Aggregations;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
