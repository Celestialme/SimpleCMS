import { type Params, GuiSchema, GraphqlSchema } from './types';
import ImageUpload from './ImageUpload.svelte';
const widget = ({ label, db_fieldName, display, path = 'unique' }: Params) => {
	if (!display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			return `<img class='max-w-[200px] inline-block' src="${data?.thumbnail.url}" />`;
		};
		display.default = true;
	}
	let widget: { type: any; key: 'ImageUpload' } = { type: ImageUpload, key: 'ImageUpload' };
	let field = {
		display,
		label,
		db_fieldName,
		path
	};

	return { ...field, widget };
};
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
