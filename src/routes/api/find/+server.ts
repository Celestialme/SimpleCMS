import type { RequestHandler } from './$types';
import { collectionsModels } from '@src/routes/api/db';
export const GET: RequestHandler = async ({ url }) => {
	let collection = collectionsModels[url.searchParams.get('collection') as string];
	let id = url.searchParams.get('id') as string | null;
	// return new Response(await collection.find(url.searchParams.get("id") as string))
	if (id) {
		let resp = JSON.stringify(await collection.findById(url.searchParams.get('id') as string));
		return new Response(resp);
	} else {
		let query = JSON.parse(url.searchParams.get('query') as string);
		let resp = JSON.stringify(await collection.find(query));
		return new Response(resp);
	}
};
