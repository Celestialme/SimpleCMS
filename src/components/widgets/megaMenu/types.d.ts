export type Params = {
	label: string;
	display?: DISPLAY;
	db_fieldName?: string;
	widget?: any;
	schema?: { [Key: string]: any };
	translated?: boolean;
	// Widget Specific parameters
	menu: any[];
};
