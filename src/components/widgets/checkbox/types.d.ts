import type { Display } from '../types';

export type Checkbox_Field = {
	widget: () => {};
	schema: { [Key: string]: any };
	title: string;
    icon: string | undefined;
    color: string | undefined;
    required: boolean | undefined;
    display: Display;
};
export type Checkbox_Params = {
	// Defines type of collections
	title: string;
	icon?: string;
	color?: string;
	required?: boolean;
	display?: Display;
};
