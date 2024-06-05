import { getCollections } from '@src/collections';
import type { RequestHandler } from './$types';
import { auth, getCollectionModels } from '@src/routes/api/db';
import { getFieldName, get_elements_by_id } from '@src/utils/utils';
import widgets from '@src/components/widgets';
import publicConfig from '@root/config/public';
import { SESSION_COOKIE_NAME } from '@src/auth';
import type { Schema } from '@src/collections/types';
import type { User } from '@src/auth/types';
import mongoose from 'mongoose';

export const GET: RequestHandler = async ({ params, url, cookies }) => {
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let user_id = url.searchParams.get('user_id');
	let user = user_id
		? ((await auth.checkUser({ _id: user_id })) as User)
		: ((await auth.validateSession(session_id)) as User);
	if (!user) {
		return new Response('', { status: 403 });
	}
	let collection_schema = (await getCollections()).find(
		(c) => c.name == params.collection
	) as Schema;
	let has_read_access = collection_schema?.permissions?.[user.role]?.read != false;
	if (!has_read_access) {
		return new Response('', { status: 403 });
	}
	let collections = await getCollectionModels();
	let page = parseInt(url.searchParams.get('page') as string) || 1;

	let collection = collections[params.collection];
	let length = parseInt(url.searchParams.get('length') as string) || 0;
	let filter: { [key: string]: string } =
		JSON.parse(url.searchParams.get('filter') as string) || {};
	let sort: { [key: string]: number } = JSON.parse(url.searchParams.get('sort') as string) || {};

	let contentLanguage =
		(url.searchParams.get('contentLanguage') as string) || publicConfig.DEFAULT_CONTENT_LANGUAGE;
	let skip = (page - 1) * length;

	let aggregations: any = [];

	for (let field of collection_schema.fields) {
		let widget = widgets[field.widget.Name];
		let fieldName = getFieldName(field);
		if ('aggregations' in widget) {
			let _filter = filter[fieldName];
			let _sort = sort[fieldName];

			if (widget.aggregations.filters && _filter) {
				let _aggregations = await widget.aggregations.filters({
					field,
					contentLanguage: contentLanguage,
					filter: _filter
				});
				aggregations.push(..._aggregations);
			}
			if (widget.aggregations.sorts && _sort) {
				let _aggregations = await widget.aggregations.sorts({
					field,
					contentLanguage: contentLanguage,
					sort: _sort
				});
				aggregations.push(..._aggregations);
			}
		}
	}
	let entryListWithCount = await collection.aggregate([
		{
			$facet: {
				entries: [...aggregations, { $skip: skip }, ...(length ? [{ $limit: length }] : [])],
				totalCount: [...aggregations, { $count: 'total' }]
			}
		}
	]);
	let entryList = entryListWithCount[0].entries;

	for (let field of collection_schema.fields) {
		let widget = widgets[field.widget.Name];
		let fieldName = getFieldName(field);

		if ('modifyRequest' in widget) {
			// widget can modify own portion of entryList;
			entryList = await Promise.all(
				entryList.map(async (entry: any) => {
					let data = {
						get() {
							return entry[fieldName];
						},
						update(newData) {
							entry[fieldName] = newData;
						}
					};
					await widget.modifyRequest({
						collection,
						field,
						data,
						user,
						type: 'GET',
						id: entry._id,
						meta_data: entry.meta_data
					});
					return entry;
				})
			);
		}
	}
	await get_elements_by_id.getAll(); //get all collected ids together and modify request.
	let totalCount = entryListWithCount[0].totalCount[0]
		? entryListWithCount[0].totalCount[0].total
		: 0;

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
	let user = user_id
		? ((await auth.checkUser({ _id: user_id })) as User)
		: ((await auth.validateSession(session_id)) as User);
	if (!user) {
		return new Response('', { status: 403 });
	}
	let collection_schema = (await getCollections()).find(
		(c) => c.name == params.collection
	) as Schema;
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
		let widget = widgets[field.widget.Name];
		let fieldName = getFieldName(field);

		if ('modifyRequest' in widget) {
			// widget can modify own portion of body;
			let data = {
				get() {
					return body[fieldName];
				},
				update(newData) {
					body[fieldName] = newData;
				}
			};
			await widget.modifyRequest({
				collection,
				field,
				data,
				user,
				type: 'PATCH',
				id: new mongoose.Types.ObjectId(_id),
				meta_data: body._meta_data
			});
		}
	}
	if (body?._meta_data?.storage_images?.removed) {
		await mongoose.models['_storage_images'].updateMany(
			{ _id: { $in: body?._meta_data?.storage_images?.removed } },
			{ $pull: { used_by: new mongoose.Types.ObjectId(_id) } }
		);
	}
	console.log(body?._meta_data?.storage_images?.removed);
	return new Response(JSON.stringify(await collection.updateOne({ _id }, body, { upsert: true })));
};

export const POST: RequestHandler = async ({ params, request, cookies }) => {
	let data = await request.formData();
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let user_id = data.get('user_id') as string;
	let user = user_id
		? ((await auth.checkUser({ _id: user_id })) as User)
		: ((await auth.validateSession(session_id)) as User);
	if (!user) {
		return new Response('', { status: 403 });
	}
	let collection_schema = (await getCollections()).find(
		(c) => c.name == params.collection
	) as Schema;
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
	body._id = new mongoose.Types.ObjectId();
	for (let field of collection_schema.fields) {
		let widget = widgets[field.widget.Name];
		let fieldName = getFieldName(field);

		if ('modifyRequest' in widget) {
			// widget can modify own portion of body;
			let data = {
				get() {
					return body[fieldName];
				},
				update(newData) {
					body[fieldName] = newData;
				}
			};
			await widget.modifyRequest({
				collection,
				field,
				data,
				user,
				type: 'POST',
				id: body._id,
				meta_data: body._meta_data
			});
		}
	}

	return new Response(JSON.stringify(await collection.insertMany(body)));
};

export const DELETE: RequestHandler = async ({ params, request, cookies }) => {
	let data = await request.formData();
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let user_id = data.get('user_id') as string;
	let user = user_id
		? ((await auth.checkUser({ _id: user_id })) as User)
		: ((await auth.validateSession(session_id)) as User);
	if (!user) {
		return new Response('', { status: 403 });
	}
	let collection_schema = (await getCollections()).find(
		(c) => c.name == params.collection
	) as Schema;
	let has_write_access = collection_schema?.permissions?.[user.role]?.write != false;
	if (!has_write_access) {
		return new Response('', { status: 403 });
	}

	let collections = await getCollectionModels();
	let collection = collections[params.collection];

	let ids = data.get('ids') as string;
	ids = JSON.parse(ids);

	for (let id of ids) {
		for (let field of collection_schema.fields) {
			let widget = widgets[field.widget.Name];

			if ('modifyRequest' in widget) {
				// widget can modify own portion of body;
				let data = {
					get() {},
					update() {}
				};
				await widget.modifyRequest({
					collection,
					field,
					data,
					user,
					type: 'DELETE',
					id: new mongoose.Types.ObjectId(id)
				});
			}
		}
	}
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
