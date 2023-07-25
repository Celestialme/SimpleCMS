// MegaMenu - allows multilevel menus for navigation
import MegaMenu from './MegaMenu.svelte';
import type { Params } from './types';
import { GuiSchema } from './guiSchema';
import { writable, type Writable } from 'svelte/store';

import { defaultContentLanguage } from '@src/stores/store';

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
		// display for table
		display = async (data: any, field: any, entry: any, contentLanguage: any) => {
			// console.log(data);
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return translated
				? data[contentLanguage] || 'NO entry'
				: data[defaultContentLanguage] || 'NO entry';
		};
	}

	const widget: { type: any; key: 'MegaMenu' } = { type: MegaMenu, key: 'MegaMenu' };

	const field = { display, schema: { [db_fieldName || label]: String }, label, db_fieldName, menu };

	return { ...field, widget };
};

widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
