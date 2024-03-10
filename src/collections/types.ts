import { roles, type Roles } from '@src/auth/types';
import type widgets from '@src/components/widgets';

export let permissions = ['read', 'write'] as const;

export let basePermissions = roles.reduce((acc, role) => {
	return {
		...acc,
		[role]: permissions.reduce((acc, permission) => {
			return { ...acc, [permission]: false };
		}, {}),
		admin: permissions.reduce((acc, permission) => {
			return { ...acc, [permission]: true };
		}, {})
	} as Permissions;
}, {} as Permissions);

type Permissions = {
	[K in Roles]?: { [permissions in (typeof permissions)[number]]?: boolean };
};
export interface Schema {
	name?: string;
	icon?: string;
	fields: ReturnType<(typeof widgets)[keyof typeof widgets]>[];
	status?: 'published' | 'unpublished' | 'draft';
	permissions?: Permissions;
}
export type CollectionLabels = 'imageArray' | 'media' | 'Menu' | 'Menu1' | 'Menu2' | 'Posts1' | 'Posts2' | 'Posts3' | 'Relation' | 'thumbs';
