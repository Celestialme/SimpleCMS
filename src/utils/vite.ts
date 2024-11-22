import fs from 'fs';
export async function generateCollectionTypes(server) {
	let collections = (await server.ssrLoadModule('@src/stores/store.svelte.ts')).collections;
	let collectionTypes = {};
	for (let key in collections()) {
		let collection = collections()[key];
		let fields: string[] = [];
		for (let field of collection.fields) {
			let fieldName = field.db_fieldName || field.label;
			fields.push(fieldName);
		}
		collectionTypes[collection.path] = fields;
	}
	let types = fs.readFileSync('src/collections/types.ts', 'utf-8');
	types = types.replace(/\n*export\s+type\s+CollectionTypes\s?=\s?.*?};/gms, '');
	types += '\n' + 'export type CollectionTypes = ' + JSON.stringify(collectionTypes) + ';';

	fs.writeFileSync('src/collections/types.ts', types);
}
