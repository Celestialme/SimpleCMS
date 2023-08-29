import { browser, building, dev } from '$app/environment';
import axios from 'axios';
import { writable, type Unsubscriber, type Writable } from 'svelte/store';
import '@src/components/widgets';
import { createCategories } from './config';

// Define writable stores and imports object
const categories: Writable<Array<any>> = writable();
const collections: Writable<Array<any>> = writable();
const unAssigned: Writable<Array<string>> = writable([]);

let imports: any = {};
let rnd = Math.random();

// Dynamic Import of Categories and Collections even from build system
export const updateCollections = async (recompile: boolean = false) => {
	if (recompile) rnd = Math.random();

	await getImports().then(async (imports) => {
		//console.log(imports);

		// Create categories using createCategories function and imports object
		let _categories = createCategories(imports);

		// If not running in development or building mode
		if (!dev && !building) {
			// Define config file name
			const config = 'config.js' + rnd;
			console.log('--------------------Config-Dynamic-Import---------------------------');

			const { createCategories } = browser
				? await import(/* @vite-ignore */ '/api/collections/' + config)
				: await import(/* @vite-ignore */ import.meta.env.collectionsFolderJS + config);

			// Create categories using new version of createCategories function and imports object
			_categories = createCategories(imports);
			//console.log(createCategories.toString());
		}

		// For each category Filter out undefined collections
		for (const _category of _categories) {
			_category.collections = _category.collections.filter((x) => !!x == true);
		}

		// Set value of categories store to array of categories
		console.log(_categories);
		categories.set(_categories);

		// Set value of collections store to array containing all collections from all categories
		collections.set(_categories.map((x) => x.collections).reduce((x, acc) => x.concat(acc)));
	});
};

updateCollections();

// Output unassigned collections
collections.subscribe((value) => {
	const unAssigned = Object.values(imports).filter((x) => !value.includes(x));
	console.log('unAssigned', unAssigned);
});

// Export stores and functions
export { categories, unAssigned };
export default collections;
export const collection = writable(collections?.[0]); // current collection

// Define getImports function to dynamically populate imports object
async function getImports(recompile: boolean = false) {
	// If imports object is not empty, return its current value
	if (Object.keys(imports).length && !recompile) return imports;
	imports = {};
	// If running in development or building mode
	if (dev || building) {
		// Dynamically import all TypeScript files in current directory, except for specified files
		const modules = import.meta.glob([
			'./*.ts',
			'!./index.ts',
			'!./types.ts',
			'!./Auth.ts',
			'!./config.ts'
		]);

		// Add imported modules to imports object
		for (const module in modules) {
			imports[module.replace('.ts', '').replace('./', '')] = (
				(await modules[module]()) as any
			).default;
		}

		// If not running in development or building mode
	} else {
		// If running in browser environment
		if (browser) {
			const files = ((await axios.get('/api/getCollections')) as any).data;
			// console.log('browser files', files);

			// Dynamically import returned files from /api/collections/
			for (const file of files) {
				imports[file.replace('.js', '')] = (
					await import(
						/* @vite-ignore */
						'/api/collections/' + file
					)
				).default;
			}

			// If not running in browser environment
		} else {
			const files = ((await axios.get('http://127.0.0.1:4173/api/getCollections')) as any).data;
			// console.log('server files', files);

			// Dynamically import returned files from folder specified by import.meta.env.collectionsFolder
			for (const file of files) {
				imports[file.replace('.js', '')] = (
					await import(
						/* @vite-ignore */
						'/api/collections/' + file
					)
				).default;
			}
		}
	}
	//console.log(imports);
	return imports;
}

let unsubscribe: Unsubscriber | undefined;

// Define getCollections function to return a promise that resolves with the value of the collections store

export async function getCollections() {
	// console.log('getting collections');
	return new Promise<any>((resolve) => {
		unsubscribe = collections.subscribe((collections) => {
			if (collections?.length > 0) {
				collection.set(collections[0]);
				unsubscribe && unsubscribe();
				unsubscribe = undefined;
				resolve(collections);
			}
		});
	});
}
