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
		display = async (data: any, field: any, entry: any) => {
			return data.Header.en;
		};

	let field: Params = { widget: MegaMenu, schema: {}, db_fieldName, menu, display, label };

	return field;
};
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
