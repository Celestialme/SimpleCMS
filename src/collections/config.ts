import { get, writable, type Writable } from 'svelte/store';

export const categories: Writable<{ name: string; icon: string; collections: any[] }[]> = writable(
	[]
);

import { imports } from '@src/collections/types';

// typesafe-i18n
import LL from '@src/i18n/i18n-svelte';

// TODO Add translations
imports.subscribe((imports) => {
	if (!imports) return;
	categories.set([
		{
			name: get(LL).CollectionCategory_Collection(),
			icon: 'bi:collection',
			collections: [imports.Posts, imports.Names, imports.WidgetTest]
		},
		{
			name: 'posts',
			icon: 'bi:images',
			collections: [imports.Posts2, imports.ImageArray, imports.Relation, imports.Media]
		},
		{
			name: get(LL).CollectionCategory_Menu(),
			icon: 'bi:menu-button-wide',
			collections: [imports.Menu]
		}
	]);
});
