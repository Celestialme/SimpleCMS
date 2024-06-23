import publicConfig from '@root/config/public';
import { getFieldName, getGuiFields } from '@src/utils/utils';
import { GuiSchema, type Params } from './types';
const WIDGET_NAME = 'Input' as const;
const widget = (params: Params) => {
	/** This is a description of the foo function. */
	let display;
	if (!params.display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return params.translated
				? data[contentLanguage] || 'NO entry'
				: data[publicConfig.DEFAULT_CONTENT_LANGUAGE] || 'NO entry';
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
		type: params.type,
		db_fieldName: params.db_fieldName,
		translated: params.translated,
		width: params.width
	};
	return { ...field, widget };
};
widget.Name = WIDGET_NAME;
widget.GuiSchema = GuiSchema;
widget.aggregations = {
	filters: async (info) => {
		let field = info.field as ReturnType<typeof widget>;

		return [
			{
				$match: {
					[`${getFieldName(field)}.${info.contentLanguage}`]: { $regex: info.filter, $options: 'i' }
				}
			}
		];
	},
	sorts: async (info) => {
		let field = info.field as ReturnType<typeof widget>;
		let fieldName = getFieldName(field);
		return [{ $sort: { [`${fieldName}.${info.contentLanguage}`]: info.sort } }];
	}
} as Aggregations;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
