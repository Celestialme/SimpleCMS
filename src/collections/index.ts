import { get, writable, type Writable } from 'svelte/store';
import { type Schema, imports } from './types';
import axios from 'axios';
import { browser, dev } from '$app/environment';
let collections: Writable<Array<Schema>> = writable([]);
let collection: Writable<Schema> = writable({ name: '', fields: [] } as Schema);
import { categories } from './config';
import { getCollections } from '@src/routes/api/collections/getCollections';
export async function setup() {
	let files;
	if (browser) {
		files = (await axios.get('/api/collections')).data;
	} else {
		files = getCollections();
	}
	console.log(files);
	let _imports = {} as any;

	for (let file in files) {
		if (dev) {
			_imports[file.replace('.ts', '')] = (await import(`./${file}`)).default;
		} else {
			const blob = new Blob([files[file]], { type: 'application/javascript' });
			const blobUrl = URL.createObjectURL(blob);

			_imports[file.replace('.ts', '').replace('.js', '')] = (await import(blobUrl)).default;
		}
	}
	imports.set(_imports);

	collections.set(
		get(categories)
			.map((x) => x.collections)
			.reduce((x, acc) => x.concat(acc))
	); // returns all collections

	// current collection
}
setup();
if (get(collections).length == 0) setup();
let unAssigned = Object.values(imports).filter((x) => !get(collections).includes(x));

//use this unassigned array
export { categories, collection, unAssigned };
export default collections;
