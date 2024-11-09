import fs from 'fs';
import type { RequestHandler } from './$types';
import { collections } from '@src/stores/store.svelte';

import privateConfig from '@root/config/private';
import { _GET } from '../query/GET';
export const GET: RequestHandler = async ({ locals }) => {
	let user = locals.user;
	if (!user || user.role != 'admin') {
		return new Response('', { status: 403 });
	}

	let data: { [key: string]: any } = {};
	for (let collection of Object.values(collections())) {
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
