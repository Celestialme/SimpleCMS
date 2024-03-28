import { roles, type Roles } from '@src/auth/types';
import type widgets from '@src/components/widgets';

export let permissions = ['read', 'write'] as const;

export let basePermissions = roles.reduce((acc, role) => {
	return {
		...acc,
		[role]: permissions.reduce((acc, permission) => {
			return { ...acc, [permission]: true };
		}, {})
	} as Permissions;
}, {} as Permissions);

export type Permissions = {
	[K in Roles]?: { [permissions in (typeof permissions)[number]]?: boolean };
};
export interface Schema {
	name?: string;
	icon?: string;
	fields: ReturnType<(typeof widgets)[keyof typeof widgets]>[];
	status?: 'published' | 'unpublished' | 'draft';
	permissions?: Permissions;
}

export let sanitizePermissions = (permissions) => {
	let res = Object.keys(permissions).reduce((acc, r) => {
		acc[r] = Object.keys(permissions[r]).reduce((acc, p) => {
			if (permissions[r][p] == false) {
				acc[p] = false;
			}
			return acc;
		}, {});
		if (Object.keys(acc[r]).length == 0) delete acc[r];
		return acc;
	}, {});
	if (Object.keys(res).length == 0) return undefined;
	return res;
};

export type CollectionLabels = 'imageArray' | 'media' | 'Menu' | 'Menu1' | 'Menu2' | 'Posts1' | 'Posts2' | 'Posts3' | 'Relation' | 'thumbs';
