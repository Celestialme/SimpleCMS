import type { RequestHandler } from './$types';
import { adapter } from '@src/routes/api/db';
export const GET: RequestHandler = async ({ url }) => {
	let path = url.searchParams.get('collection') as string;
	let id = url.searchParams.get('id') as string | null;

	// return new Response(await collection.find(url.searchParams.get("id") as string))
	if (id) {
		let resp = JSON.stringify(
			(
				await adapter.get(path, [
					{
						match: {
							_id: {
								strict: true,
								value: id
							}
						},
						limit: 1
					}
				])
			).rows
		);
		return new Response(resp);
	} else {
		throw new Error('id is required');
	}
};
