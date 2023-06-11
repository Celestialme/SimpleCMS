import { redirect } from '@sveltejs/kit';
import { auth } from './api/db';
import { validate } from '@src/utils/utils';
import { PUBLIC_SYSTEM_LANGUAGE } from '$env/static/public';
import collections from '@src/collections';

export async function load({ cookies, route, params }) {
	// Parse the session data from the cookies
	let session = JSON.parse(cookies.get('credentials') || '{"username":null,"session":null}') as { username: string; session: string };
	// Validate the user's session
	let user = await validate(auth, session.session);

	// If the user is authenticated
	if (user.status == 200) {
		// Check if the current route is not a collection route
		if (route.id != '/[language]/[collection]' && !collections.some((x) => x.name === params.collection)) {
			// Redirect to the first collection in the collections array
			throw redirect(302, `/${params.language || PUBLIC_SYSTEM_LANGUAGE}/${collections[0].name}`);
		}
		// Return the user's username
		return {
			credentials: { username: user.user }
		};
	} else {
		// If the user is not authenticated and the current route is not the login route
		if (route.id !== '/[language]/login') {
			// Redirect to the login route
			throw redirect(302, `/${params.language || PUBLIC_SYSTEM_LANGUAGE}/login`);
		}
		// Return an empty username
		return {
			credentials: { username: user.user }
		};
	}
}
