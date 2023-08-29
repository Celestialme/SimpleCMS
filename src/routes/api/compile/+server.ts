import type { RequestHandler } from '@sveltejs/kit';
import { getCollectionModels } from '../db';
import fs from 'fs';
import { updateCollections } from '@src/collections';
import { dev } from '$app/environment';

// Define an async GET request handler
export const GET: RequestHandler = async ({ params, url }) => {
	// Check if the collections folder exists, if not, create it
	if (!fs.existsSync(import.meta.env.collectionsFolderJS)) {
		fs.mkdirSync(import.meta.env.collectionsFolderJS);
	}

	// Read the files in the collections folder and filter out Auth.ts and index.ts
	const files = fs
		.readdirSync(import.meta.env.collectionsFolderTS)
		.filter((file) => !['Auth.ts', 'index.ts'].includes(file));

	// If in development mode, import typescript
	if (dev) {
		globalThis.ts = await import('typescript');
	}

	// Loop through the files
	for (const file of files) {
		// Read the content of the file
		const content = fs.readFileSync(`${import.meta.env.collectionsFolderTS}/${file}`, {
			encoding: 'utf-8'
		});

		// Transpile the TypeScript code to JavaScript
		let code = globalThis.ts.transpileModule(content, {
			compilerOptions: {
				target: globalThis.ts.ScriptTarget.ESNext
			}
		}).outputText;

		// Replace import statements and references to widgets
		code = code
			.replace(/import widgets from .*\n/g, '')
			.replace(/widgets/g, 'globalThis.widgets')
			.replace(/(\bfrom\s+["']\..*)(["'])/g, '$1.js$2');

		// Write the transpiled code to a new file with a .js extension
		fs.writeFileSync(
			`${import.meta.env.collectionsFolderJS}/${file.trim().replace(/\.ts$/g, '.js')}`,
			code
		);
	}
	// Update the collections and log the collection models
	await updateCollections(true);
	console.log(await getCollectionModels());
	return new Response(null, { status: 200 });
};
