import type { Display } from '../types';

export type DateRange_Field = {
	widget: () => {};
	schema: { [Key: string]: any };
    title: string;
    icon: string | undefined;
    format: string | undefined;
    required: boolean | undefined;
    display: Display;
};
export type DateRange_Params = {
	// Defines type of collections
	title: string;
	icon?: string;
	format?: string;
	required?: boolean;
	display?: Display;
};
