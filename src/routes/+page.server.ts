import { PUBLIC_SYSTEM_LANGUAGE } from '$env/static/public';
import { getCollections } from '@src/collections';
import { collections } from '@src/stores/load';
import { validate } from '@src/utils/utils';
import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from 'lucia-auth';
import { auth } from './api/db';
import { get } from 'svelte/store';

export async function load({ cookies, route, params }) {
	let session = cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await validate(auth, session);

	let _filtered = (await getCollections()).filter((c) => c?.permissions?.[user.user.role]?.read != false); // filters collection  based on reading permissions  and redirects to first left one
	throw redirect(302, `/${PUBLIC_SYSTEM_LANGUAGE}/${_filtered[0].name}`);
}
