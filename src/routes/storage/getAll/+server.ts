import { adapter } from '@src/routes/api/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	let limit = 10;
	let search = url.searchParams.get('search') as string;
	let folder = url.searchParams.get('folder') as string;
	let page = parseInt(url.searchParams.get('page') as string) || 1;

	let { entryList: files, total: totalCount } = await adapter.getMedia({
		type: 'IMAGE',
		search: search,
		folder,
		limit,
		page
	});
	let pagesCount = Math.ceil(totalCount / limit);
	return new Response(
		JSON.stringify({
			images: files,
			pagesCount
		})
	);
};
