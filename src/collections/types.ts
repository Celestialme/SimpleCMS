import type { roles } from './Auth';

type permissions = {
	[K in (typeof roles)[keyof typeof roles]]?: { read?: boolean; write?: boolean };
};
export interface Schema {
	name: string;
	icon?: string;
	fields: Array<any>;
	status?: 'published' | 'unpublished' | 'draft';
	permissions?: permissions;
}
