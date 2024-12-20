import type { Schema } from '@src/collections/types';
import { adapter, collectionModels } from '../db';
import mongoose from 'mongoose';

import type { User } from '@src/auth/types';
import { modifyRequest } from './modifyRequest';
import { collections } from '@src/stores/store.svelte';
export let _POST = async ({
	data,
	schema,
	user
}: {
	data: FormData;
	schema: Schema;
	user: User;
}) => {
	let body: { [key: string]: any } = {};
	let storage = { images: new Set<ObjectId>() };
	let collection = collectionModels[schema.id as string];
	let fileIDS: string[] = [];
	for (let key of data.keys()) {
		try {
			body[key] = JSON.parse(data.get(key) as string, (key, value) => {
				if (value?.instanceof == 'File') {
					fileIDS.push(value.id);
					let file = data.get(value.id) as File;
					return file;
				}
				return value;
			});
		} catch (e) {
			body[key] = data.get(key) as string;
		}
	}
	for (let id of fileIDS) {
		delete body[id];
	}
	body['status'] = 'PUBLISHED';
	if (!collection) return new Response('collection not found!!');
	body._id = new mongoose.Types.ObjectId();
	await modifyRequest({
		data: [body],
		fields: schema.fields,
		collection: schema,
		user,
		type: 'POST',
		storage
	});

	for (let _collection in body._links) {
		if (body._links[_collection] == false) continue;
		let collection = collectionModels[collections()[_collection].id as string];

		let _id = new mongoose.Types.ObjectId();
		await collection.insertMany({
			_id,
			_link_id: body._id,
			_linked_collection: schema.path
		});
		body._links[_collection] = _id;
	}
	body._storage_images = Array.from(storage.images);

	return new Response(JSON.stringify(await adapter.insert(schema.path as string, body)));
};
