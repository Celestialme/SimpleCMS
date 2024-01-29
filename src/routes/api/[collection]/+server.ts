import { getCollections } from '@src/collections';
import type { RequestHandler } from './$types';
import { auth, getCollectionModels } from '@src/routes/api/db';
import { parse, saveImages, validate } from '@src/utils/utils';
import { DEFAULT_SESSION_COOKIE_NAME } from 'lucia';
import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';

export const GET: RequestHandler = async ({ params, url, cookies }) => {
	let session = cookies.get(DEFAULT_SESSION_COOKIE_NAME) as string;
	let user = await validate(auth, session);

	let collection_schema = (await getCollections()).find((c) => c.name == params.collection) as Schema;
	let aggregations: any = [];
	for (let field of collection_schema.fields) {
		let widget = widgets[field.widget.key];
		console.log(widget);
		if ('aggregations' in widget) {
			let _aggregations = (widget.aggregations as (field: any) => Array<any>)(field);
			aggregations.push(..._aggregations);
		}
	}
	let has_read_access = (await getCollections()).find((c) => c.name == params.collection)?.permissions?.[user.user.role]?.read ?? true;
	if (user.status != 200 || !has_read_access) {
		return new Response('', { status: 403 });
	}
	let collections = await getCollectionModels();
	let page = parseInt(url.searchParams.get('page') as string) || 1;
	let collection = collections[params.collection];
	let length = parseInt(url.searchParams.get('length') as string) || Infinity;
	let filter = JSON.parse(url.searchParams.get('filter') as string) || {};
	let sort = JSON.parse(url.searchParams.get('sort') as string) || { _id: 0 };
	let skip = (page - 1) * length;
	let entryList = await collection
		.aggregate([...aggregations])
		.sort(sort)
		.skip(skip)
		.limit(length);
	let pagesCount = Math.ceil((await collection.find(filter)).length / length);
	return new Response(
		JSON.stringify({
			entryList,
			pagesCount
		})
	);
};

export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
	let session = cookies.get(DEFAULT_SESSION_COOKIE_NAME) as string;
	let user = await validate(auth, session);
	console.log((await getCollections()).find((c) => c.name == params.collection)?.permissions);
	let has_write_access = (await getCollections()).find((c) => c.name == params.collection)?.permissions?.[user.user.role]?.write ?? true;
	if (user.status != 200 || !has_write_access) {
		return new Response('', { status: 403 });
	}
	let collections = await getCollectionModels();
	let collection = collections[params.collection];
	let data = await request.formData();
	let formData: any = {};
	for (let key of data.keys()) {
		try {
			formData[key] = JSON.parse(data.get(key) as string);
		} catch (e) {
			formData[key] = data.get(key) as string;
		}
	}
	let _id = data.get('_id');
	formData = parse(formData);
	let files = await saveImages(data, params.collection);

	return new Response(JSON.stringify(await collection.updateOne({ _id }, { ...formData, ...files }, { upsert: true })));
};

export const POST: RequestHandler = async ({ params, request, cookies }) => {
	let session = cookies.get(DEFAULT_SESSION_COOKIE_NAME) as string;
	let user = await validate(auth, session);
	let has_write_access = (await getCollections()).find((c) => c.name == params.collection)?.permissions?.[user.user.role]?.write ?? true;
	if (user.status != 200 || !has_write_access) {
		return new Response('', { status: 403 });
	}

	let collections = await getCollectionModels();
	let collection = collections[params.collection];
	let data = await request.formData();
	let body: any = {};
	for (let key of data.keys()) {
		try {
			body[key] = JSON.parse(data.get(key) as string);
		} catch (e) {
			body[key] = data.get(key) as string;
		}
	}
	body['status'] = 'PUBLISHED';
	if (!collection) return new Response('collection not found!!');
	let files = await saveImages(data, params.collection);

	return new Response(JSON.stringify(await collection.insertMany({ ...body, ...files })));
};

export const DELETE: RequestHandler = async ({ params, request, cookies }) => {
	let session = cookies.get(DEFAULT_SESSION_COOKIE_NAME) as string;
	let user = await validate(auth, session);
	console.log((await getCollections()).find((c) => c.name == params.collection)?.permissions);
	let has_write_access = (await getCollections()).find((c) => c.name == params.collection)?.permissions?.[user.user.role]?.write ?? true;
	if (user.status != 200 || !has_write_access) {
		return new Response('', { status: 403 });
	}
	let collections = await getCollectionModels();
	let collection = collections[params.collection];
	let data = await request.formData();

	let ids = data.get('ids') as string;
	ids = JSON.parse(ids);
	console.log(ids);
	console.log(typeof ids);

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
