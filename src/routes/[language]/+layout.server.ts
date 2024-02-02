import { error, redirect } from '@sveltejs/kit';
import { auth } from '../api/db';

import { PUBLIC_CONTENT_LANGUAGE } from '$env/static/public';
import { locales } from '@src/i18n/i18n-util';
import { SESSION_COOKIE_NAME } from '@src/auth';
import { getCollections } from '@src/collections';

export async function load({ cookies, route, params }) {
	let collections = await getCollections();
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await auth.validateSession(session_id);
	let collection = collections.find((c) => c.name == params.collection);

	if (user?.lastAuthMethod == 'token') {
		throw redirect(302, `/profile`);
	}
	if (!locales.includes(params.language as any) || (!collection && params.collection)) {
		// if collection is set in url but does not exists.
		throw error(404, {
			message: 'Not found'
		});
	}
	if (user) {
		if (route.id != '/[language]/[collection]') {
			//else if language and collection both set in url
			let _filtered = collections.filter((c) => user && c?.permissions?.[user.role]?.read != false); // filters collection  based on reading permissions  and redirects to first left one
			throw redirect(302, `/${params.language || PUBLIC_CONTENT_LANGUAGE}/${_filtered[0].name}`);
		}
		if (collection?.permissions?.[user.role]?.read == false) {
			throw error(404, {
				message: 'you dont have an access to this collection'
			});
		}
		return {
			user: user
		};
	} else {
		throw redirect(302, `/login`);
	}
}
