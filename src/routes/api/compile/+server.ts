import type { RequestHandler } from '@sveltejs/kit';
import { getCollectionModels } from '../db';
import { updateCollections } from '@src/collections';
import { compile } from './compile';

globalThis.__filename = '';

// Define an async GET request handler
export const GET: RequestHandler = async () => {
	await compile();

	// Update the collections and log the collection models
	await updateCollections(true);
	console.log(await getCollectionModels());
	return new Response(null, { status: 200 });
};
