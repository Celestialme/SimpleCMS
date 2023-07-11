import type { Schema } from '@src/collections/types';
import type { Schema, any } from 'zod';

export type Params = {
	label: string;
	display?: DISPLAY;
	db_fieldName?: string;
	// Widget Specific parameters
	widget?: any;
	schema?: any;
	relation: Schema;
};

export let GuiSchema = {
	label: { type: String, required: true },
	display: { type: String, required: true },
	db_fieldName: { type: String, required: true },

	// Widget Specific parameters
	widget: { type: any, required: false },
	schema: { type: any, required: false },
	relation: { type: Schema, required: true }
};
