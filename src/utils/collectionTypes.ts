import fs from 'fs';
import path from 'path';
import ts from 'typescript';

export async function generateCollectionTypes() {
	let files = walkdir('./src/collections').filter((x) => {
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
		collections[file.replace('.ts', '').replace(/[/\\]/g, '::')] = collection;
	}
	let types = fs.readFileSync('src/collections/types.ts', 'utf-8');
	types = types.replace(/\n*export\s+type\s+CollectionTypes\s?=\s?.*?};/gms, '');
	types += '\n' + 'export type CollectionTypes = ' + JSON.stringify(collections) + ';';
	fs.writeFileSync('src/collections/types.ts', types);
}

function walkdir(dir: string, fileList: string[] = [], baseDir = dir) {
	// Read the directory contents
	const files = fs.readdirSync(dir);

	// Iterate through the contents
	files.forEach((file) => {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			walkdir(fullPath, fileList, baseDir);
		} else {
			const relativePath = path.relative(baseDir, fullPath);
			fileList.push(relativePath);
		}
	});

	return fileList;
}
