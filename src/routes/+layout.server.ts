import { redirect } from '@sveltejs/kit';
import { auth } from './api/db';
import { validate } from '@src/utils/utils';
import collections from '@src/collections';
import { systemLanguage } from '@src/stores/store';
// console.log('+layout.server.ts systemLanguage:', systemLanguage);
// console.log('+layout.server.ts collections:', collections);

export async function load({ cookies, route, params }) {
	// Log that the load function is being called
	//console.log('+layout.server.ts load function called');

	// Log the route id
	//console.log('+layout.server.ts route.id:', route.id);

	// Parse the session data from the cookies
	let session = JSON.parse(cookies.get('credentials') || '{"username":null,"session":null}') as { username: string; session: string };
	// Validate the user's session
	let user = await validate(auth, session.session);

	// If the user is authenticated
	if (user.status == 200) {
		// Check if the current route is not a collection route and not an allowed route
		if (
			route.id != '/[language]/[collection]' &&
			params.collection !== undefined &&
			!collections.some((x) => x.name === params.collection) &&
			!['/{[language]}/user', '/[language]/mediagallery', '/[language]/builder', '/[language]/upload', '/mediafiles', '/mediathumbnails'].includes(
				route.id
			)
		) {
			// Log the value of the params.collection variable
			console.log('+layout.server.ts params.collection:', params.collection);
			// Log that the redirect is being triggered
			//console.log('+layout.server.ts redirecting to first collection');
			// Redirect to the first collection in the collections array
			throw redirect(302, `/${systemLanguage}/${collections[0].name}`);
		}
		// Return the user's username
		return {
			credentials: { username: user.user }
		};
	} else {
		// If the user is not authenticated and the current route is not the login route
		if (route.id !== '/login') {
			// Redirect to the login route
			throw redirect(302, `/login`);
		}
		// Return an empty username
		return {
			credentials: { username: user.user }
		};
	}
}
