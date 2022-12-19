import type { Display } from '../types';
import type { MegaMenu_Field, MegaMenu_Params } from './types';
let widget =  ({
	// Accept parameters from collection
	title,
	menu,
	required,
	localization,
	display
}: MegaMenu_Params) => {
	if (!display) display = async (data: any, field: any, entry: any) => {
		let { language } = await import('../../../stores/store')
		let { get } = await import('svelte/store')
		return data.Name[get(language)]
	};

	let field = { schema: {}, title, menu, strict: false, required, localization, display } as MegaMenu_Field;

	field.schema[title] = {};

	field.widget = async () => {
		// @ts-ignore
		return (await import('./MegaMenu.svelte')).default;
	};
	return field;
};

export default widget