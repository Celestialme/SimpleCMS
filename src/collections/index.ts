import { get, writable, type Writable } from 'svelte/store';
import { type Schema, imports } from './types';
import axios from 'axios';
import { browser } from '$app/environment';

let collections: Writable<Array<Schema>> = writable([]);
let collection: Writable<Schema> = writable({ name: '', fields: [] } as Schema);
import { categories } from './config';
export async function setup() {
	let files;
	let _imports = {} as any;
	if (browser) {
		files = (await axios.get('/api/collections')).data;
	} else {
		let fs = (await import('fs')).default;
		files = fs.readdirSync('src/collections').filter((x) => !['index.ts', 'types.ts', 'Auth.ts', 'config.ts'].includes(x));
	}
	for (let file of files) {
		_imports[file.replace('.ts', '')] = (await import(`./${file}`)).default;
	}
	imports.set(_imports);
	collections.set(
		get(categories)
			.map((x) => x.collections)
			.reduce((x, acc) => x.concat(acc))
	); // returns all collections

	// current collection
}
let unAssigned = Object.values(imports).filter((x) => !get(collections).includes(x));

//use this unassigned array
export { categories, collection, unAssigned };
export default collections;
