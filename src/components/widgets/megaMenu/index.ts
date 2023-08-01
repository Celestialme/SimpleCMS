// MegaMenu - allows multilevel menus for navigation
import MegaMenu from './MegaMenu.svelte';
import { writable, type Writable } from 'svelte/store';

import { type Params, GuiSchema } from './types';
import { defaultContentLanguage } from '@src/stores/store';

// typesafe-i18n
import { get } from 'svelte/store';
import LL from '@src/i18n/i18n-svelte.js';

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
				? data[contentLanguage] || get(LL).ENTRYLIST_Untranslated()
				: data[defaultContentLanguage] || get(LL).ENTRYLIST_Untranslated();
		};
		display.default = true;
	}

	const widget: { type: any; key: 'MegaMenu' } = { type: MegaMenu, key: 'MegaMenu' };

	const field = { display, schema: { [db_fieldName || label]: String }, label, db_fieldName, menu };

	return { ...field, widget };
};

widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
