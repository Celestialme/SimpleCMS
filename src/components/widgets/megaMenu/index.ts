import type { Display } from '../types';
export default ({
	// Accept parameters from collection
	title,
	menu,
	required,
	localization,
	display
}: {
	// Defines type of collections
	title: string;
	menu: object;
	required?: boolean;
	localization?: boolean;
	display?: Display;
}) => {
	if (!display) display = async (data: any, field: any, entry: any) => {
		let { language } = await import('../../../stores/store')
		let { get } = await import('svelte/store')
		return data.Name[get(language)]
	};

	let field: any = { schema: {}, title, menu, strict: false, required, localization, display };

	field.schema[title] = {};

	field.widget = async () => {
		// @ts-ignore
		return (await import('./MegaMenu.svelte')).default;
	};
	return field;
};
