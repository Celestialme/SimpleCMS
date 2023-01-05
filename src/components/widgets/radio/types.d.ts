import type { Display } from '../types';

export type Radio_Field = {
	widget: () => {};
	schema: { [Key: string]: any };
	title: string;
	icon: string | undefined;
	color: string | undefined;
	width: string | undefined;
	required: boolean | undefined;
	display: Display;
};
export type Radio_Params = {
	title: string;
	icon?: string;
	color?: string;
	width?: string;
	required?: boolean;
	display?: Display;
};
