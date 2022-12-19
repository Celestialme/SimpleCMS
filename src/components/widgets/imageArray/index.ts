// ImageArray - allows multiple image upload with editor

import type {ImageUpload_Field} from '../imageUpload/types';
import type { ImageArray_Field, ImageArray_Params } from './types';
 let widget =  ({
	// Accept parameters from collection
	title,
	imageUploadTitle,
	icon,
	fields,
	required,
	display
}: ImageArray_Params) => {
	let uploader = fields.find((x: any) => (imageUploadTitle == x.title)) as ImageUpload_Field
	if (!display)
		display = async (data: any, field: any, entry: any) =>
			`<img class='max-w-[200px] inline-block' src="${uploader.path}/${
				entry[uploader.title].originalname
			}" />`;

	let field = { schema: {}, title,imageUploadTitle, icon, upload: true, fields, required, display } as ImageArray_Field;

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

export default widget