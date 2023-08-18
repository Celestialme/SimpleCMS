import { get, writable, type Writable } from 'svelte/store';
import { type Schema, imports } from './types';
import axios from 'axios';
import { browser } from '$app/environment';
import { categories } from './config';

const collections: Writable<Array<Schema>> = writable([]);
const collection: Writable<Schema> = writable({ name: '', fields: [] } as Schema);

async function setup() {
	let files: any;
	const _imports = {} as any;
	if (browser) {
		files = (await axios.get('/api/collections')).data;
	} else {
		const fs = (await import('fs')).default;
		files = fs
			.readdirSync('src/collections')
			.filter((x) => !['index.ts', 'types.ts', 'Auth.ts', 'config.ts'].includes(x));
	}
	for (const file of files) {
		_imports[file.replace('.ts', '')] = (await import(/* @vite-ignore */ `./${file}`)).default;
	}
	imports.set(_imports);
	collections.set(
		get(categories)
			.map((x) => x.collections)
			.reduce((x, acc) => x.concat(acc))
	); // returns all collections

	// current collection
}
const unAssigned = Object.values(imports).filter((x) => !get(collections).includes(x));
setup();

//use this unassigned array
export { categories, collection, unAssigned };
export default collections;
