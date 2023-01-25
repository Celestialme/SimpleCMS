// ImageArray - allows multiple image upload with editor

import type {ImageUpload_Field} from '../imageUpload/types';
import type { ImageArray_Field, ImageArray_Params } from './types';
 let widget =  ({
	// Accept parameters from collection
	db_fieldName,
	imageUploadTitle,
	icon,
	fields,
	required,
	display
}: ImageArray_Params) => {
	let uploader = fields.find((x: any) => (imageUploadTitle == x.db_fieldName)) as ImageUpload_Field
	if (!display)
		display = async (data: any, field: any, entry: any) =>
			`<img class='max-w-[200px] inline-block' src="${uploader.path}/${
				entry[uploader.db_fieldName].name
			}" />`;

	let field = { schema: {}, db_fieldName,imageUploadTitle, icon, upload: true, fields, required, display } as ImageArray_Field;

	field.schema[db_fieldName] = {
		
		size:Number,
		name:String,
		type:String,
		lastModified:Number
	};

	field.widget = async () => {
		// @ts-ignore
		return (await import('./ImageArray.svelte')).default;
	};

	return field;
};

export default widget