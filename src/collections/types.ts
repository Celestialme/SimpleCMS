import type widgets from '@src/components/widgets';
export let roles = {
	admin: 'admin',
	user: 'user',
	developer: 'developer'
} as const;

type permissions = {
	[K in (typeof roles)[keyof typeof roles]]?: { read?: boolean; write?: boolean };
};
export interface Schema {
	name: string;
	icon?: string;
	fields: ReturnType<(typeof widgets)[keyof typeof widgets]>[];
	status?: 'published' | 'unpublished' | 'draft';
	permissions?: permissions;
}
