import { browser, building, dev } from '$app/environment';
import axios from 'axios';
import { createCategories } from './config';
import { getCollectionFiles } from '@src/routes/api/getCollections/getCollectionFiles';
import { categories, collections, unAssigned } from '@src/stores/load';
import type { Unsubscriber } from 'svelte/store';
import { initWidgets } from '@src/components/widgets';
import { defaultPermissions, type CollectionNames, type Schema } from './types';
import deepmerge from 'deepmerge';
initWidgets();
let imports = {} as { [key in CollectionNames]: Schema };
let rnd = Math.random();
export let updateCollections = async (recompile: boolean = false) => {
	if (recompile) rnd = Math.random();

	await getImports(recompile).then(async (imports) => {
		let _categories = createCategories(imports);

		if (!dev && !building) {
			const config = 'config.js?' + rnd;
			let { createCategories } = browser
				? await import('/api/importCollection/' + config)
				: await import(import.meta.env.collectionsFolderJS + config);
			_categories = createCategories(imports);
		}
		for (let _category of _categories) {
			_category.collections = _category.collections.filter((x) => !!x == true);
		}
		let _collections = _categories
			.map((x) => x.collections)
			.reduce((acc, x) => acc.concat(x))
			.reduce(
				(acc, x) => {
					acc[x.name as string] = x;
					return acc;
				},
				{} as { [key in CollectionNames]: Schema }
			);
		categories.set(_categories);
		collections.set(_collections); // returns all collections
		unAssigned.set(Object.values(imports).filter((x) => !Object.values(_collections).includes(x)));
	});
};
updateCollections();

export { categories };

async function getImports(recompile: boolean = false) {
	if (Object.keys(imports).length && !recompile) return imports;
	imports = {} as { [key in CollectionNames]: Schema };
	if (dev || building) {
		let modules = import.meta.glob([
			'./*.ts',
			'!./index.ts',
			'!./types.ts',
			'!./Auth.ts',
			'!./config.ts'
		]);
		for (let module in modules) {
			let name = module.replace(/.ts$/, '').replace('./', '');
			let collection = ((await modules[module]()) as any).default;
			collection.name = name;
			!collection.icon && (collection.icon = 'iconoir:info-empty');
			imports[name] = collection;
		}
	} else {
		if (browser) {
			let files = ((await axios.get('/api/getCollections')) as any).data;
			for (let file of files) {
				let name = file.replace(/.js$/, '');
				let collection = (await import('/api/importCollection/' + file + '?' + rnd)).default;
				collection.name = name;
				!collection.icon && (collection.icon = 'iconoir:info-empty');
				imports[name] = collection;
			}
		} else {
			let files = getCollectionFiles();
			for (let file of files) {
				let name = file.replace(/.js$/, '');
				let collection = (await import(import.meta.env.collectionsFolderJS + file + '?' + rnd))
					.default;
				collection.name = name;
				!collection.icon && (collection.icon = 'iconoir:info-empty');
				imports[name] = collection;
			}
		}
	}
	for (let key in imports) {
		let collection = imports[key];
		collection.permissions = deepmerge(defaultPermissions, collection.permissions || {});
	}
	return imports;
}
let unsubscribe: Unsubscriber | undefined;
export async function getCollections() {
	return new Promise<{ [key in CollectionNames]: Schema }>((resolve) => {
		unsubscribe = collections.subscribe((collections) => {
			if (Object.keys(collections)?.length > 0) {
				unsubscribe && unsubscribe();
				unsubscribe = undefined;
				resolve(collections);
			}
		});
	});
}
