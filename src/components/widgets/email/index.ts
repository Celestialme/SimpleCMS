import { PUBLIC_CONTENT_LANGUAGE } from '$env/static/public';
import Email from './Email.svelte';
import { type Params, GuiSchema } from './types';
//email
const widget = ({ label, db_fieldName, display }: Params) => {
	if (!display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			console.log(data);
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return data[PUBLIC_CONTENT_LANGUAGE] || 'NO entry';
		};
		display.default = true;
	}
	let widget: { type: any; key: 'Email' } = { type: Email, key: 'Email' };
	let field = {
		display,
		label,
		db_fieldName
	};
	return { ...field, widget };
};
widget.GuiSchema = GuiSchema;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
