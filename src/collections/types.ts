import type widgets from '@src/components/widgets';
import type { roles } from './Auth';

type permissions = {
	[K in (typeof roles)[keyof typeof roles]]?: { read?: boolean; write?: boolean };
};

export interface Schema {
	name: string;
	permissions?: permissions;
	icon?: string;
	slug?: string;
	fields: ReturnType<(typeof widgets)[keyof typeof widgets]>[];
	strict?: boolean;
	status?: 'published' | 'unpublished' | 'draft' | 'schedule' | 'cloned';
}
