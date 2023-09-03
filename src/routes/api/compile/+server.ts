import type { RequestHandler } from '@sveltejs/kit';
import { getCollectionModels } from '../db';
import { updateCollections } from '@src/collections';
import { compile } from './compile';

export const GET: RequestHandler = async () => {
	await compile();
	await updateCollections(true);
	console.log(await getCollectionModels());
	return new Response(null, { status: 200 });
};
