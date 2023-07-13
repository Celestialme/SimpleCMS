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
	placeholder?: string;
	count?: number;
	minlength?: number;
	maxlength?: number;
	pattern?: string;
	size?: number;
	required?: boolean;
	readonly?: boolean;
	width?: string;
};

export let GuiSchema = {
	label: { type: String, required: true },
	display: { type: String, required: true },
	db_fieldName: { type: String, required: true },
	// widget?: any;
	// schema?: any;
	translated: { type: Boolean, required: false },
	icon: { type: String, required: false },

	// Widget Specific parameters
	placeholder: { type: String, required: false },
	count: { type: Number, required: false },
	minlength: { type: Number, required: false },
	maxlength: { type: Number, required: false },
	pattern: { type: String, required: false },
	size: { type: Number, required: false },
	required: { type: Boolean, required: false },
	readonly: { type: Boolean, required: false },
	width: { type: String, required: false }
};
