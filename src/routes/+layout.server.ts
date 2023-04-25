import { redirect } from '@sveltejs/kit';
import { auth } from './api/db';
import { validate } from '@src/utils/utils';

export async function load({ cookies, route }) {
	let session = JSON.parse(cookies.get('credentials') || '{"username":null,"session":null}') as { username: string; session: string };
	let user = await validate(auth, session.session);

	if (user.status == 200) {
		if (route.id == '/login') {
			throw redirect(302, '/');
		}
		return {
			credentials: { username: user.user }
		};
	} else {
		if (route.id !== '/login') {
			throw redirect(302, '/login');
		}
		return {
			credentials: { username: user.user }
		};
	}
}
