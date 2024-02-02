import { getCollections } from '@src/collections';
import type { RequestHandler } from './$types';
import { auth, getCollectionModels } from '@src/routes/api/db';
import { SESSION_COOKIE_NAME } from '@src/auth';

export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await auth.validateSession(session_id);
	if (!user) {
		return new Response('', { status: 403 });
	}
	let has_write_access = (await getCollections()).find((c) => c.name == params.collection)?.permissions?.[user.role]?.write ?? true;
	if (!has_write_access) {
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
