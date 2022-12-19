import env  from '@root/env';
import type { Text_Field, Text_Params } from './types';
let widget = ({
	title,
	icon,
	placeholder,
	count,
	prefix,
	suffix,
	required,
	localization,
	display
}:Text_Params) => {
	
	if (!display) display = async (data: any, field: any, entry: any) => {
		let {language} = await import ("../../../stores/store")
		let {get} = await import('svelte/store')
		let _language = localization?get(language):env.LANGUAGE
		return data[_language] || "No Value"
	
	};
	let field = {
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
	} as Text_Field;
	field.schema[title] = {String:String};
	field.widget = async () => {
		// @ts-ignore
		return (await import('./Text.svelte')).default;
	};
	return field;
};

export default widget