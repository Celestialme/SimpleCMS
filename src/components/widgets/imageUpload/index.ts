import ImageUpload from './ImageUpload.svelte';
import type { Params } from './types';
import { GuiSchema } from './guiSchema';

import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';

const widget = ({ label, db_fieldName, display, path = '' }: Params) => {
	if (!display)
		// display for table
		display = async (data, field, entry, contentLanguage) => {
			return `<img class='max-w-[200px] inline-block' src="/${path}/${data?.name}" />`;
		};

	const widget: { type: any; key: 'ImageUpload' } = { type: ImageUpload, key: 'ImageUpload' };

	const field = {
		label,
		db_fieldName,
		display,
		schema: {
			[db_fieldName || label]: { size: Number, name: String, type: String, lastModified: Number }
		},
		// Widget Specific parameters
		path
	};

	return { ...field, widget };
};

widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
