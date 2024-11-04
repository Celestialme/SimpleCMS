import { error, redirect } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from './auth';
import { auth } from './routes/api/db';
import type { User } from './auth/types';
import { getCollections } from './collections';
import publicConfig from '@root/config/public';
import { collections } from './stores/load';
import { get } from 'svelte/store';
export async function handle({ event, resolve }) {
	let session_id = event.cookies.get(SESSION_COOKIE_NAME) as string;

	let user_id = event.url.searchParams.get('user_id') as string;
	let user = user_id
		? ((await auth.checkUser({ _id: user_id })) as User)
		: ((await auth.validateSession(session_id)) as User);

	// if (!user && event.url.pathname != '/login') throw redirect(302, `/login`);

	event.locals.user = user;

	if (user?.lastAuthMethod == 'token') {
		throw redirect(302, `/profile`);
	}
	let _filtered = Object.values(await getCollections()).filter(
		(c) => user && c?.permissions?.[user.role]?.read != false
	); // filters collection  based on reading permissions  and redirects to first left one
	if (event.url.pathname == '/') {
		console.log('here');
		if (_filtered.length == 0) {
			event.locals.error = {
				status: 404,
				message: 'you dont have an access to any collection'
			};
		} else throw redirect(302, `/${publicConfig.DEFAULT_CONTENT_LANGUAGE}/${_filtered[0].path}`);
	}
	let collection = get(collections)[event.params.collection as string];
	if (event.route.id == '/[language]') {
		//else if language and collection both set in url

		throw redirect(
			302,
			`/${event.params.language || publicConfig.DEFAULT_CONTENT_LANGUAGE}/${_filtered[0].path}`
		);
	}

	if (collection?.permissions?.[user.role]?.read == false) {
		event.locals.error = {
			status: 404,
			message: 'you dont have an access to this collection'
		};
	}
	const response = await resolve(event);
	return response;
}
