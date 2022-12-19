import type { Display } from '../types';

export type ImageUpload_Field = {
	widget: () => {};
	schema: { [Key: string]: any };
	title:string;
	upload: true;
	path:string;
	display:Display;
};
export type ImageUpload_Params = {
	title: string;
	path: string;
	display?: Display;
};
