import { error, redirect } from '@sveltejs/kit';
import { auth } from '../api/db';
import { validate } from '@src/utils/utils';

import collections from '@src/collections';

import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';
import { locales } from '@src/i18n/i18n-util';

export async function load({ cookies, route, params }) {
	let session = JSON.parse(cookies.get('credentials') || '{"username":null,"session":null}') as { username: string; session: string };
	let user = await validate(auth, session.session);

	if (!locales.includes(params.language as any)) {
		throw error(404, {
			message: 'Not found'
		});
	}

	if (user.status == 200) {
		if (route.id != '/[language]/[collection]') {
			throw redirect(302, `/${params.language || PUBLIC_CONTENT_LANGUAGES}/${collections[0].name}`);
		}
		return {
			credentials: { username: user.user, role: user.role }
		};
	} else {
		throw redirect(302, `/login`);
	}
}
