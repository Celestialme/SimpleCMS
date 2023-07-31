import type { Schema } from '@src/collections/types';

export type Params = {
	label: string;
	display?: DISPLAY;
	db_fieldName?: string;
	// Widget Specific parameters
	widget?: any;
	schema?: any;
	relation: Schema;
};
