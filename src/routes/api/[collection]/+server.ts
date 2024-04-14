import { getCollections } from '@src/collections';
import type { RequestHandler } from './$types';
import { auth, getCollectionModels } from '@src/routes/api/db';
import { getFieldName, parse, saveImages } from '@src/utils/utils';
import widgets from '@src/components/widgets';
import publicConfig from '@root/config/public';
import { SESSION_COOKIE_NAME } from '@src/auth';
import type { Schema } from '@src/collections/types';
import type { User } from '@src/auth/types';

export const GET: RequestHandler = async ({ params, url, cookies }) => {
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let user_id = url.searchParams.get('user_id');
	let user = user_id ? ((await auth.get_user_by_id(user_id)) as User) : ((await auth.validateSession(session_id)) as User);
	if (!user) {
		return new Response('', { status: 403 });
	}
	let collection_schema = (await getCollections()).find((c) => c.name == params.collection) as Schema;
	let has_read_access = collection_schema?.permissions?.[user.role]?.read != false;
	if (!has_read_access) {
		return new Response('', { status: 403 });
	}
	let collections = await getCollectionModels();
	let page = parseInt(url.searchParams.get('page') as string) || 1;
	let collection = collections[params.collection];
	let length = parseInt(url.searchParams.get('length') as string) || Infinity;
	let filter: { [key: string]: string } = JSON.parse(url.searchParams.get('filter') as string) || {};
	let sort: { [key: string]: number } = JSON.parse(url.searchParams.get('sort') as string) || {};

	let contentLanguage = JSON.parse(url.searchParams.get('contentLanguage') as string) || publicConfig.DEFAULT_CONTENT_LANGUAGE;
	let skip = (page - 1) * length;

	let aggregations: any = [];
	if (sort.status) {
		aggregations.push({ $sort: { status: sort.status } });
	}
	for (let field of collection_schema.fields) {
		let widget = widgets[field.widget.key];
		let fieldName = getFieldName(field);
		if ('aggregations' in widget) {
			let _filter = filter[fieldName];
			let _sort = sort[fieldName];

			if (widget.aggregations.filters && _filter) {
				let _aggregations = await widget.aggregations.filters({ field, contentLanguage: contentLanguage, filter: _filter });
				aggregations.push(..._aggregations);
			}
			if (widget.aggregations.sorts && _sort) {
				let _aggregations = await widget.aggregations.sorts({ field, contentLanguage: contentLanguage, sort: _sort });
				aggregations.push(..._aggregations);
			}
		}
	}
	let entryListWithCount = await collection.aggregate([
		{
			$facet: {
				entries: [...aggregations, { $skip: skip }, { $limit: length }],
				totalCount: [...aggregations, { $count: 'total' }]
			}
		}
	]);
	let entryList = entryListWithCount[0].entries;

	for (let field of collection_schema.fields) {
		let widget = widgets[field.widget.key];
		let fieldName = getFieldName(field);

		if (field?.permissions?.[user.role]?.read == false) {
			// if we cant read there is nothing to clean.
			entryList = entryList.map((entry: any) => {
				delete entry[fieldName];
				return entry;
			});
		} else if ('modifyRequest' in widget) {
			// widget can modify own portion of entryList;
			entryList = await Promise.all(
				entryList.map(async (entry: any) => {
					entry[fieldName] = await widget.modifyRequest({ collection, field, data: entry[fieldName], user, type: 'GET' });
					return entry;
				})
			);
		}
	}

	let totalCount = entryListWithCount[0].totalCount[0] ? entryListWithCount[0].totalCount[0].total : 0;

	let pagesCount = Math.ceil(totalCount / length);
	return new Response(
		JSON.stringify({
			entryList,
			pagesCount
		})
	);
};

export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
	let data = await request.formData();
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let user_id = data.get('user_id') as string;
	let user = user_id ? ((await auth.get_user_by_id(user_id)) as User) : ((await auth.validateSession(session_id)) as User);
	if (!user) {
		return new Response('', { status: 403 });
	}
	let collection_schema = (await getCollections()).find((c) => c.name == params.collection) as Schema;
	let has_write_access = collection_schema?.permissions?.[user.role]?.write != false;
	if (!has_write_access) {
		return new Response('', { status: 403 });
	}
	let collections = await getCollectionModels();
	let collection = collections[params.collection];
	let body: any = {};
	for (let key of data.keys()) {
		try {
			body[key] = JSON.parse(data.get(key) as string, (key, value) => {
				if (value?.instanceof == 'File') {
					let file = data.get(value.id) as File;
					file.path = value.path;
					data.delete(value.id);
					return file;
				}
				return value;
			});
		} catch (e) {
			body[key] = data.get(key) as string;
		}
	}
	let _id = data.get('_id') as string;

	for (let field of collection_schema.fields) {
		let widget = widgets[field.widget.key];
		let fieldName = getFieldName(field);

		if (field?.permissions?.[user.role]?.write == false) {
			// if we cant write there is nothing to modify.
			delete body[fieldName];
		} else if ('modifyRequest' in widget) {
			// widget can modify own portion of body;

			body[fieldName] = await widget.modifyRequest({ collection, field, data: body[fieldName], user, type: 'PATCH', id: _id });
		}
	}
	await saveImages(body, params.collection);
	return new Response(JSON.stringify(await collection.updateOne({ _id }, body, { upsert: true })));
};

export const POST: RequestHandler = async ({ params, request, cookies }) => {
	let data = await request.formData();
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let user_id = data.get('user_id') as string;
	let user = user_id ? ((await auth.get_user_by_id(user_id)) as User) : ((await auth.validateSession(session_id)) as User);
	if (!user) {
		return new Response('', { status: 403 });
	}
	let collection_schema = (await getCollections()).find((c) => c.name == params.collection) as Schema;
	let has_write_access = collection_schema?.permissions?.[user.role]?.write != false;
	if (!has_write_access) {
		return new Response('', { status: 403 });
	}

	let collections = await getCollectionModels();
	let collection = collections[params.collection];
	let body: { [key: string]: any } = {};
	for (let key of data.keys()) {
		try {
			body[key] = JSON.parse(data.get(key) as string, (key, value) => {
				if (value?.instanceof == 'File') {
					let file = data.get(value.id) as File;
					file.path = value.path;
					data.delete(value.id);
					return file;
				}
				return value;
			});
		} catch (e) {
			body[key] = data.get(key) as string;
		}
	}
	body['status'] = 'PUBLISHED';
	if (!collection) return new Response('collection not found!!');

	for (let field of collection_schema.fields) {
		let widget = widgets[field.widget.key];
		let fieldName = getFieldName(field);

		if (field?.permissions?.[user.role]?.write == false) {
			// if we cant read there is nothing to modify.
			delete body[fieldName];
		} else if ('modifyRequest' in widget) {
			// widget can modify own portion of body;

			body[fieldName] = await widget.modifyRequest({ collection, field, data: body[fieldName], user, type: 'POST' });
		}
	}
	await saveImages(body, params.collection);
	return new Response(JSON.stringify(await collection.insertMany(body)));
};

export const DELETE: RequestHandler = async ({ params, request, cookies }) => {
	let data = await request.formData();
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let user_id = data.get('user_id') as string;
	let user = user_id ? ((await auth.get_user_by_id(user_id)) as User) : ((await auth.validateSession(session_id)) as User);
	if (!user) {
		return new Response('', { status: 403 });
	}
	let has_write_access = (await getCollections()).find((c) => c.name == params.collection)?.permissions?.[user.role]?.write;
	if (!has_write_access) {
		return new Response('', { status: 403 });
	}
	let collections = await getCollectionModels();
	let collection = collections[params.collection];

	let ids = data.get('ids') as string;
	ids = JSON.parse(ids);
	console.log(ids);

	return new Response(
		JSON.stringify(
			await collection.deleteMany({
				_id: {
					$in: ids
				}
			})
		)
	);
};
