import { roles, type Roles } from '@src/auth/types';
import type widgets from '@src/components/widgets';

export let permissions = ['read', 'write'] as const;

export let defaultPermissions = roles.reduce((acc, role) => {
	return {
		...acc,
		[role]: permissions.reduce((acc, permission) => {
			switch (role) {
				case 'admin':
				case 'editor':
					return { ...acc, [permission]: true };
				case 'user':
					return { ...acc, [permission]: true, write: false };
				default:
					return { ...acc, [permission]: false };
			}
		}, {})
	} as Permissions;
}, {} as Permissions);

export type Permissions = {
	[K in Roles]: { [permissions in (typeof permissions)[number]]?: boolean };
};
export interface Schema {
	id: string;
	path?: string;
	hidden?: boolean;
	label?: string;
	links?: Array<keyof CollectionTypes>;
	icon?: string;
	fields: ReturnType<(typeof widgets)[keyof typeof widgets]>[];
	status?: 'published' | 'unpublished' | 'draft';
	permissions?: Partial<Permissions>;
}

export let sanitizePermissions = (permissions) => {
	let res = Object.keys(permissions).reduce((acc, r) => {
		acc[r] = Object.keys(permissions[r]).reduce((acc, p) => {
			if (permissions[r][p] != defaultPermissions[r][p]) {
				acc[p] = permissions[r][p];
			}
			return acc;
		}, {});
		if (Object.keys(acc[r]).length == 0) delete acc[r];
		return acc;
	}, {});
	if (Object.keys(res).length == 0) return undefined;
	return res;
};

export type CollectionTypes = {"ca::sm":["relation"],"ca::sm2":["Text","image"]};