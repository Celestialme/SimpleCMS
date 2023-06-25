import type { Params } from './types';
import MegaMenu from './MegaMenu.svelte';
import { writable, type Writable } from 'svelte/store';
export let currentChild: Writable<any> = writable({});
let widget = ({
	// Accept parameters from collection
	db_fieldName,
	menu,
	display,
	label
}: Params) => {
	if (!display)
		display = async (data, field, entry, contentLanguage) => {
			return data.Header[contentLanguage];
		};
	let widget: { widget: any } = { widget: MegaMenu };
	let field: Params = { schema: {}, db_fieldName, menu, display, label };

	return { ...field, ...widget };
};
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
