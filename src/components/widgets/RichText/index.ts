import publicConfig from '@root/config/public';
import { getFieldName, getGuiFields, saveImage } from '@src/utils/utils';
import RichText from './RichText.svelte';
import { GuiSchema, GraphqlSchema, type Params } from './types';
import type { ModifyRequestParams } from '..';
import mongoose from 'mongoose';
const widget = (params: Params) => {
	/** This is a description of the foo function. */
	let display;
	if (!params.display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return params.translated ? data.header[contentLanguage] || 'NO entry' : data.header[publicConfig.DEFAULT_CONTENT_LANGUAGE] || 'NO entry';
		};
		display.default = true;
	} else {
		display = params.display;
	}
	let widget: { type: typeof RichText; key: 'RichText'; GuiFields: ReturnType<typeof getGuiFields> } = {
		type: RichText,
		key: 'RichText',
		GuiFields: getGuiFields(params, GuiSchema)
	};
	let field = {
		display,
		label: params.label,
		db_fieldName: params.db_fieldName,
		translated: params.translated,
		width: params.width
	};
	return { ...field, widget };
};
widget.modifyRequest = async ({ field, data, user, type, collection, id }: ModifyRequestParams<typeof widget>) => {
	switch (type) {
		case 'POST':
		case 'PATCH':
			let images = data.get().images;
			let _data = data.get().data;

			for (let img_id in images) {
				let { fileInfo, id: _id } = await saveImage(images[img_id], collection.name);
				for (let lang in _data.content) {
					_data.content[lang] = _data.content[lang].replace(img_id, fileInfo.original.url);
				}
				type === 'PATCH' && (await mongoose.models['image_files'].updateMany({}, { $pull: { used_by: img_id } }));
				await mongoose.models['image_files'].updateOne({ _id }, { $addToSet: { used_by: id } });
			}
			data.update(_data);
			break;
		case 'DELETE':
			console.log(id);
			await mongoose.models['image_files'].updateMany({ used_by: id }, { $pull: { used_by: id } });
			break;
	}
};
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
widget.aggregations = {
	filters: async (info) => {
		let field = info.field as ReturnType<typeof widget>;
		return [{ $match: { [`${getFieldName(field)}.header.${info.contentLanguage}`]: { $regex: info.filter, $options: 'i' } } }];
	},
	sorts: async (info) => {
		let field = info.field as ReturnType<typeof widget>;
		let fieldName = getFieldName(field);
		return [{ $sort: { [`${fieldName}.header.${info.contentLanguage}`]: info.sort } }];
	}
} as Aggregations;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
