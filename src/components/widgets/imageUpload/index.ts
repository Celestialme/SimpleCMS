import { type Params, GuiSchema, GraphqlSchema } from './types';
import ImageUpload from './ImageUpload.svelte';
import { getFieldName, getGuiFields, get_elements_by_id, saveImage } from '@src/utils/utils';
import type { ModifyRequestParams } from '..';
import mongoose from 'mongoose';
import type { ImageFiles } from '@src/utils/types';
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
	let widget: { type: typeof ImageUpload; key: 'ImageUpload'; GuiFields: ReturnType<typeof getGuiFields> } = {
		type: ImageUpload,
		key: 'ImageUpload',
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
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
widget.modifyRequest = async ({ field, data, user, type, collection, id }: ModifyRequestParams<typeof widget>) => {
	let _data = data.get() as File | ImageFiles;
	// _id == new image id;
	// _data.oldId == old image id;
	// id == current document id;
	switch (type) {
		case 'GET':
			// here _data is just id of the image
			get_elements_by_id.add('image_files', _data, (newData) => data.update(newData));
			break;
		case 'POST':
		case 'PATCH':
			if (_data instanceof File) {
				console.log(_data);
				let _id = await saveImage(_data, collection.name);

				type === 'PATCH' && (await mongoose.models['image_files'].updateMany({ _id: _data.oldID }, { $pull: { used_by: id } }));
				await mongoose.models['image_files'].updateOne({ _id }, { $addToSet: { used_by: id } }, { upsert: true });
				data.update(_id);
			} else {
				//chosen image from image_files
				let _id = new mongoose.Types.ObjectId(_data._id);
				type === 'PATCH' && (await mongoose.models['image_files'].updateMany({ _id: _data.oldID }, { $pull: { used_by: id } }));
				await mongoose.models['image_files'].updateOne({ _id }, { $addToSet: { used_by: id } }, { upsert: true });
				data.update(_id);
			}
			break;
		case 'DELETE':
			await mongoose.models['image_files'].updateMany({ used_by: id }, { $pull: { used_by: id } });
			break;
	}
};
widget.aggregations = {
	filters: async (info) => {
		let field = info.field as ReturnType<typeof widget>;

		return [{ $match: { [`${getFieldName(field)}.original.name`]: { $regex: info.filter, $options: 'i' } } }];
	},
	sorts: async (info) => {
		let field = info.field as ReturnType<typeof widget>;
		let fieldName = getFieldName(field);
		return [{ $sort: { [`${fieldName}.original.name`]: info.sort } }];
	}
} as Aggregations;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
