import { getCollections } from '@src/collections';
import type { RequestHandler } from './$types';
import { auth, getCollectionModels } from '@src/routes/api/db';
import { validate } from '@src/utils/utils';
import { DEFAULT_SESSION_COOKIE_NAME } from 'lucia';

export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
	let session = cookies.get(DEFAULT_SESSION_COOKIE_NAME) as string;
	let user = await validate(auth, session);
	let has_write_access = (await getCollections()).find((c) => c.name == params.collection)?.permissions?.[user.user.role]?.write ?? true;
	if (user.status != 200 || !has_write_access) {
		return new Response('', { status: 403 });
	}

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
