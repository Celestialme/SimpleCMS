import type { RequestHandler } from './$types';
import { getCollectionModels } from '@src/routes/api/db';
import { parse, saveImages } from '@src/utils/utils';

export const PATCH: RequestHandler = async ({ params, request }) => {
	let collections = await getCollectionModels();
	let collection = collections[params.collection];
	let data = await request.formData();

	let ids = data.get('ids') as string;
	let status = data.get('status') as string;
	ids = JSON.parse(ids);

	console.log(ids);
	console.log(typeof ids);

	return new Response(
		JSON.stringify(
			await collection.updateMany(
				{
					_id: {
						$in: ids
					}
				},
				{ status }
			)
		)
	);
};
