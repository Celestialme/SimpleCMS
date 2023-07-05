import { PUBLIC_SYSTEM_LANGUAGE } from '$env/static/public';

import collections from '@src/collections';
import { validate } from '@src/utils/utils';
import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from 'lucia-auth';
import { auth } from './api/db';

export async function load({ cookies, route, params }) {
	let session = cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await validate(auth, session);
	// filters collection  based on reading permissions  and redirects to first left one
	let _filtered = collections.filter((c) => c?.permissions?.[user.user.role]?.read != false);

	// Redirect to the first collection in the collections array
	throw redirect(302, `/${PUBLIC_SYSTEM_LANGUAGE}/${_filtered[0].name}`);
}
