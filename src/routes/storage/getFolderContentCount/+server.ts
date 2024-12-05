import { adapter } from '@src/routes/api/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	let files = await adapter.countFolders('_storage_images');
	let res = files.reduce((acc, x) => {
		acc[x._id] = x.count;
		return acc;
	}, {});

	return new Response(JSON.stringify(res));
};
