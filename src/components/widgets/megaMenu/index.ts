// MegaMenu - allows multilevel menus for navigation
import MegaMenu from './MegaMenu.svelte';
import type { Params } from './types';
import { GuiSchema } from './types';
import { writable, type Writable } from 'svelte/store';

import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';

export let currentChild: Writable<any> = writable({});

const widget = ({
	// Accept parameters from collection
	label,
	db_fieldName,
	display,
	translated = false,
	menu
}: Params) => {
	if (!display) {
		display = async (data, field, entry, contentLanguage) => {
			// console.log(data);
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return translated ? data[contentLanguage] || 'NO entry' : data[PUBLIC_CONTENT_LANGUAGES] || 'NO entry';
		};
	}

	let widget: { type: any; key: 'MegaMenu' } = { type: MegaMenu, key: 'MegaMenu' };

	let field = { display, schema: { [db_fieldName || label]: String }, label, db_fieldName, menu };

	return { ...field, widget };
};

widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
