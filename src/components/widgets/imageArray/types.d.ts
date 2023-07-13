import ImageUpload from '@src/components/widgets/imageUpload';
type Widgets = [ReturnType<typeof ImageUpload>, ...any];
export type Params = {
	label: string;
	display?: DISPLAY;
	db_fieldName?: string;
	widget?: any;
	schema?: any;
	icon?: string;

	// Widget Specific parameters
	imageUploadTitle: string;
	fields: Widgets;
	required?: boolean;
};
