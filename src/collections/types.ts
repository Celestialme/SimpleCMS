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

export type CollectionNames =
	| 'imageArray'
	| 'media'
	| 'Menu'
	| 'Menu1'
	| 'Menu2'
	| 'Posts1'
	| 'Posts2'
	| 'Posts3'
	| 'Relation'
	| 'thumbs';




export type CollectionContent = {"imageArray":"ImageArray","media":"image","Menu":"Menu","Menu1":"Menu","Menu2":"Menu","Posts1":"email"|"text"|"image","Posts2":"RichText","Posts3":"text 1"|"text 2"|"text 3"|"text 4"|"text 5","Relation":"info"|"relation2","thumbs":"Image"};