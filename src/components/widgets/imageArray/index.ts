// ImageArray - allows multiple image upload with editor
import type { Display } from '../types';

export default ({
	// Accept parameters from collection
	title,
	icon,
	fields,
	required,
	display
}: {
	// Defines type of collections
	title: string;
	icon?: string;
	required?: boolean;
	fields: Array<any>;
	display?: Display;
}) => {
	let uploader = fields.find((x) => (x.upload = true));
	if (!display)
		display = async (data: any, field: any, entry: any) =>
			`<img class='max-w-[200px] inline-block' src="${uploader.path}/${
				entry[uploader.title].originalname
			}" />`;

	let field: any = { schema: {}, title, icon, upload: true, fields, required, display };

	field.schema[title] = {
		originalname: 'string',
		encoding: 'string',
		mimetype: 'string',
		size: 'number',
		filename: 'string',
		alt: 'string'
	};

	field.widget = async () => {
		// @ts-ignore
		return (await import('./ImageArray.svelte')).default;
	};

	return field;
};
