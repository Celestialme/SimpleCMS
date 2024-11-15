import publicConfig from '@root/config/public';
import { GuiSchema, toString, type Params } from './types';
import { getGuiFields, getFieldName } from '@src/utils/fields';
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
widget.toString = toString;
widget.modifiers = (async (info) => {
	let field = info.field as ReturnType<typeof widget>;
	let fieldName = getFieldName(field);
	return [
		info.filter && {
			$match: {
				[`${getFieldName(field)}.${info.contentLanguage}`]: {
					$regex: info.filter,
					$options: 'i'
				}
			}
		},
		info.sort && { $sort: { [`${fieldName}.${info.contentLanguage}`]: info.sort } }
	];
}) as modifiers;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
