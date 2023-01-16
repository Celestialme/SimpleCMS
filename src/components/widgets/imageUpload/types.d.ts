import type { Display } from '../types';

export type ImageUpload_Field = {
	widget: () => {};
	schema: { [Key: string]: any };
	db_fieldName:string;
	upload: true;
	path:string;
	display:Display;
};
export type ImageUpload_Params = {
	db_fieldName: string;
	path: string;
	display?: Display;
};
