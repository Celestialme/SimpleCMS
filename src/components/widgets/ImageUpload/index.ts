import { type Params, GuiSchema } from './types';
import { saveImage } from '@src/utils/files';
import { type ModifyRequestParams } from '..';
import mongoose from 'mongoose';
import type { ImageFile } from '@src/utils/files';
import { getFieldName } from '@src/utils/fields';
const WIDGET_NAME = 'ImageUpload' as const;
const widget = (params: Params) => {
	let display;
	if (!params.display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			let url = data?.thumbnail?.url;
			if (data instanceof FileList) {
				url = URL.createObjectURL(data[0]);
			} else if (data instanceof File) {
				url = URL.createObjectURL(data);
			}

			return `<img class='max-w-[200px] inline-block' src="${url}" />`;
		};
	} else {
		display = params.display;
	}
	let widgetName = WIDGET_NAME;
	let field = {
		display,
		label: params.label,
		db_fieldName: params.db_fieldName,
		folder: params.folder,
		width: params.width
	};
	let dataType = 'objectId';
	return { ...field, widgetName, params, dataType };
};
widget.Name = WIDGET_NAME;
widget.GuiSchema = GuiSchema;
widget.toString = () => '';
widget.modifyRequest = async ({
	field,
	data,
	user,
	type,
	collection,
	id,
	storage
}: ModifyRequestParams<typeof widget>) => {
	let _data = data.get() as File | ImageFile;
	// _id == new image id;
	// id == current document id;
	switch (type) {
		case 'POST':
		case 'PATCH':
			let _id;
			if (_data instanceof File) {
				_id = (await saveImage(_data, field.folder)).id;
				data.update(_id);
			} else if (_data?._id) {
				//chosen image from _storage_images
				_id = new mongoose.Types.ObjectId(_data._id);
				data.update(_id);
			}
			storage?.images.add(_id);

			break;
	}
};
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
			[`${fieldName}__original__name`]: {
				strict: false,
				value: info.filter
			}
		};
	if (info.sort) modifiers.sort = { [`${fieldName}__original__name`]: info.sort };
	return modifiers;
}) as modifiers;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
