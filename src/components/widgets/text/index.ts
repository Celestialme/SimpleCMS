import type { Display } from '../types';
export default ({
	title,
	icon,
	placeholder,
	count,
	prefix,
	suffix,
	required,
	display
}: {
	title: string;
	icon?: string;
	placeholder?: string;
	count?: string;
	prefix?: string;
	suffix?: string;
	required?: boolean;
	display?: Display;
}) => {
	
	if (!display) display = async (data: any, field: any, entry: any) => {
		let {language} = await import ("../../../stores/store")
		let {get} = await import('svelte/store')
		return data[get(language)] || ""
	
	};
	let field: any = {
		schema: {},
		title,
		icon,
		placeholder,
		count,
		prefix,
		suffix,
		required,
		display
	};
	field.schema[title] = {String:String};
	field.widget = async () => {
		// @ts-ignore
		return (await import('./Text.svelte')).default;
	};
	return field;
};
