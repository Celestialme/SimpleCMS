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