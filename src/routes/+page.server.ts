import { PUBLIC_SYSTEM_LANGUAGE } from '$env/static/public';
import collections from '@src/collections';
import { collections as collectionsStore } from '@src/stores/collections';
import { validate } from '@src/utils/utils';
import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from 'lucia-auth';
import { auth } from './api/db';
import { getCollectionsFile } from './getCollectionsFile';


export async function load({ cookies }) {
	if (collections.length == 0) {
        const collectionsFile = await getCollectionsFile()
		await collectionsStore.updateCollection(new Response(JSON.stringify(collectionsFile)));
	}
	let session = cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await validate(auth, session);
	let _filtered = collections.filter((c) => c?.permissions?.[user.user.role]?.read != false); // filters collection  based on reading permissions  and redirects to first left one
    console.log(collections)
    console.log(PUBLIC_SYSTEM_LANGUAGE)
	throw redirect(302, `/${PUBLIC_SYSTEM_LANGUAGE}/${_filtered[0].name}`);
}
