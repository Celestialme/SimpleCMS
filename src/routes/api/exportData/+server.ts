import fs from 'fs';
import type { RequestHandler } from './$types';
import { auth, getCollectionModels } from '../db';
import { SESSION_COOKIE_NAME } from '@src/auth';
import { collections, tableHeaders } from '@src/stores/load';
import { get } from 'svelte/store';
export const GET: RequestHandler = async ({ cookies }) => {
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await auth.validateSession(session_id);
	if (!user || user.role != 'admin') {
		return new Response('', { status: 403 });
	}
	let collectionsModels = await getCollectionModels();
	let $collections = get(collections);
	let data: { [key: string]: any } = {};
	for (let collection of $collections) {
		let name = collection.name as string;
		data[name as string] = await collectionsModels[name as string].find({});
	}
	console.log(data);
	fs.writeFileSync(`${import.meta.env.root}/data.json`, JSON.stringify(data));
	return new Response('', { status: 200 });
};
