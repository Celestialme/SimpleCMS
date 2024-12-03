import { adapter } from '@src/routes/api/db';
import type { RequestHandler } from './$types';

import mongoose from 'mongoose';

export const GET: RequestHandler = async ({ url }) => {
	let limit = 10;
	let search = url.searchParams.get('search') as string;
	let folder = url.searchParams.get('folder') as string;
	let page = parseInt(url.searchParams.get('page') as string) || 1;
	let re = new RegExp(RegExp.escape(search), 'i');

	let search_modifier = {
		match: {
			'original->name': { value: re, strict: false }
		}
	};

	let { entryList: files, total: totalCount } = await adapter.getAll('_storage_images', []);
	console.log(files);
	let pagesCount = Math.ceil(totalCount / limit);
	return new Response(
		JSON.stringify({
			images: files,
			pagesCount
		})
	);
};
