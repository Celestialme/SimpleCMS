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
	currencyCode: string;
	placeholder?: string;
	count?: number;
	minlength?: number;
	maxlength?: number;
	step?: number;
	negative?: boolean;
	prefix?: string;
	suffix?: string;
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
	currencyCode: { type: String, required: false },
	placeholder: { type: String, required: false },
	count: { type: number, required: false },
	minlength: { type: number, required: false },
	maxlength: { type: number, required: false },
	step: { type: number, required: false },
	negative: { type: Boolean, required: false },
	prefix: { type: String, required: false },
	suffix: { type: String, required: false },
	required: { type: Boolean, required: false },
	readonly: { type: Boolean, required: false },
	width: { type: String, required: false }
};
