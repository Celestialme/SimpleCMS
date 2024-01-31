import { getCollections } from '@src/collections';
import type { RequestHandler } from './$types';
import { auth, getCollectionModels } from '@src/routes/api/db';
import { getFieldName, parse, saveImages, validate } from '@src/utils/utils';
import { DEFAULT_SESSION_COOKIE_NAME } from 'lucia';
import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';
import { PUBLIC_CONTENT_LANGUAGE } from '$env/static/public';

export const GET: RequestHandler = async ({ params, url, cookies }) => {
	let session = cookies.get(DEFAULT_SESSION_COOKIE_NAME) as string;
	let user = await validate(auth, session);

	let collection_schema = (await getCollections()).find((c) => c.name == params.collection) as Schema;

	let has_read_access = (await getCollections()).find((c) => c.name == params.collection)?.permissions?.[user.user.role]?.read ?? true;
	if (user.status != 200 || !has_read_access) {
		return new Response('', { status: 403 });
	}
	let collections = await getCollectionModels();
	let page = parseInt(url.searchParams.get('page') as string) || 1;
	let collection = collections[params.collection];
	let length = parseInt(url.searchParams.get('length') as string) || Infinity;
	let filter: { [key: string]: string } = JSON.parse(url.searchParams.get('filter') as string) || {};
	let sort: { [key: string]: number } = JSON.parse(url.searchParams.get('sort') as string) || {};

	let contentLanguage = JSON.parse(url.searchParams.get('contentLanguage') as string) || PUBLIC_CONTENT_LANGUAGE;
	let skip = (page - 1) * length;

	let aggregations: any = [];
	for (let field of collection_schema.fields) {
		let widget = widgets[field.widget.key];
		let fieldName = getFieldName(field);
		if ('aggregations' in widget) {
			let _filter = filter[fieldName];
			let _sort = sort[fieldName];
			if (widget.aggregations.transformations) {
				let _aggregations = await widget.aggregations.transformations({ field, contentLanguage: contentLanguage });
				aggregations.push(..._aggregations);
			}
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
	console.log(aggregations);
	let entryListWithCount = await collection.aggregate([
		{
			$facet: {
				entries: [...aggregations, { $skip: skip }, { $limit: length }],
				totalCount: [...aggregations, { $count: 'total' }]
			}
		}
	]);
	let entryList = entryListWithCount[0].entries;
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
