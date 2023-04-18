export type Params = {
	label: string;
	display?: (data: any, field: any, entry: any) => Promise<any>;
	db_fieldName?: string;
	widget?: any;
	schema?: any;
};
