export let GuiSchema = {
	label: { type: String, required: true },
	display: { type: String, required: true },
	db_fieldName: { type: String, required: true },
	// widget?: any;
	// schema?: any;
	// translated: { type: Boolean, required: false },
	// icon: { type: String, required: false },

	// Widget Specific parameters
	path: { type: String, required: false }
};
