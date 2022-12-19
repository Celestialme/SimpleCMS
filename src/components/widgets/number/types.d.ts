import type { Display } from '../types';

export type Number_Field = {
	widget: () => {};
	schema: { [Key: string]: any };
	title: string;
    icon: string | undefined;
    placeholder: string | undefined;
    required: boolean | undefined;
    display: Display;
};
export type Number_Params = {
	title: string;
	icon?: string;
	placeholder?: string;
	required?: boolean;
	display?: Display;
};
