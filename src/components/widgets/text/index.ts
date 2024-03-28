import publicConfig from '@root/config/public';
import { getFieldName, getGuiFields } from '@src/utils/utils';
import Text from './Text.svelte';
import { GuiSchema, GraphqlSchema, type Params } from './types';
const widget = (params: Params) => {
	/** This is a description of the foo function. */
	let display;
	if (!params.display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return params.translated ? data[contentLanguage] || 'NO entry' : data[publicConfig.DEFAULT_CONTENT_LANGUAGE] || 'NO entry';
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
		permissions: params.permissions,
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
widget.aggregations = {
	filters: async (info) => {
		let field = info.field as ReturnType<typeof widget>;

		return [{ $match: { [`${getFieldName(field)}.${info.contentLanguage}`]: { $regex: info.filter, $options: 'i' } } }];
	},
	sorts: async (info) => {
		let field = info.field as ReturnType<typeof widget>;
		let fieldName = getFieldName(field);
		return [{ $sort: { [`${fieldName}.${info.contentLanguage}`]: info.sort } }];
	}
} as Aggregations;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
