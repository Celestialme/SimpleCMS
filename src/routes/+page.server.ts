import { systemLanguage } from '@src/stores/store';
import collections from '@src/collections';
import { redirect } from '@sveltejs/kit';

// console.log('+page.server.ts collections:', collections);
// console.log('+page.server.ts systemLanguage:', systemLanguage);

export async function load({ cookies, route, params }) {
	// console.log('+page.server.ts  route.id:', route.id);

	// Redirect to the first collection in the collections array
	throw redirect(302, `/${systemLanguage}/${collections[0].name}`);
}
