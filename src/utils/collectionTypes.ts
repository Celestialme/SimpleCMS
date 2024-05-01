import fs from 'fs';
import ts from 'typescript';
// import { getFieldName } from './utils';
export async function generateCollectionTypes() {
	let files = fs.readdirSync('src/collections').filter((x) => {
		return !['index.ts', 'types.ts', 'config.ts'].includes(x);
	});

	let collections =
		'export type CollectionNames = ' +
		files
			.map((x) => `'${x.replace('.ts', '')}'`)
			.join('|')
			.replaceAll(/\n/g, '') +
		';';

	// console.log(collectionSchemas);
	let types = fs.readFileSync('src/collections/types.ts', 'utf-8');
	types = types.replace(/\n*export\s+type\s+CollectionNames\s?=\s?.*?;/gms, '');

	types += collections;

	fs.writeFileSync('src/collections/types.ts', types);
}

export async function generateCollectionFieldTypes() {
	let files = fs.readdirSync('src/collections').filter((x) => {
		return !['index.ts', 'types.ts', 'config.ts'].includes(x);
	});
	let collections = {};
	for (let file of files) {
		let content = fs.readFileSync('./src/collections/' + file, 'utf8');
		let widgets = new Set();
		for (let match of content.matchAll(/widgets.(.*?)\(/g)) {
			widgets.add(match[1]);
		}
		content = content.replace(/widgets\./g, '');
		content =
			`${Array.from(widgets)
				.map((widget) => `let  ${widget} = (args: any) =>args;`)
				.join('\n')}` + content;
		content = ts.transpile(content, {
			target: ts.ScriptTarget.ESNext,
			module: ts.ModuleKind.ESNext
		});
		let data = (await import('data:text/javascript,' + content)).default;
		let collection: string[] = [];

		for (let field of data.fields) {
			let fieldName = field.db_fieldName || field.label;
			collection.push(fieldName);
		}
		collections[file.replace('.ts', '')] = collection.join('|');
	}
	let types = fs.readFileSync('src/collections/types.ts', 'utf-8');
	types = types.replace(/\n*export\s+type\s+CollectionContent\s?=\s?.*?};/gms, '');
	types +=
		'\n' +
		'export type CollectionContent = ' +
		JSON.stringify(collections).replaceAll('|', `"|"`) +
		';';
	fs.writeFileSync('src/collections/types.ts', types);
}
