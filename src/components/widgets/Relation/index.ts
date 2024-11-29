import { type Params, GuiSchema } from './types';
import widgets, { type ModifyRequestParams } from '@src/components/widgets';
import deepmerge from 'deepmerge';
import type { CollectionTypes, Schema } from '@src/collections/types';
import { collections } from '@src/stores/store.svelte';
import { getFieldName } from '@src/utils/fields';
import mongoose from 'mongoose';
const WIDGET_NAME = 'Relation' as const;
const widget = <
	K extends CollectionTypes[T][number],
	T extends keyof CollectionTypes & keyof CollectionTypes
>(
	params: Params<K, T>
) => {
	let display;
	display = async ({ data, collection, field, entry, contentLanguage }) => {
		let relative_collection = collections()[field.relation];

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

	let widgetName = WIDGET_NAME;

	let field = {
		display,
		label: params.label,
		db_fieldName: params.db_fieldName,
		relation: params.relation,
		width: params.width,
		displayPath: params.displayPath
	};
	let dataType = 'ObjectId';
	return { ...field, widgetName, params, dataType };
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
	switch (type) {
		case 'POST':
		case 'PATCH':
			let _id = new mongoose.Types.ObjectId(_data);
			data.update(_id);
			break;
	}
};
widget.modifiers = (async (info) => {
	let field = info.field as ReturnType<typeof widget>;
	let fieldName = getFieldName(field);
	let relative_collection = collections()[field.relation];
	let relative_field = relative_collection?.fields.find(
		(f) => getFieldName(f) == field.displayPath
	);
	let widget = widgets[relative_field.widgetName];
	let new_field = deepmerge(relative_field, {
		db_fieldName: `${fieldName}.${getFieldName(relative_field)}`
	}); //use db_fieldName since it overrides label.

	return [
		{
			$lookup: {
				from: relative_collection.id,
				localField: fieldName,
				foreignField: '_id',
				as: fieldName
			}
		},
		{
			$unwind: `$${fieldName}`
		},
		...(await widget?.modifiers({
			field: new_field,
			filter: info.filter,
			sort: info.sort,
			contentLanguage: info.contentLanguage
		}))
	];
}) as modifiers;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
