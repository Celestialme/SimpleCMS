import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';

export type Params = {
	id?: string;
	db_fieldName?: null;
	label: string;
	width?: number;
	icon?: string;
	required?: boolean;
	widget?: any;
	extractFields?: boolean;
	fields: any;
	display?: DISPLAY;
	uploader_label: string;
	uploader_path: string;
	uploader_display?: DISPLAY;
	uploader_db_fieldName?: string;
};
export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true },
	uploader_path: { widget: FloatingInput, required: true },
	uploader_label: { widget: FloatingInput, required: true }
};
