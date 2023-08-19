import type { RequestHandler } from './$types';
import { collections } from '@src/routes/api/db';

export const GET: RequestHandler = async ({ url }) => {
	const collection = collections[url.searchParams.get('collection') as string];
	const id = url.searchParams.get('id') as string | null;
	// return new Response(await collection.find(url.searchParams.get("id") as string))
	if (id) {
		const resp = JSON.stringify(await collection.findById(url.searchParams.get('id') as string));
		return new Response(resp);
	} else {
		const query = JSON.parse(url.searchParams.get('query') as string);
		const resp = JSON.stringify(await collection.find(query));
		return new Response(resp);
	}
};
