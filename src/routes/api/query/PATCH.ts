import type { Schema } from '@src/collections/types';
import { collectionModels } from '../db';
import mongoose from 'mongoose';

import type { User } from '@src/auth/types';
import { modifyRequest } from './modifyRequest';
import { collections } from '@src/stores/store.svelte';
export let _PATCH = async ({
	data,
	schema,
	user
}: {
	data: FormData;
	schema: Schema;
	user: User;
}) => {
	let body: { [key: string]: any } = {};

	let collection = collectionModels[schema.id as string];
	let _id = new mongoose.Types.ObjectId(data.get('_id') as string);
	let fileIDS: string[] = [];
	for (let key of data.keys()) {
		try {
			body[key] = JSON.parse(data.get(key) as string, (key, value) => {
				if (value?.instanceof == 'File') {
					let file = data.get(value.id) as File;
					fileIDS.push(value.id);
					return file;
				}
				return value;
			});
		} catch (e) {
			body[key] = data.get(key) as string;
		}
	}
	if (body._is_link) {
		collection = collectionModels[collections()[body._linked_collection].id as string];
	}
	for (let id of fileIDS) {
		delete body[id];
	}
	if (!collection) return new Response('collection not found!!');
	if (body?._meta_data?.storage_images?.removed) {
		await mongoose.models['_storage_images'].updateMany(
			{ _id: { $in: body?._meta_data?.storage_images?.removed } },
			{ $pull: { used_by: new mongoose.Types.ObjectId(_id) } }
		);
	}
	body._id = _id;
	await modifyRequest({ data: [body], fields: schema.fields, collection, user, type: 'PATCH' });

	let links =
		schema?.links?.length || 0 > 0 || body?._is_link
			? (await collection.findById(body._id))._links
			: {};

	for (let _collection in body._links) {
		let collection = collectionModels[collections()[_collection].id as string];
		if (!collection) continue;
		if (!body._links[_collection] && links?.[_collection]) {
			delete body._links[_collection];
			await collection.deleteMany({
				_link_id: body._id,
				_linked_collection: body?._is_link ? body._linked_collection : schema.path
			});
			continue;
		} else if (!body._links[_collection]) continue;

		if (links?.[_collection]) continue;
		let _id = new mongoose.Types.ObjectId();

		await collection.insertMany({
			_id,
			_link_id: body._id,
			_linked_collection: body._is_link ? body._linked_collection : schema.path
		});
		body._links[_collection] = _id;
	}

	delete body._is_link;
	delete body._linked_collection;
	return new Response(JSON.stringify(await collection.updateOne({ _id }, body, { upsert: true })));
};
