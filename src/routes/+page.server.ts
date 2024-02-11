import { PUBLIC_SYSTEM_LANGUAGE } from '$env/static/public';
import { getCollections } from '@src/collections';
import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '@src/auth';
import { auth } from './api/db';

export async function load({ cookies, route, params }) {
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await auth.validateSession(session_id);
	if (!user) redirect(302, `/login`);
	let _filtered = (await getCollections()).filter((c) => user && c?.permissions?.[user.role]?.read != false); // filters collection  based on reading permissions  and redirects to first left one
	redirect(302, `/${PUBLIC_SYSTEM_LANGUAGE}/${_filtered[0].name}`);
}
