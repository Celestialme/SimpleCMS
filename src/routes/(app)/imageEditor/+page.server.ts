import { redirect } from '@sveltejs/kit';
import { auth } from '../api/db';
import { validate } from '@src/utils/utils';
import { SESSION_COOKIE_NAME } from 'lucia-auth';
import fs from 'fs';
import path from 'path';

export async function load(event) {
	const session = event.cookies.get(SESSION_COOKIE_NAME) as string;
	const user = await validate(auth, session);
	if (user.status !== 200) {
		throw redirect(302, `/login`);
	}

	const collectionsDir = path.resolve('src/collections');
	const files = fs.readdirSync(collectionsDir);
	const hasCollections = files.some((file) => file.endsWith('.ts'));

	return {
		props: { hasCollections }
	};
}
