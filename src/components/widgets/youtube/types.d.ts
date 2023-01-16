import type { Display } from '../types';

export type Youtube_Field = {
	widget: () => {};
	schema: { [Key: string]: any };
	db_fieldName: string;
	icon: string | undefined;
	placeholder: string | undefined;
	required: boolean | undefined;
	display: Display;
};
export type Youtube_Params = {
	db_fieldName: string;
	icon?: string;
	placeholder?: string;
	required?: boolean;
	display?: Display;
};
