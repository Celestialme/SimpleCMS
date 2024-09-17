import type { RequestHandler } from './$types';

import mongoose from 'mongoose';

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	let user = locals.user;
	if (!user || user.role != 'admin') {
		return new Response('you dont have an access', { status: 403 });
	}
	let formData = await request.formData();
	let id = formData.get('id') as string;

	await mongoose.models['_storage_images'].deleteOne({ _id: new mongoose.Types.ObjectId(id) });
	return new Response('has been successfully deleted', { status: 200 });
};
