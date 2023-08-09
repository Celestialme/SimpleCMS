import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';

import type { Schema } from '@src/collections/types';

export type Params = {
	label: string;
	display?: DISPLAY;
	db_fieldName?: string;
	widget?: any;
	schema?: any;
	relation: Schema;
};
export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true },
	relation: { widget: FloatingInput, required: true }
};
