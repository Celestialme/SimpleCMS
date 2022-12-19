import type { Display } from '../types';

export type Email_Field = {
	widget: () => {};
	schema: { [Key: string]: any };
    title: string;
    icon: string | undefined;
    placeholder: string | undefined;
    required: boolean | undefined;
    localization: boolean | undefined;
    display: Display;
};
export type Email_Params = {
	// Defines type of collections
	title: string;
	icon?: string;
	placeholder?: string;
	required?: boolean;
	localization?: boolean;
	display?: Display;
};
