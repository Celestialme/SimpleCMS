import { redirect } from '@sveltejs/kit';
import { auth } from './api/db';
import { validate } from '@src/utils/utils';
import env from '@root/env';
import collections from '@src/collections';
export async function load({ cookies, route, params }) {
	let session = JSON.parse(cookies.get('credentials') || '{"username":null,"session":null}') as { username: string; session: string };
	let user = await validate(auth, session.session);

	if (user.status == 200) {
		if (route.id != '/[language]/[collection]') {
			throw redirect(302, `/${env.SYSTEMLANGUAGE}/${collections[0].name}`);
		}
		return {
			credentials: { username: user.user }
		};
	} else {
		if (route.id !== '/[language]/login') {
			throw redirect(302, `/${params.language}/login`);
		}
		return {
			credentials: { username: user.user }
		};
	}
}
