import { type Params, GuiSchema, GraphqlSchema } from './types';
import { getFieldName, getGuiFields, get_elements_by_id, saveImage } from '@src/utils/utils';
import { widgetContext, type ModifyRequestParams } from '..';
import mongoose from 'mongoose';
import type { ImageFiles } from '@src/utils/types';
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
		path: params.path || 'unique',
		width: params.width
	};

	return { ...field, widget };
};
widget.Name = WIDGET_NAME;
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
widget.modifyRequest = async ({
	field,
	data,
	user,
	type,
	collection,
	id
}: ModifyRequestParams<typeof widget>) => {
	let _data = data.get() as File | ImageFiles;
	// _id == new image id;
	// id == current document id;
	switch (type) {
		case 'GET':
			// here _data is just id of the image
			data.update(null);
			get_elements_by_id.add('image_files', _data, (newData) => data.update(newData));
			break;
		case 'POST':
		case 'PATCH':
			let _id;
			if (_data instanceof File) {
				_id = (await saveImage(_data, collection.name)).id;
				data.update(_id);
			} else {
				//chosen image from image_files
				_id = new mongoose.Types.ObjectId(_data._id);
				data.update(_id);
			}
			type === 'PATCH' &&
				(await mongoose.models['image_files'].updateMany({}, { $pull: { used_by: id } }));
			await mongoose.models['image_files'].updateOne({ _id }, { $addToSet: { used_by: id } });
			break;
		case 'DELETE':
			await mongoose.models['image_files'].updateMany({}, { $pull: { used_by: id } });
			break;
	}
};
widget.aggregations = {
	filters: async (info) => {
		let field = info.field as ReturnType<typeof widget>;

		return [
			{
				$match: { [`${getFieldName(field)}.original.name`]: { $regex: info.filter, $options: 'i' } }
			}
		];
	},
	sorts: async (info) => {
		let field = info.field as ReturnType<typeof widget>;
		let fieldName = getFieldName(field);
		return [{ $sort: { [`${fieldName}.original.name`]: info.sort } }];
	}
} as Aggregations;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
