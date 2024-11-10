import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';

import publicConfig from '@root/config/public';
export type Params = {
	label: string;
	display?: DISPLAY;
	db_fieldName?: string;
	widget?: any;
	folder: (typeof publicConfig.FOLDERS)[number];
	width?: number;
};
export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	folder: { widget: FloatingInput, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true }
};
