import type { CollectionNames, Schema } from './types';

export function createCategories(collections: { [key in CollectionNames]: Schema }) {
	return [
		{
			name: 'Collections',
			icon: 'bi:collection',
			collections: [collections.About, collections.News, collections.thumbs]
		},
		{
			name: 'posts',
			icon: 'bi:images',
			collections: [
				collections.Relation,
				collections.Posts2,
				collections.Posts3,
				collections.Posts32,
				collections.Posts31
			]
		},
		{
			name: 'Menus',
			icon: 'bi:images',
			collections: [collections.Menu, collections.Menu1, collections.Menu2]
		}
	];
}
