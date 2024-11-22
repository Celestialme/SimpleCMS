import publicConfig from '@root/config/public';
import Toggle from '@src/components/system/buttons/Toggle.svelte';
import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
import { toStringHelper } from '@src/utils/utils';

export type Params = {
	id?: string;
	type: 'text' | 'email' | 'date';
	label: string;
	width?: number;
	display?: DISPLAY;
	db_fieldName?: string;
	translated?: boolean;
};

export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	type: { widget: FloatingInput, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true },
	translated: { widget: Toggle, required: false }
};

export function toString({ field, data }: { field: any; data: any }) {
	return toStringHelper({
		field,
		data,
		path: (lang) => {
			return data[lang];
		}
	});
}
