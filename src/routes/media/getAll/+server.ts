import type { RequestHandler } from './$types';

import mongoose from 'mongoose';

export const GET: RequestHandler = async ({ url }) => {
	let limit = 10;
	let search = url.searchParams.get('search') as string;
	let re = new RegExp(RegExp.escape(search), 'i');

	let files = await mongoose.models['_media_images']
		.find(search ? { 'original.name': { $regex: re } } : {})
		.limit(limit);
	return new Response(JSON.stringify(files));
};
