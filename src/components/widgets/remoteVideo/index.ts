import RemoteVideo from './RemoteVideo.svelte';

import { type Params, GuiSchema } from './types';
import { defaultContentLanguage } from '@src/stores/store';

const widget = ({
	label,
	db_fieldName,
	display,
	icon,
	// extras
	placeholder,
	required
}: Params) => {
	if (!display) {
		display = async (data, field, entry, contentLanguage) => {
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return data[defaultContentLanguage] || 'NO entry';
		};
		display.default = true;
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
