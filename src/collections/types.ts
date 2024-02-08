import type { Roles } from '@src/auth/types';
import type widgets from '@src/components/widgets';

type permissions = {
	[K in Roles]?: { read?: boolean; write?: boolean };
};
export interface Schema {
	name?: string;
	icon?: string;
	fields: ReturnType<(typeof widgets)[keyof typeof widgets]>[];
	status?: 'published' | 'unpublished' | 'draft';
	permissions?: permissions;
}
export type CollectionLabels = 'imageArray'|'media'|'Menu'|'Posts1'|'Posts2'|'Posts3'|'Relation'|'thumbs';