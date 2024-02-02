import type { RequestHandler } from './$types';
import { auth } from '../db';
import { SESSION_COOKIE_NAME } from '@src/auth';
import { tableHeaders } from '@src/stores/load';
export const GET: RequestHandler = async ({ cookies }) => {
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await auth.validateSession(session_id);
	if (!user || user.role != 'admin') {
		return new Response('', { status: 403 });
	}
	let docs = await auth.getAllUsers();
	let users = docs.map((doc) => {
		let result = {};
		for (let header of tableHeaders) {
			result[header] = doc[header];
		}
		return result;
	});
	return new Response(JSON.stringify(users), { status: 200 });
};
