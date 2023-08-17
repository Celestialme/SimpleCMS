import { writable, type Writable } from 'svelte/store';
export let categories: Writable<{ name: string; icon: string; collections: any[] }[]> = writable([]);
import { imports } from '@src/collections/types';

imports.subscribe((imports) => {
	if (!imports) return;
	categories.set([
		{
			name: 'Collections',
			icon: 'bi:collection',
			collections: [imports.Posts2, imports.Posts3, imports.thumbs]
		},
		{
			name: 'posts',
			icon: 'bi:images',
			collections: [imports.Posts1, imports.ImageArray, imports.Menu, imports.Relation, imports.Media]
		}
	]);
});
