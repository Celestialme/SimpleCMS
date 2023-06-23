import { PUBLIC_SYSTEM_LANGUAGE } from '$env/static/public';
import collections from '@src/collections';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies, route, params }) {
	throw redirect(302, `/${PUBLIC_SYSTEM_LANGUAGE}/${collections[0].name}`);
}
