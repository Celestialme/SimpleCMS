import type { RequestHandler } from './$types';
import { auth } from '../db';
import { tableHeaders } from '@src/stores/load';
export const GET: RequestHandler = async ({ locals }) => {
	let user = locals.user;
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
