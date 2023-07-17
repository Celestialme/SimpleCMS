import RemoteVideo from './RemoteVideo.svelte';
import type { Params } from './types';
import { GuiSchema } from './guiSchema';

import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';

const widget = ({
	label,
	db_fieldName,
	display,
	translated = false, // TODO: no translated need for this widget
	icon,
	// extras
	placeholder,
	required
}: Params) => {
	if (!display) {
		// display for table
		display = async (data: any, field: any, entry: any, contentLanguage: any) => {
			// console.log(data);
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return translated
				? data[contentLanguage] || 'NO entry'
				: data[PUBLIC_CONTENT_LANGUAGES] || 'NO entry';
		};
	}

	const widget: { type: any; key: 'RemoteVideo' } = { type: RemoteVideo, key: 'RemoteVideo' };

	const field = {
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		icon,
		// extras
		placeholder,
		required
	};

	return { ...field, widget };
};

widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
