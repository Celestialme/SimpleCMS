import type { User } from '@src/auth/types';
import { getCollections } from '@src/collections';
import publicConfig from '@root/config/public';
import { auth } from '../db';
import type { Schema } from '@src/collections/types';
import { _GET } from './GET';
import { _POST } from './POST';
import { _PATCH } from './PATCH';
import { _DELETE } from './DELETE';
import { _SETSTATUS } from './SETSTATUS';

export const POST = async ({ request, locals }) => {
	let data = await request.formData();
	let user_id = data.get('user_id') as string;
	let collectionName = data.get('collectionName') as string;
	let method = data.get('method') as string;

	['user_id', 'collectionName', 'method'].forEach((key) => data.delete(key));

	let user = user_id ? ((await auth.checkUser({ _id: user_id })) as User) : locals.user;
	if (!user) {
		return new Response('', { status: 403 });
	}
	let collection_schema = (await getCollections())[collectionName] as Schema;
	let has_read_access = collection_schema?.permissions?.[user.role]?.read != false;
	let has_write_access = collection_schema?.permissions?.[user.role]?.write != false;
	if (!has_read_access) {
		return new Response('', { status: 403 });
	}

	let page = parseInt(data.get('page') as string) || 1;
	let limit = parseInt(data.get('limit') as string) || 0;
	let filter: { [key: string]: string } = JSON.parse(data.get('filter') as string) || {};
	let sort: { [key: string]: number } = JSON.parse(data.get('sort') as string) || {};
	let contentLanguage =
		(data.get('contentLanguage') as string) || publicConfig.DEFAULT_CONTENT_LANGUAGE;

	switch (method) {
		case 'GET':
			return _GET({
				contentLanguage,
				filter,
				schema: collection_schema,
				sort,
				user,
				limit,
				page
			});
		case 'POST':
			if (!has_write_access) {
				return new Response('', { status: 403 });
			}
			return _POST({
				data,
				schema: collection_schema,
				user
			});
		case 'PATCH':
			if (!has_write_access) {
				return new Response('', { status: 403 });
			}
			return _PATCH({
				data,
				schema: collection_schema,
				user
			});
		case 'DELETE':
			if (!has_write_access) {
				return new Response('', { status: 403 });
			}
			return _DELETE({
				data,
				schema: collection_schema,
				user
			});
		case 'SETSTATUS':
			if (!has_write_access) {
				return new Response('', { status: 403 });
			}
			return _SETSTATUS({
				data,
				schema: collection_schema
			});
	}
};
