import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';

export type Params = {
	label: string;
	display?: DISPLAY;
	db_fieldName?: string;
	widget?: any;
	schema?: any;
	path: (string & {}) | 'global' | 'unique';
};
export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	path: { widget: FloatingInput, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true }
};
