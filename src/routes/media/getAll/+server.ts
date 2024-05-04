import type { RequestHandler } from './$types';

import mongoose from 'mongoose';

export const GET: RequestHandler = async () => {
	let files = await mongoose.models['_media_images'].find({});
	return new Response(JSON.stringify(files));
};
