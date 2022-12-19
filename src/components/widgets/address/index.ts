import type { Display } from '../types';
import type { Address_Field, Address_Params } from './types';

let widget =  ({
	// Accept parameters from collection
	title,
	icon,
	required,
	display
}: Address_Params) => {
	if (!display) display = (data: any, field: any, entry: any) => data;

	let field = { schema: {}, title, icon, required, display } as Address_Field;

	field.schema[title] = 'string';

	field.widget = async () => {
		// @ts-ignore
		return (await import('./Address.svelte')).default;
	};
	return field;
};

export default widget