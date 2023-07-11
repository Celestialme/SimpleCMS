export type Params = {
	// default required parameters
	label: string;
	display?: DISPLAY;
	db_fieldName?: string;
	widget?: any;
	schema?: any;
	translated?: boolean;
	icon?: string;

	// Widget Specific parameters
	color?: string;
	required?: boolean;
	width?: string;
};

export let GuiSchema = {
	label: { type: String, required: true },
	display: { type: String, required: true },
	db_fieldName: { type: String, required: true },
	translated: { type: Boolean, required: false },
	icon: { type: String, required: false },

	// Widget Specific parameters
	color: { type: String, required: false },
	required: { type: Boolean, required: false },
	width: { type: String, required: false }
};
