import type { RequestHandler } from '@sveltejs/kit';
import { getCollectionModels } from '../db';
import fs from 'fs';
import { updateCollections } from '@src/collections';

export const GET: RequestHandler = async ({ params, url }) => {
	// Read the contents of the collectionsFolderTS directory and filter out Auth.ts and index.ts
	const files = fs
		.readdirSync(import.meta.env.collectionsFolderTS)
		.filter((file) => !['Auth.ts', 'index.ts'].includes(file));

	// Iterate over each file in the files array
	for (const file of files) {
		// Read the contents of the file
		const content = fs.readFileSync(`${import.meta.env.collectionsFolderTS}/${file}`, {
			encoding: 'utf-8'
		});

		// Transpile the TypeScript code to JavaScript
		let code = globalThis.ts.transpileModule(content, {
			compilerOptions: {
				target: globalThis.ts.ScriptTarget.ESNext
			}
		}).outputText;

		// Replace import statements and references to widgets with globalThis.widgets
		code = code
			.replace(/import widgets from .*\n/g, '')
			.replace(/widgets/g, 'globalThis.widgets')
			.replace(/(\bfrom\s+["']\..*)(["'])/g, '$1.js$2');

		// Write the transpiled code to the collectionsFolderJS directory
		fs.writeFileSync(
			`${import.meta.env.collectionsFolderJS}/${file.trim().replace(/\.ts$/g, '.js')}`,
			code
		);
	}

	// Update collections and log collection models
	await updateCollections(true);
	console.log(await getCollectionModels());

	// Return a response with a 200 status code
	return new Response(null, { status: 200 });
};
