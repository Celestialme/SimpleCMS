import { browser, building, dev } from '$app/environment';
import axios from 'axios';
import { writable, type Unsubscriber, type Writable } from 'svelte/store';
import '@src/components/widgets';
import { createCategories } from './config';
import { getCollectionFiles } from '@src/routes/api/getCollections/getCollectionFiles';
let categories: Writable<Array<any>> = writable();
let collections: Writable<Array<any>> = writable();
let imports: any = {};
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
		categories.set(_categories);
		collections.set(_categories.map((x) => x.collections).reduce((x, acc) => x.concat(acc))); // returns all collections
	});
};
updateCollections();
// let unAssigned = Object.values(allCollections).filter((x) => !collections.includes(x));

//use this unassigned array

export { categories };
export default collections;
export let collection = writable(collections?.[0]); // current collection

async function getImports(recompile: boolean = false) {
	if (Object.keys(imports).length && !recompile) return imports;
	imports = {};
	if (dev || building) {
		let modules = import.meta.glob(['./*.ts', '!./index.ts', '!./types.ts', '!./Auth.ts', '!./config.ts']);
		for (let module in modules) {
			let name = module.replace(/.ts$/, '').replace('./', '');
			let collection = ((await modules[module]()) as any).default;
			collection.name = name;
			imports[name] = collection;
		}
	} else {
		if (browser) {
			let files = ((await axios.get('/api/getCollections')) as any).data;
			for (let file of files) {
				let name = file.replace(/.js$/, '');
				let collection = (await import('/api/importCollection/' + file + '?' + rnd)).default;
				collection.name = name;
				imports[name] = collection;
			}
		} else {
			let files = getCollectionFiles();
			for (let file of files) {
				let name = file.replace(/.js$/, '');
				let collection = (await import(import.meta.env.collectionsFolderJS + file + '?' + rnd)).default;
				collection.name = name;
				imports[name] = collection;
			}
		}
	}

	return imports;
}
let unsubscribe: Unsubscriber | undefined;
export async function getCollections() {
	return new Promise<any>((resolve) => {
		unsubscribe = collections.subscribe((collections) => {
			if (collections?.length > 0) {
				unsubscribe && unsubscribe();
				unsubscribe = undefined;
				resolve(collections);
			}
		});
	});
}
