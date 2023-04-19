import ImageUpload from '@src/components/widgets/imageUpload';
type Widgets = [ReturnType<typeof ImageUpload>, ...any];
export type Params = {
	db_fieldName?: string;
	label: string;
	imageUploadTitle: string;
	icon?: string;
	required?: boolean;
	schema?: any;
	widget?: any;
	fields: Widgets;
	display?: (data: any, field: any, entry: any) => Promise<any>;
};
