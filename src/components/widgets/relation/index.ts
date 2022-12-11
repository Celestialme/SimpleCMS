import { findById } from '../../../utils/utils';
import type { Schema } from '../../../collections/types';
import type { Display } from '../types';
export default ({
	// Accept parameters from collection
	title,
	icon,
	required,
	relation,
	display
}: {
	// Defines type of collections
	title: string;
	icon?: string;
	required?: boolean;
	relation: Schema;

	display?: Display;
}) => {
	let _display: Display | undefined;
	if (!display) display = async (data: any, field: any, entry: any) => data;
	else
		_display = async (data: any, field: any, entry: any) => {
			let _data = await findById(data, relation);
			return await (display as Display)(_data, field, entry);
		};
	if (!_display) _display = display;
	let field: any = {
		schema: {},
		title,
		icon,
		strict: false,
		required,
		relation,
		display: _display,
		rawDisplay: display
	};

	field.schema[title] = 'string';

	field.widget = async () => {
		// @ts-ignore
		return (await import('./Relation.svelte')).default;
	};
	return field;
};
