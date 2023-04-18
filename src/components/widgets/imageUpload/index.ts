import type { Params } from './types';
import ImageUpload from './ImageUpload.svelte';
let widget = ({ label, db_fieldName, display, path = '' }: Params) => {
	if (!display)
		display = async (data: any, field: any, entry: any) => {
			return `<img class='max-w-[200px] inline-block' src="${path}/${data?.name}" />`;
		};

	let field = {
		widget: ImageUpload,
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		path
	};

	return field;
};
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
