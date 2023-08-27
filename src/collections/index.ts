import { browser, building, dev } from '$app/environment';
import axios from 'axios';
import { writable, type Writable } from 'svelte/store';
import '@src/components/widgets';
import { createCategories } from './config';
let categories: Writable<Array<any>> = writable();
let collections: Writable<Array<any>> = writable();
let imports: any = {};
getImports().then(async (imports) => {
	console.log(imports);
	let _categories = createCategories(imports);
	if (!dev && !building) {
		const config = 'config.js';
		console.log('-----------------------------------------------------');
		let { createCategories } = browser ? await import('/api/collections/' + config) : await import(import.meta.env.collectionsFolder + config);
		_categories = createCategories(imports);
	}
	for (let _category of _categories) {
		_category.collections = _category.collections.filter((x) => !!x == true);
	}
	categories.set(_categories);
	collections.set(_categories.map((x) => x.collections).reduce((x, acc) => x.concat(acc))); // returns all collections
});
// let unAssigned = Object.values(allCollections).filter((x) => !collections.includes(x));

//use this unassigned array

export { categories };
export default collections;
export let collection = writable(collections?.[0]); // current collection

async function getImports() {
	if (Object.keys(imports).length) return imports;

	if (dev || building) {
		let modules = import.meta.glob(['./*.ts', '!./index.ts', '!./types.ts', '!./Auth.ts', '!./config.ts']);
		for (let module in modules) {
			imports[module.replace('.ts', '').replace('./', '')] = ((await modules[module]()) as any).default;
		}
	} else {
		if (browser) {
			let files = ((await axios.get('/api/getCollections')) as any).data;
			for (let file of files) {
				imports[file.replace('.js', '')] = (await import('/api/collections/' + file)).default;
			}
		} else {
			let files = ((await axios.get('http://127.0.0.1:3000/api/getCollections')) as any).data;
			for (let file of files) {
				imports[file.replace('.js', '')] = (await import(import.meta.env.collectionsFolder + file)).default;
			}
		}
	}
	console.log(imports);

	return imports;
}
export async function getCollections() {
	return new Promise<any>((resolve) => {
		collections.subscribe((collections) => {
			if (collections?.length > 0) {
				resolve(collections);
			}
		});
	});
}
