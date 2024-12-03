import publicConfig from '@root/config/public';
import { saveImage } from '@src/utils/files';
import { GuiSchema, toString, type Params } from './types';
// import type { ModifyRequestParams } from '..';
import mongoose from 'mongoose';
import { getFieldName } from '@src/utils/fields';
import type { ModifyRequestParams } from '..';
import { cleanRemovedImages } from '@src/utils/utils';
// import type { ModifyRequestParams } from '..';
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
	let widgetName = WIDGET_NAME;
	let field = {
		display,
		label: params.label,
		db_fieldName: params.db_fieldName,
		translated: params.translated,
		width: params.width,
		image_folder: params.image_folder
	};
	return { ...field, widgetName, params };
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

			for (let id of (Object.values(_data.content).join('\n') as string).matchAll(
				/storage_image="(.+?)"/gms
			)) {
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
				cleanRemovedImages(meta_data, _id);

				await mongoose.models['_storage_images'].updateOne({ _id }, { $addToSet: { used_by: id } });
			}
			data.update(_data);
			break;
		case 'DELETE':
			await mongoose.models['_storage_images'].updateMany({}, { $pull: { used_by: id } });

			break;
	}
};
widget.Name = WIDGET_NAME;
widget.GuiSchema = GuiSchema;
widget.toString = toString;
widget.modifiers = (async (info) => {
	let field = info.field as ReturnType<typeof widget>;
	let fieldName = getFieldName(field);

	let modifiers: ReturnType<modifiers> = {
		lookup: {
			from: '_storage_images',
			localField: fieldName,
			foreignField: '_id',
			as: fieldName
		}
	};
	if (info.filter)
		modifiers.match = {
			[`${fieldName}->header->${info.contentLanguage}`]: {
				strict: false,
				value: info.filter
			}
		};
	if (info.sort) modifiers.sort = { [`${fieldName}->header->${info.contentLanguage}`]: info.sort };

	return modifiers;
}) as modifiers;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
