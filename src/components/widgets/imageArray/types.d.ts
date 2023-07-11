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

export let GuiSchema = {
	label: { type: String, required: true },
	display: { type: String, required: true },
	db_fieldName: { type: String, required: true },
	// widget?: any;
	// schema?: any;
	// translated: { type: Boolean, required: false },
	icon: { type: String, required: false },

	// Widget Specific parameters
	imageUploadTitle: { type: String, required: false },
	// fields: Widgets;
	required: { type: Boolean, required: false }
};
