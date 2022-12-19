import type { Display } from '../types';

export type Group_Field = {
	widget: () => {};
	schema: { [Key: string]: any };
	title: string;
    upload: boolean;
    fields: any[];
    required: boolean | undefined;
    display: Display;
};
export type Group_Params = {
	// Defines type of collections
	title: string;
	required?: boolean;
	fields: Array<any>;
	display?: Display;
};
