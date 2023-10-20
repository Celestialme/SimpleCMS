import { type Params, GuiSchema, GraphqlSchema } from './types';
import ImageUpload from './ImageUpload.svelte';
import { getGuiFields } from '@src/utils/utils';
const widget = (params: Params) => {
	let display;
	if (!params.display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			return `<img class='max-w-[200px] inline-block' src="${data?.thumbnail.url}" />`;
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
		path: params.path || 'unique'
	};

	return { ...field, widget };
};
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
