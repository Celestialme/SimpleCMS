export const GuiSchema = {
	label: { type: String, required: true },
	display: { type: String, required: true },
	db_fieldName: { type: String, required: true }

	// Widget Specific parameters
	// widget: { type: any, required: false },
	// schema: { type: any, required: false },
	// relation: { type: Schema, required: true }
};
