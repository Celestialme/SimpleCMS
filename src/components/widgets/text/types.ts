export type Params = {
	label: string;
	display?: DISPLAY;
	db_fieldName?: string;
	translated?: boolean;
};

export let GuiSchema = {
	label: { type: String, required: true },
	display: { type: String, required: true },
	db_fieldName: { type: String, required: true },
	translated: { type: Boolean, required: false }
};
