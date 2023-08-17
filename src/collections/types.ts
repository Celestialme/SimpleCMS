import type widgets from '@src/components/widgets';
import type { roles } from './Auth';
import { writable, type Writable } from 'svelte/store';

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
type Imports = 'ImageArray' | 'Media' | 'Menu' | 'Posts1' | 'Posts2' | 'Posts3' | 'Relation' | 'thumbs';
export let imports = writable({}) as Writable<{ [Key in Imports]: Schema }>;
