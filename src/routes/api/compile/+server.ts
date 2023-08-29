import type { RequestHandler } from '@sveltejs/kit';
import { getCollectionModels } from '../db';
import fs from 'fs';
import { updateCollections } from '@src/collections';
import { dev } from '$app/environment';
import Path from 'path';
export const GET: RequestHandler = async ({ params, url }) => {
	if (!fs.existsSync(import.meta.env.collectionsFolderJS)) {
		fs.mkdirSync(import.meta.env.collectionsFolderJS);
	}
	let files = fs.readdirSync(import.meta.env.collectionsFolderTS).filter((file) => !['Auth.ts', 'index.ts'].includes(file));
	if (dev) {
		globalThis.ts = await import('typescript');
	}
	for (let file of files) {
		let content = fs.readFileSync(`${import.meta.env.collectionsFolderTS}/${file}`, { encoding: 'utf-8' });
		let code = globalThis.ts.transpileModule(content, {
			compilerOptions: {
				target: globalThis.ts.ScriptTarget.ESNext
			}
		}).outputText;
		code = code
			.replace(/import widgets from .*\n/g, '')
			.replace(/widgets/g, 'globalThis.widgets')
			.replace(/(\bfrom\s+["']\..*)(["'])/g, '$1.js$2');
		fs.writeFileSync(`${import.meta.env.collectionsFolderJS}/${file.trim().replace(/\.ts$/g, '.js')}`, code);
	}
	await updateCollections(true);
	console.log(await getCollectionModels());
	return new Response(null, { status: 200 });
};
