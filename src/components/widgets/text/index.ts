import type { Field, Params } from './types';
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
}:Params) => {
	
	if (!display) display = async (data: any, field: any, entry: any) => {
		let {language} = await import ("../../../stores/store")
		let {get} = await import('svelte/store')
		return data[get(language)] || ""
	
	};
	let field:Field = {
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
	} as Field;
	field.schema[title] = {String:String};
	field.widget = async () => {
		// @ts-ignore
		return (await import('./Text.svelte')).default;
	};
	return field;
};
