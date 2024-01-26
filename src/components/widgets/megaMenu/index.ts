import { type Params, GuiSchema, GraphqlSchema } from './types';
import MegaMenu from './MegaMenu.svelte';
import Text from '../text';
import { writable, type Writable } from 'svelte/store';
import { getGuiFields } from '@src/utils/utils';
export let currentChild: Writable<any> = writable({});
/**
 * Returns the average of two numbers.
 */
const widget = (params: Params) => {
	let display;
	if (!params.display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			return data.Header[contentLanguage];
		};
		display.default = true;
	} else {
		display = params.display;
	}
	let widget: { type: typeof MegaMenu; key: 'MegaMenu'; GuiFields: ReturnType<typeof getGuiFields> } = {
		type: MegaMenu,
		key: 'MegaMenu',
		GuiFields: getGuiFields(params, GuiSchema)
	};

	for (let level of params.menu) {
		level.unshift(Text({ label: 'Header', translated: true }));
	}
	params.menu.unshift([Text({ label: 'Header', translated: true })]);

	let field: Params = { db_fieldName: params.db_fieldName, menu: params.menu, display, label: params.label, width: params.width };

	return { ...field, widget };
};
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
