import publicConfig from '@root/config/public';
import { GuiSchema, toString, type Params } from './types';
import { getFieldName } from '@src/utils/fields';
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
	let widgetName = WIDGET_NAME;
	let field = {
		display,
		label: params.label,
		type: params.type,
		db_fieldName: params.db_fieldName,
		translated: params.translated,
		width: params.width
	};
	let dataType = publicConfig.AVAILABLE_CONTENT_LANGUAGES.reduce(
		(acc, lang) => {
			acc[lang] = 'string';
			return acc;
		},
		{} as { [key in (typeof publicConfig.AVAILABLE_CONTENT_LANGUAGES)[number]]: string }
	);
	return { ...field, widgetName, params, dataType };
};
widget.Name = WIDGET_NAME;
widget.GuiSchema = GuiSchema;
widget.toString = toString;
widget.modifiers = (async (info) => {
	let field = info.field as ReturnType<typeof widget>;
	let fieldName = getFieldName(field);

	let modifiers: ReturnType<modifiers> = {};
	if (info.filter)
		modifiers.match = {
			[`${fieldName}->${info.contentLanguage}`]: {
				strict: false,
				text: info.filter
			}
		};
	if (info.sort)
		modifiers.sort = {
			[`${fieldName}->${info.contentLanguage}`]: info.sort
		};
	return modifiers;
}) as modifiers;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
