import type { Display } from '../types';

export type Address_Field = {
	widget: () => {};
	schema: { [Key: string]: any };
	title: string;
    icon: string | undefined;
    required: boolean | undefined;
    display: Display;
};
export type Address_Params = {
	// Defines type of collections
	title: string;
	icon?: string;
	required?: boolean;
	display?: Display;
};
