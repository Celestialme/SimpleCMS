import type { Schema } from '@src/collections/types';
import { getCollectionModels } from '../db';
import mongoose from 'mongoose';

import type { User } from '@src/auth/types';
import { modifyRequest } from './modifyRequest';
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
	let collections = await getCollectionModels();
	let collection = collections[schema.name as string];
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

	return new Response(JSON.stringify(await collection.updateOne({ _id }, body, { upsert: true })));
};
