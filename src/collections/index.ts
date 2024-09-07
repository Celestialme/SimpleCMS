import { defaultPermissions, type CollectionTypes, type Schema } from '@src/collections/types';
import { initWidgets } from '@src/components/widgets';
import { categories, collections } from '@src/stores/load';
import deepmerge from 'deepmerge';
import { get, type Unsubscriber } from 'svelte/store';
initWidgets();
async function setCollections() {
	const modules = import.meta.glob(['./**/*.ts', '!./index.ts', '!./types.ts', '!./config.ts']);
	let _categories = {};
	let _collections = {};
	collections.set({} as any);
	for (let module in modules) {
		let path = module.replace(/.ts$/, '').replace('./', '');
		let collection = ((await modules[module]()) as any).default;
		parseCategories(collection, path, _categories);
		collection.name = path.split('/').slice(-1)[0];
		path = path.replaceAll('/', '::');
		collection.path = path;
		!collection.icon && (collection.icon = 'iconoir:info-empty');

		_collections[path] = collection;
		_collections[path].permissions = deepmerge(defaultPermissions, collection.permissions || {});
	}
	categories.set(_categories as any);
	collections.set(_collections as any);
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

setCollections();

let unsubscribe: Unsubscriber | undefined;
export async function getCollections() {
	return new Promise<{ [keyof in keyof CollectionTypes]: Schema }>((resolve) => {
		unsubscribe = collections.subscribe((collections) => {
			if (Object.keys(collections)?.length > 0) {
				unsubscribe && unsubscribe();
				unsubscribe = undefined;
				resolve(collections);
			}
		});
	});
}
