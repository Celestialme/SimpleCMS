import publicConfig from '@root/config/public';
import { getGuiFields } from '@src/utils/utils';
import Email from './Email.svelte';
import { type Params, GuiSchema } from './types';
const WIDGET_NAME = 'Email' as const;

//email
const widget = (params: Params) => {
	let display;
	if (!params.display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			console.log(data);
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return data[publicConfig.DEFAULT_CONTENT_LANGUAGE] || 'NO entry';
		};
		display.default = true;
	} else {
		display = params.display;
	}
	let widget = {
		Name: WIDGET_NAME,
		GuiFields: getGuiFields(params, GuiSchema)
	};
	let field = {
		display,
		label: params.label,
		db_fieldName: params.db_fieldName,
		width: params.width
	};
	return { ...field, widget };
};
widget.Name = WIDGET_NAME;
widget.GuiSchema = GuiSchema;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
