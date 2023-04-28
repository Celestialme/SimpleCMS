export interface Schema {
	name: string;
	icon?: string;
	fields: Array<any>;
	status?: 'published' | 'unpublished' | 'draft';
}
