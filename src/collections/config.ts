import { writable, type Writable } from 'svelte/store';

export const categories: Writable<{ name: string; icon: string; collections: any[] }[]> = writable(
	[]
);

import { imports } from '@src/collections/types';

//TODO wont work wih Graphql it i18n is used for name translation
imports.subscribe((imports) => {
	if (!imports) return;
	categories.set([
		{
			name: 'Collections',
			icon: 'bi:collection',
			collections: [imports.Posts, imports.Names, imports.WidgetTest]
		},
		{
			name: 'Posts',
			icon: 'bi:images',
			collections: [imports.Posts2, imports.ImageArray, imports.Relation, imports.Media]
		},
		{
			name: 'Menu',
			icon: 'bi:menu-button-wide',
			collections: [imports.Menu]
		}
	]);
});
