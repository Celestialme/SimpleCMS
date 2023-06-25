import type { Params } from './types';
import ImageUpload from './ImageUpload.svelte';

let widget = ({ label, db_fieldName, display, path = '' }: Params) => {
	if (!display)
		display = async (data, field, entry, contentLanguage) => {
			return `<img class='max-w-[200px] inline-block' src="/${path}/${data?.name}" />`;
		};

	let widget: { widget: any } = { widget: ImageUpload };

	// Accept parameters from collection
	let field = {
		display,
		schema: { [db_fieldName || label]: { size: Number, name: String, type: String, lastModified: Number } },
		label,
		db_fieldName,
		path
	};

	return { ...field, ...widget };
};
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
