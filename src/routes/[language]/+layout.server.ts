import { error, redirect } from '@sveltejs/kit';
import { auth } from '../api/db';
import { validate } from '@src/utils/utils';
import { PUBLIC_CONTENT_LANGUAGE } from '$env/static/public';
import { locales } from '@src/i18n/i18n-util';
import collections from '@src/collections';
import { SESSION_COOKIE_NAME } from 'lucia-auth';

export async function load({ cookies, route, params }) {
	let session = cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await validate(auth, session);
	let collection = collections.find((c) => c.name == params.collection);

	if (user.user.authMethod == 'token') {
		throw redirect(302, `/profile`);
	}
	if (!locales.includes(params.language as any) || (!collection && params.collection)) {
		throw error(404, {
			message: 'Not found'
		});
	}
	if (user.status == 200) {
		if (route.id != '/[language]/[collection]') {
			throw redirect(302, `/${params.language || PUBLIC_CONTENT_LANGUAGE}/${collections[0].name}`);
		}
		if (collection?.permissions?.[user.user.role]?.read == false) {
			throw error(404, {
				message: 'you dont have an access to this collection'
			});
		}
		return {
			user: user.user
		};
	} else {
		throw redirect(302, `/login`);
	}
}
