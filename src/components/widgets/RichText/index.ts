import publicConfig from '@root/config/public';
import { getFieldName, getGuiFields } from '@src/utils/utils';
import { saveImage } from '@src/utils/files';
import { GuiSchema, GraphqlSchema, type Params } from './types';
import type { ModifyRequestParams } from '..';
import mongoose from 'mongoose';
const WIDGET_NAME = 'RichText' as const;
const widget = (params: Params) => {
	/** This is a description of the foo function. */
	let display;
	if (!params.display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return params.translated
				? data.header[contentLanguage] || 'NO entry'
				: data.header[publicConfig.DEFAULT_CONTENT_LANGUAGE] || 'NO entry';
		};
		display.default = true;
	} else {
		display = params.display;
	}
	let widget = {
		Name: WIDGET_NAME,
		GuiFields: getGuiFields(params, GuiSchema)
	};
	let field = {
		display,
		label: params.label,
		db_fieldName: params.db_fieldName,
		translated: params.translated,
		width: params.width,
		image_folder: params.image_folder
	};
	return { ...field, widget };
};
widget.modifyRequest = async ({
	field,
	data,
	user,
	type,
	collection,
	id,
	meta_data
}: ModifyRequestParams<typeof widget>) => {
	switch (type) {
		case 'POST':
		case 'PATCH':
			let images = data.get().images;
			let _data = data.get().data;
			let _id;

			for (let id of (_data.content['en'] as string).matchAll(/storage_image="(.+?)"/gms)) {
				// images from richtext content itself
				images[id[1]] = new mongoose.Types.ObjectId(id[1]);
			}

			for (let img_id in images) {
				if (images[img_id] instanceof File) {
					//locally selected new images
					let res = await saveImage(images[img_id], field.image_folder);
					let fileInfo = res.fileInfo;
					_id = res.id;
					for (let lang in _data.content) {
						_data.content[lang] = _data.content[lang].replace(
							`src="${img_id}"`,
							`src="${fileInfo.original.url}" storage_image="${_id}"`
						);
					}
				} else {
					// selected from Media images
					_id = new mongoose.Types.ObjectId(images[img_id]);
				}
				if (meta_data?.storage_images?.removed && _id) {
					let removed = meta_data?.storage_images?.removed as string[];
					let index = removed.indexOf(_id.toString());

					while (index != -1) {
						removed.splice(index, 1);
						index = removed.indexOf(_id.toString());
					}
				}

				await mongoose.models['_storage_images'].updateOne({ _id }, { $addToSet: { used_by: id } });
			}
			data.update(_data);
			break;
		case 'DELETE':
			console.log(id);
			await mongoose.models['_storage_images'].updateMany(
				{ used_by: id },
				{ $pull: { used_by: id } }
			);
			break;
	}
};
widget.Name = WIDGET_NAME;
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
widget.aggregations = {
	filters: async (info) => {
		let field = info.field as ReturnType<typeof widget>;
		return [
			{
				$match: {
					[`${getFieldName(field)}.header.${info.contentLanguage}`]: {
						$regex: info.filter,
						$options: 'i'
					}
				}
			}
		];
	},
	sorts: async (info) => {
		let field = info.field as ReturnType<typeof widget>;
		let fieldName = getFieldName(field);
		return [{ $sort: { [`${fieldName}.header.${info.contentLanguage}`]: info.sort } }];
	}
} as Aggregations;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
