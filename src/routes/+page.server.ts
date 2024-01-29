import { PUBLIC_SYSTEM_LANGUAGE } from '$env/static/public';
import { getCollections } from '@src/collections';
import { validate } from '@src/utils/utils';
import { redirect } from '@sveltejs/kit';
import { DEFAULT_SESSION_COOKIE_NAME } from 'lucia';
import { auth } from './api/db';

export async function load({ cookies, route, params }) {
	let session = cookies.get(DEFAULT_SESSION_COOKIE_NAME) as string;
	let user = await validate(auth, session);
	if (user.status != 200) throw redirect(302, `/login`);

	let _filtered = (await getCollections()).filter((c) => c?.permissions?.[user.user.role]?.read != false); // filters collection  based on reading permissions  and redirects to first left one
	throw redirect(302, `/${PUBLIC_SYSTEM_LANGUAGE}/${_filtered[0].name}`);
}
