import { writable, type Writable } from 'svelte/store';
let categories: Writable<Array<any>> = writable();
let collections: Writable<Array<any>> = writable();
let imports: any = {};
getImports().then((imports) => {
	console.log(imports);
	let _categories = [
		{
			name: 'Collections',
			icon: 'bi:collection',
			collections: [imports.Posts2, imports.Posts3, imports.Thumbs]
		},
		{
			name: 'posts',
			icon: 'bi:images',
			collections: [imports.Posts1, imports.ImageArray, imports.Menu, imports.Relation, imports.Media]
		}
	];
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
	// let files = fs.readdirSync('build/collections').filter((x) => !['index.ts', 'types.ts', 'Auth.ts', 'config.ts'].includes(x));
	// for (let file of files) {
	// 	let name = file.replace('.ts', '');
	// 	imports[name] = await import('src/collections/' + file);
	// }

	let modules = import.meta.glob(['./*.ts', '!./index.ts', '!./types.ts', '!./Auth.ts', '!./config.ts']);

	console.log('_modules', modules);
	for (let module in modules) {
		imports[module.replace('.ts', '').replace('./', '')] = ((await modules[module]()) as any).default;
	}
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
