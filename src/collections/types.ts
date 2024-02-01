import type widgets from '@src/components/widgets';
export let roles = ['admin', 'user', 'developer'] as const;
export type Roles = (typeof roles)[number];
type permissions = {
	[K in (typeof roles)[number]]?: { read?: boolean; write?: boolean };
};
export interface Schema {
	name?: string;
	icon?: string;
	fields: ReturnType<(typeof widgets)[keyof typeof widgets]>[];
	status?: 'published' | 'unpublished' | 'draft';
	permissions?: permissions;
}
