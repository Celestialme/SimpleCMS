import { type Params, GuiSchema, GraphqlSchema } from './types';
import ImageUpload from './ImageUpload.svelte';
import { getFieldName, getGuiFields } from '@src/utils/utils';
import type { ModifyRequestParams } from '..';
import mongoose from 'mongoose';
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
		width: params.width,
		permissions: params.permissions
	};

	return { ...field, widget };
};
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
widget.modifyRequest = async ({ field, data, user, type }: ModifyRequestParams<typeof widget>) => {
	if (type !== 'GET') {
		if (data._id) {
			data = new mongoose.Types.ObjectId(data._id);
		}
		return data;
	}
	let media_collection = mongoose.models['image_files'];

	return await media_collection.findById(data);
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
