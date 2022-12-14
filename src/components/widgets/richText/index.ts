import type { Display } from '../types';

export default ({
	title,
	required,
	localization,
	display
}: {
	title: string;
	required?: boolean;
	localization?: boolean;
	display?: Display;
}) => {
	if (!display) display = (data: any, field: any, entry: any) => data;
	let field: any = {
		schema: {},
		title,
		required,
		localization,
		display
	};
	field.schema[title] = 'string';
	field.widget = async () => {
		// @ts-ignore
		return (await import('./RichText.svelte')).default;
	};
	return field;
};
