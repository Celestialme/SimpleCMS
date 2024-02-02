import { auth } from '../db';
import type { RequestHandler } from './$types';
export const GET: RequestHandler = async ({ request, cookies }) => {
	auth.createUser({
		email: 'test@gmail.com',
		role: 'user',
		username: 'test',
		password: 'test',
		lastAuthMethod: 'password',
		is_registered: true
	});
	return new Response('', { status: 404 });
};
