import type { Display } from '../types';

export type Text_Field = {
	widget: () => {};
	schema: { [Key: string]: any };
	title: string;
	icon: string | undefined;
	placeholder: string | undefined;
	count: string | undefined;
	prefix: string | undefined;
	suffix: string | undefined;
	required: boolean | undefined;
	localization: boolean | undefined;
	width: string | undefined;
	display: Display;
};
export type Text_Params = {
	title: string;
	icon?: string;
	placeholder?: string;
	count?: string;
	prefix?: string;
	suffix?: string;
	required?: boolean;
	localization?: boolean;
	width: string;
	display?: Display;
};
