export type Params = {
	label: string;
	display?: (data: any, field: any, entry: any) => Promise<any>;
	db_fieldName?: string;
	widget?: any;
	schema?: any;

	// extras
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
