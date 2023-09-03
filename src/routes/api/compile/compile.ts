import fs from 'fs';
export async function compile({
	collectionsFolderJS = import.meta.env.collectionsFolderJS,
	collectionsFolderTS = import.meta.env.collectionsFolderTS
} = {}) {
	globalThis.__filename = '';
	if (!fs.existsSync(collectionsFolderJS)) {
		fs.mkdirSync(collectionsFolderJS);
	}
	let ts = (await import('typescript')).default;
	let files = fs.readdirSync(collectionsFolderTS).filter((file) => !['Auth.ts', 'index.ts'].includes(file));

	for (let file of files) {
		let content = fs.readFileSync(`${collectionsFolderTS}/${file}`, { encoding: 'utf-8' });
		let code = ts.transpileModule(content, {
			compilerOptions: {
				target: ts.ScriptTarget.ESNext
			}
		}).outputText;
		code = code
			.replace(/import widgets from .*\n/g, '')
			.replace(/widgets/g, 'globalThis.widgets')
			.replace(/(\bfrom\s+["']\..*)(["'])/g, '$1.js$2');
		fs.writeFileSync(`${collectionsFolderJS}/${file.trim().replace(/\.ts$/g, '.js')}`, code);
	}
}
