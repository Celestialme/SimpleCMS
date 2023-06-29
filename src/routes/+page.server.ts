import { PUBLIC_SYSTEM_LANGUAGE } from '$env/static/public';

import collections from '@src/collections';
import { redirect } from '@sveltejs/kit';

// console.log('+page.server.ts collections:', collections);
// console.log('+page.server.ts systemLanguage:', systemLanguage);

export async function load({ cookies, route, params }) {
	// console.log('+page.server.ts  route.id:', route.id);

	// Redirect to the first collection in the collections array
	throw redirect(302, `/${PUBLIC_SYSTEM_LANGUAGE}/${collections[0].name}`);
}
