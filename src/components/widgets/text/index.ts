import { PUBLIC_CONTENT_LANGUAGE } from '$env/static/public';
import { getGuiFields } from '@src/utils/utils';
import Text from './Text.svelte';
import { GuiSchema, GraphqlSchema, type Params } from './types';
const widget = (params: Params) => {
	/** This is a description of the foo function. */
	let display;
	if (!params.display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return params.translated ? data[contentLanguage] || 'NO entry' : data[PUBLIC_CONTENT_LANGUAGE] || 'NO entry';
		};
		display.default = true;
	} else {
		display = params.display;
	}
	let widget: { type: typeof Text; key: 'Text'; GuiFields: ReturnType<typeof getGuiFields> } = {
		type: Text,
		key: 'Text',
		GuiFields: getGuiFields(params, GuiSchema)
	};
	let field = {
		display,
		label: params.label,
		db_fieldName: params.db_fieldName,
		translated: params.translated,
		width: params.width
	};
	return { ...field, widget };
};
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
