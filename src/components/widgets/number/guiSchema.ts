export const GuiSchema = {
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
	step: { type: Number, required: false },
	negative: { type: Boolean, required: false },
	prefix: { type: String, required: false },
	suffix: { type: String, required: false },
	required: { type: Boolean, required: false },
	readonly: { type: Boolean, required: false },
	width: { type: String, required: false },
	currencyCode: { type: String, required: false }
};
