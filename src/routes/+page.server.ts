import { PUBLIC_SYSTEM_LANGUAGE } from '$env/static/public';
import collections, { setup } from '@src/collections';
import { validate } from '@src/utils/utils';
import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from 'lucia-auth';
import { auth } from './api/db';

export async function load({ cookies, route, params }) {
	if (get(collections).length == 0) {
		await setup();
	}
	let session = cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await validate(auth, session);
	let _filtered = collections.filter((c) => c?.permissions?.[user.user.role]?.read != false); // filters collection  based on reading permissions  and redirects to first left one
	throw redirect(302, `/${PUBLIC_SYSTEM_LANGUAGE}/${_filtered[0].name}`);
}
