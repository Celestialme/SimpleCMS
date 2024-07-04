import type { Schema } from '@src/collections/types';
import { getCollectionModels } from '../db';
import mongoose from 'mongoose';

import type { User } from '@src/auth/types';
import { modifyRequest } from './modifyRequest';
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
	let collections = await getCollectionModels();
	let collection = collections[schema.name as string];
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
	await modifyRequest({ data: [body], fields: schema.fields, collection, user, type: 'POST' });

	return new Response(JSON.stringify(await collection.insertMany(body)));
};
