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
	count?: number;
	minlength?: number;
	maxlength?: number;
	prefix?: string;
	suffix?: string;
	required?: boolean;
	readonly?: boolean;
	disabled?: boolean;
	localization?: boolean;
	width?: string;
};
