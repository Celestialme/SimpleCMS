import type { RequestHandler } from './$types';

import mongoose from 'mongoose';

export const GET: RequestHandler = async ({ url }) => {
	let limit = 10;
	let search = url.searchParams.get('search') as string;
	let page = parseInt(url.searchParams.get('page') as string) || 1;
	let re = new RegExp(RegExp.escape(search), 'i');

	let search_aggregation = {
		$match: {
			'original.name': { $regex: re }
		}
	};

	let files = await mongoose.models['_media_images'].aggregate([
		{
			$facet: {
				images: [search_aggregation, { $skip: (page - 1) * limit }, { $limit: limit }],
				totalCount: [search_aggregation, { $count: 'total' }]
			}
		}
	]);
	let totalCount = files[0].totalCount[0] ? files[0].totalCount[0].total : 0;

	let pagesCount = Math.ceil(totalCount / limit);
	return new Response(
		JSON.stringify({
			images: files[0].images,
			pagesCount
		})
	);
};
