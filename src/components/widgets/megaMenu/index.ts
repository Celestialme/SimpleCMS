import { type Params, GuiSchema, GraphqlSchema } from './types';
import MegaMenu from './MegaMenu.svelte';
import { writable, type Writable } from 'svelte/store';
export let currentChild: Writable<any> = writable({});
const widget = ({
	// Accept parameters from collection
	db_fieldName,
	menu,
	display,
	label
}: Params) => {
	if (!display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			return data.Header[contentLanguage];
		};
		display.default = true;
	}
	let widget: { type: any; key: 'MegaMenu' } = { type: MegaMenu, key: 'MegaMenu' };
	let field: Params = { schema: {}, db_fieldName, menu, display, label };

	return { ...field, widget };
};
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
