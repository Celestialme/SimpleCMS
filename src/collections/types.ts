import type widgets from '@src/components/widgets';
// TODO: would be nice to get this into environment file
// Define Available Roles with Icons

// export const roles = {
// 	admin: { name: 'admin', icon: 'material-symbols:verified-outline' },
// 	developer: { name: 'developer', icon: 'material-symbols:supervised-user-circle' },
// 	editor: { name: 'editor', icon: 'mdi:user-edit' },
// 	user: { name: 'user', icon: 'material-symbols:supervised-user-circle' }
// } as const;

export const roles = {
	admin: 'admin',
	developer: 'developer',
	editor: 'editor',
	user: 'user'
} as const;

// Define a new `permissions` type using a mapped type for read & write
// The `admin` role has a default exception, with both `read` and `write`
//TODO: dd Default security
// type permissions = {
// 	[K in (typeof roles)[keyof typeof roles]]: {
// 		read: boolean;
// 		write: boolean;
// 	} & (K extends typeof roles.admin ? { read: true; write: true } : {});
// };
type permissions = {
	[K in (typeof roles)[keyof typeof roles]]?: {
		read?: boolean;
		write?: boolean;
	};
};

// Define a new `Schema` interface that represents the shape of an object with several properties
export interface Schema {
	permissions?: permissions;
	name?: string;
	icon?: string;
	slug?: string;
	fields: ReturnType<(typeof widgets)[keyof typeof widgets]>[];
	strict?: boolean;
	status?: 'published' | 'unpublished' | 'draft' | 'schedule' | 'cloned';
}
