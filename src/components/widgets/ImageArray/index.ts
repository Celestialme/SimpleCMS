// ImageArray - allows multiple image upload with editor
import type { Params as ImageUpload_Params } from '../ImageUpload/types';
import { type Params, GuiSchema } from './types';
import ImageUpload from '../ImageUpload';
import type { ModifyRequestParams } from '..';
import widgets from '..';
import { getFieldName, getGuiFields } from '@src/utils/fields';
const WIDGET_NAME = 'ImageArray' as const;

const widget = (params: Params) => {
	params.fields.unshift(
		ImageUpload({
			db_fieldName: params.uploader_db_fieldName,
			label: params.uploader_label,
			display: params.uploader_display,
			folder: params.uploader_path as any
		})
	);
	let uploader = params.fields[0] as ImageUpload_Params;
	let widget = {
		Name: WIDGET_NAME,
		GuiFields: getGuiFields(params, GuiSchema)
	};
	let display;
	if (!params.display) {
		display = async ({ collection, field, entry, contentLanguage }) => {
			return await uploader.display?.({
				data: entry[getFieldName(uploader)],
				collection,
				field,
				entry,
				contentLanguage
			});
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
		extract: params.extract || true,
		width: params.width
	};

	return { ...field, widget };
};

widget.modifyRequest = async ({
	field,
	user,
	entry,
	type,
	id,
	collection
}: ModifyRequestParams<typeof widget>) => {
	for (let _field of field.fields) {
		let widget = widgets[_field.widget.Name];

		if (entry && 'modifyRequest' in widget) {
			let data = {
				get() {
					return entry[getFieldName(_field)];
				},
				update(newData) {
					entry[getFieldName(_field)] = newData;
				}
			};
			await widget.modifyRequest({
				collection,
				field: _field as ReturnType<typeof widget>,
				data,
				user,
				type,
				id
			});
		}
	}
};
widget.Name = WIDGET_NAME;
widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
