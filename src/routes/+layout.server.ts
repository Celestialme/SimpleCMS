import { redirect } from '@sveltejs/kit';
import { auth } from './api/db';
import { validate } from '@src/utils/utils';
import { PUBLIC_SYSTEM_LANGUAGE } from '$env/static/public';
import collections from '@src/collections';

export async function load({ cookies, route, params }) {
	let session = JSON.parse(cookies.get('credentials') || '{"username":null,"session":null}') as { username: string; session: string };
	let user = await validate(auth, session.session);

	if (user.status == 200) {
		if (route.id != '/[language]/[collection]') {
			console.log(PUBLIC_SYSTEM_LANGUAGE);
			throw redirect(302, `/${params.language || PUBLIC_SYSTEM_LANGUAGE}/${collections[0].name}`);
		}
		return {
			credentials: { username: user.user }
		};
	} else {
		if (route.id !== '/login') {
			throw redirect(302, `/login`);
		}
		return {
			credentials: { username: user.user }
		};
	}
}
