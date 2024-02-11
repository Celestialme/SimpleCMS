import { error, redirect } from '@sveltejs/kit';
import { auth } from '../api/db';

import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';

import { SESSION_COOKIE_NAME } from '@src/auth';
import { getCollections } from '@src/collections';

//ParaglideJS
import { languageTag } from '@src/paraglide/runtime';

export async function load({ cookies, route, params }) {
	let collections = await getCollections();
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await auth.validateSession(session_id);
	let collection = collections.find((c) => c.name == params.collection);

	if (user?.lastAuthMethod == 'token') {
		redirect(302, `/profile`);
	}
	if (!languageTag().includes(params.language as any) || (!collection && params.collection)) {
		// if collection is set in url but does not exists.
		error(404, {
			message: 'Not found'
		});
	}
	if (user) {
		if (route.id != '/[language]/[collection]') {
			//else if language and collection both set in url
			let _filtered = collections.filter((c) => user && c?.permissions?.[user.role]?.read != false); // filters collection  based on reading permissions  and redirects to first left one
			redirect(302, `/${params.language || PUBLIC_CONTENT_LANGUAGES}/${_filtered[0].name}`);
		}
		if (collection?.permissions?.[user.role]?.read == false) {
			error(404, {
				message: 'you dont have an access to this collection'
			});
		}
		return {
			user: user
		};
	} else {
		redirect(302, `/login`);
	}
}
