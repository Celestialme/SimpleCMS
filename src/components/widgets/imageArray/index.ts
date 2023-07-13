// ImageArray - allows multiple image upload with editor
import ImageArray from './ImageArray.svelte';
import type { Params } from './types';
import { GuiSchema } from './guiSchema';
import type { Params as ImageUpload_Params } from '../imageUpload/types';
import { getFieldName } from '@src/utils/utils.js';

import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';

const widget = ({
	// Accept parameters from collection
	db_fieldName,
	icon,
	fields,
	required,
	label,
	display
}: Params) => {
	let uploader = fields[0] as ImageUpload_Params;
	if (!display)
		display = async (data, field, entry, contentLanguage) =>
			`<img class='max-w-[200px] inline-block' src="/${uploader.path}/${entry[getFieldName(uploader)].name}" />`;

	let widget: { type: any; key: 'ImageArray' } = { type: ImageArray, key: 'ImageArray' };

	let field = {
		schema: { [db_fieldName || label]: { String: String } },
		db_fieldName,
		label,
		icon,
		upload: true,
		fields,
		required,
		display
	};

	return { ...field, widget };
};

widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
