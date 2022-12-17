// ImageArray - allows multiple image upload with editor
import type { Display } from '../types';
import type ImageUpload from '../imageUpload';
import type { Field, Params } from './types';
export default ({
	// Accept parameters from collection
	title,
	imageUploadTitle,
	icon,
	fields,
	required,
	display
}: Params) => {
	let uploader = fields.find((x) => (imageUploadTitle == x.title));
	if (!display)
		display = async (data: any, field: any, entry: any) =>
			`<img class='max-w-[200px] inline-block' src="${uploader.path}/${
				entry[uploader.title].originalname
			}" />`;

	let field:Field = { schema: {}, title,imageUploadTitle, icon, upload: true, fields, required, display } as Field;

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
