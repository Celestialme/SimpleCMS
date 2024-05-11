import { auth } from '@src/routes/api/db';
import type { RequestHandler } from './$types';

import mongoose from 'mongoose';
import { SESSION_COOKIE_NAME } from '@src/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await auth.validateSession(session_id);
	if (!user || user.role != 'admin') {
		return new Response('you dont have an access', { status: 403 });
	}
	let formData = await request.formData();
	let id = formData.get('id') as string;

	await mongoose.models['_media_images'].deleteOne({ _id: new mongoose.Types.ObjectId(id) });
	return new Response('has been successfully deleted', { status: 200 });
};
