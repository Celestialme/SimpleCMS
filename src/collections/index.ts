import { browser, building, dev } from '$app/environment';
import axios from 'axios';
import { writable, type Writable } from 'svelte/store';
import '@src/components/widgets';
import { createCategories } from './config';

// Define writable stores and imports object
const categories: Writable<Array<any>> = writable();
const collections: Writable<Array<any>> = writable();
const imports: any = {};

// Dynamic Import of Categories and Collections even from build system
getImports().then(async (imports) => {
	//console.log(imports);

	// Create categories using createCategories function and imports object
	let _categories = createCategories(imports);

	// If not running in development or building mode
	if (!dev && !building) {
		// Define config file name
		const config = 'config.js';
		console.log('--------------------Config-Dynamic-Import---------------------------');

		// Dynamically import createCategories function from either /api/collections/ or folder specified by import.meta.env.collectionsFolder
		const { createCategories } = browser
			? await import(
					/* @vite-ignore */
					'/api/collections/' + config
			  )
			: await import(
					/* @vite-ignore */
					import.meta.env.collectionsFolder + config
			  );

		// Create categories using new version of createCategories function and imports object
		_categories = createCategories(imports);
	}

	// For each category Filter out undefined collections
	for (const _category of _categories) {
		_category.collections = _category.collections.filter((x) => !!x == true);
	}

	// Set value of categories store to array of categories
	categories.set(_categories);
	// Set value of collections store to array containing all collections from all categories
	collections.set(_categories.map((x) => x.collections).reduce((x, acc) => x.concat(acc)));
});

// use this unassigned array
// const unAssigned = Object.values(collection).filter((x) => !collections.includes(x));

// Export stores and functions
export { categories };
export default collections;
export const collection = writable(collections?.[0]); // current collection

// Define getImports function to dynamically populate imports object
async function getImports() {
	// If imports object is not empty, return its current value
	if (Object.keys(imports).length) return imports;

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
			const files = ((await axios.get('http://127.0.0.1:3000/api/getCollections')) as any).data;
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

// Define getCollections function to return a promise that resolves with the value of the collections store
export async function getCollections() {
	return new Promise<any>((resolve) => {
		// Subscribe to changes in collections store
		collections.subscribe((collections) => {
			// If collections store is non-empty, resolve promise with its value
			if (collections?.length > 0) {
				resolve(collections);
			}
		});
	});
}
