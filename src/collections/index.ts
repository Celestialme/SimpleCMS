import { browser, building, dev } from '$app/environment';
import axios from 'axios';
import { createCategories } from './config';
import { getCollectionFiles } from '@src/routes/api/getCollections/getCollectionFiles';
import { categories, collections, unAssigned } from '@src/stores/load';
import type { Unsubscriber } from 'svelte/store';
import { initWidgets } from '@src/components/widgets';
import type { Schema } from './types';
initWidgets();
let imports: { [Key: string]: Schema } = {};
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
		let _collections = _categories.map((x) => x.collections).reduce((x, acc) => x.concat(acc));
		categories.set(_categories);
		collections.set(_collections); // returns all collections
		unAssigned.set(Object.values(imports).filter((x) => !_collections.includes(x)));
	});
};
updateCollections();

export { categories };

async function getImports(recompile: boolean = false) {
	if (Object.keys(imports).length && !recompile) return imports;
	imports = {};
	if (dev || building) {
		let modules = import.meta.glob(['./*.ts', '!./index.ts', '!./types.ts', '!./Auth.ts', '!./config.ts']);
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
				let collection = (await import(import.meta.env.collectionsFolderJS + file + '?' + rnd)).default;
				collection.name = name;
				!collection.icon && (collection.icon = 'iconoir:info-empty');
				imports[name] = collection;
			}
		}
	}

	return imports;
}
let unsubscribe: Unsubscriber | undefined;
export async function getCollections() {
	return new Promise<Schema[]>((resolve) => {
		unsubscribe = collections.subscribe((collections) => {
			if (collections?.length > 0) {
				unsubscribe && unsubscribe();
				unsubscribe = undefined;
				resolve(collections);
			}
		});
	});
}
