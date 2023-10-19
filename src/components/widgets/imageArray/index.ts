// ImageArray - allows multiple image upload with editor
import type { Params as ImageUpload_Params } from '../imageUpload/types';
import { getFieldName } from '@src/utils/utils.js';
import { type Params, GuiSchema, GraphqlSchema } from './types';
import ImageArray from './ImageArray.svelte';
import ImageUpload from '../imageUpload';
const widget = ({
	db_fieldName = null,

	icon,
	fields,
	required,
	label,
	display,
	uploader_label,
	uploader_path,
	uploader_display,
	uploader_db_fieldName
}: Params) => {
	fields.unshift(ImageUpload({ db_fieldName: uploader_db_fieldName, label: uploader_label, display: uploader_display, path: uploader_path }));
	let uploader = fields[0] as ImageUpload_Params;

	if (!display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			return `<img class='max-w-[200px] inline-block' src="${entry[getFieldName(uploader)]?.thumbnail?.url}" />`;
		};
		display.default = true;
	}
	let widget: { type: any; key: 'ImageArray' } = { type: ImageArray, key: 'ImageArray' };
	let field = {
		db_fieldName,
		label,
		icon,
		upload: true,
		fields,
		required,
		display,
		extract: true
	};

	return { ...field, widget };
};
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
