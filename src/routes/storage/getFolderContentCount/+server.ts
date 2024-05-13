import type { RequestHandler } from './$types';

import mongoose from 'mongoose';

export const GET: RequestHandler = async ({ url }) => {
	let files = await mongoose.models['_storage_images'].aggregate([
		{
			$group: {
				_id: '$folder',
				count: { $sum: 1 }
			}
		}
	]);
	let res = files.reduce((acc, x) => {
		acc[x._id] = x.count;
		return acc;
	}, {});

	return new Response(JSON.stringify(res));
};
