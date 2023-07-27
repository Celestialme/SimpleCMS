import type { Params } from './types';
import ImageUpload from './ImageUpload.svelte';
import { GuiSchema } from '../text/types';
const widget = ({ label, db_fieldName, display, path = '' }: Params) => {
	if (!display) {
		display = async (data, field, entry, contentLanguage) => {
			return `<img class='max-w-[200px] inline-block' src="/${path}/${data?.name}" />`;
		};
		display.default = true;
	}
	let widget: { type: any; key: 'ImageUpload' } = { type: ImageUpload, key: 'ImageUpload' };
	let field = {
		display,
		schema: { [db_fieldName || label]: { size: Number, name: String, type: String, lastModified: Number } },
		label,
		db_fieldName,
		path
	};

	return { ...field, widget };
};
widget.GuiSchema = GuiSchema;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
