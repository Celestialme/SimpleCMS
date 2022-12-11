import type { Display } from '../types';

export default ({
	title,
	icon,
	placeholder,
	count,
	prefix,
	suffix,
	required,
	localization,
	display
}: {
	title: string;
	icon?: string;
	placeholder?: string;
	count?: string;
	prefix?: string;
	suffix?: string;
	required?: boolean;
	localization?: boolean;
	display?: Display;
}) => {
	if (!display) display = (data: any, field: any, entry: any) => data;
	let field: any = {
		schema: {},
		title,
		icon,
		placeholder,
		count,
		prefix,
		suffix,
		required,
		localization,
		display
	};
	field.schema[title] = 'string';
	field.widget = async () => {
		// @ts-ignore
		return (await import('./Text.svelte')).default;
	};
	return field;
};
