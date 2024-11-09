import { defaultPermissions, type CollectionTypes, type Schema } from '@src/collections/types';

import deepmerge from 'deepmerge';

export function loadModules() {
	const modules: any = import.meta.glob(
		['./**/*.ts', '!./index.ts', '!./types.ts', '!./config.ts'],
		{
			eager: true
		}
	);

	let _categories: {
		[key: string]: {
			is_category: boolean;
		} & Schema;
	} = {};
	let _collections = {} as {
		[keyof in keyof CollectionTypes]: Schema;
	};
	for (let module in modules) {
		let path = module.replace(/.ts$/, '').replace('./', '');
		let collection = modules[module].default;
		parseCategories(collection, path, _categories);
		collection.name = path.split('/').slice(-1)[0];
		path = path.replaceAll('/', '::');
		collection.path = path;
		!collection.icon && (collection.icon = 'iconoir:info-empty');

		_collections[path] = collection;
		_collections[path].permissions = deepmerge(defaultPermissions, collection.permissions || {});
	}
	return { collections: _collections, categories: _categories };
}
function parseCategories(collection, name: string, categories) {
	let path = name.split('/');
	let temp;
	for (let i = 0; i < path.length; i++) {
		if (i == 0) {
			!categories[path[i]] && (categories[path[i]] = { is_category: true });
			temp = categories[path[i]];
		} else if (i != path.length - 1) {
			!temp[path[i]] && (temp[path[i]] = { is_category: true });
			temp = temp[path[i]];
		} else {
			temp[path[i]] = collection;
		}
	}
}
