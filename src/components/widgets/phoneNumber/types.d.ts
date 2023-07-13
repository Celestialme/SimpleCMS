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
