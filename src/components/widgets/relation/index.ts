import { findById } from '../../../utils/utils';

import type { Display } from '../types';
import type { Relation_Params, Relation_Field } from './types';
let widget =  ({
	// Accept parameters from collection
	title,
	icon,
	required,
	relation,
	display
}:Relation_Params) => {
	let _display: Display | undefined;
	if (!display) display = async (data: any, field: any, entry: any) => data; //default
	else
		_display = async (data: any, field: any, entry: any) => {
			console.log(data)
			let _data = await findById(data, relation);
			return await (display as Display)(_data, field, entry);
		};
	if (!_display) _display = display;
	let field = {
		schema: {},
		title,
		icon,
		strict: false,
		required,
		relation,
		display: _display,
		rawDisplay: display
	}as Relation_Field;

	field.schema[title] = 'string';

	field.widget = async () => {
		// @ts-ignore
		return (await import('./Relation.svelte')).default;
	};
	return field;
};

export default widget