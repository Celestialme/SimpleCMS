import fs from 'fs';
import type { RequestHandler } from './$types';
import { auth } from '../db';
import { SESSION_COOKIE_NAME } from '@src/auth';
import { collections } from '@src/stores/load';
import { get } from 'svelte/store';
import privateConfig from '@root/config/private';
import { _GET } from '../query/GET';
export const GET: RequestHandler = async ({ cookies }) => {
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await auth.validateSession(session_id);
	if (!user || user.role != 'admin') {
		return new Response('', { status: 403 });
	}
	let $collections = get(collections);
	let data: { [key: string]: any } = {};
	for (let collection of Object.values($collections)) {
		let name = collection.path as string;
		data[name as string] = (
			await (
				await _GET({
					schema: collection,
					user
				})
			).json()
		).entryList;
	}
	if (privateConfig.EXTRACT_DATA_PATH) {
		fs.writeFileSync(
			privateConfig.EXTRACT_DATA_PATH,
			JSON.stringify(data).replaceAll('/storage', 'storage')
		);
		return new Response('', { status: 200 });
	} else {
		return new Response('EXTRACT_DATA_PATH not configured', { status: 500 });
	}
};
