export type Params = {
	// default required parameters
	label: string;
	display?: DISPLAY;
	db_fieldName?: string;
	widget?: any;
	schema?: any;
	translated: boolean;

	// Widget Specific parameters
	icon?: string;
	placeholder?: string;
	required?: boolean;
	localization?: boolean;
	width?: string;
};
