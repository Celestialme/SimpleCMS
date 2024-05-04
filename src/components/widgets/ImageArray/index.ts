// ImageArray - allows multiple image upload with editor
import type { Params as ImageUpload_Params } from '../ImageUpload/types';
import { getFieldName, getGuiFields } from '@src/utils/utils.js';
import { type Params, GuiSchema, GraphqlSchema } from './types';
import ImageArray from './ImageArray.svelte';
import ImageUpload from '../ImageUpload';
import type { ModifyRequestParams } from '..';
import widgets from '..';
const WIDGET_NAME = 'ImageArray' as const;
const widget = (params: Params) => {
	params.fields.unshift(
		ImageUpload({
			db_fieldName: params.uploader_db_fieldName,
			label: params.uploader_label,
			display: params.uploader_display,
			path: params.uploader_path
		})
	);
	let uploader = params.fields[0] as ImageUpload_Params;
	let widget = {
		Name: WIDGET_NAME,
		GuiFields: getGuiFields(params, GuiSchema)
	};
	let display;
	if (!params.display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			return `<img class='max-w-[200px] inline-block' src="${entry[getFieldName(uploader)]?.thumbnail?.url}" />`;
		};
		display.default = true;
	} else {
		display = params.display;
	}
	let field = {
		db_fieldName: params.db_fieldName,
		label: params.label,
		icon: params.icon,
		upload: true,
		fields: params.fields,
		required: params.required,
		display: display,
		uploader_label: params.uploader_label,
		uploader_path: params.uploader_path,
		uploader_display: params.uploader_display,
		uploader_db_fieldName: params.uploader_db_fieldName,
		extract: true,
		width: params.width
	};

	return { ...field, widget };
};

widget.modifyRequest = async ({
	field,
	data,
	user,
	type,
	id,
	collection
}: ModifyRequestParams<typeof widget>) => {
	let _data = data.get();
	console.log('data:', _data);
	return;
	for (let _field of field.fields) {
		let widget = widgets[_field.widget.Name];
		if ('modifyRequest' in widget) {
			await widget.modifyRequest({
				collection,
				field: _field as ReturnType<typeof widget>,
				data: _data[getFieldName(_field)],
				user,
				type,
				id
			});
		}
	}
};
widget.Name = WIDGET_NAME;
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
