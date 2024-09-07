import type { Schema } from '@src/collections/types';
import { getCollectionModels } from '../db';
import mongoose from 'mongoose';

import type { User } from '@src/auth/types';
import { modifyRequest } from './modifyRequest';
export let _DELETE = async ({
	data,
	schema,
	user
}: {
	data: FormData;
	schema: Schema;
	user: User;
}) => {
	let collections = await getCollectionModels();
	let collection = collections[schema.id as string];

	let ids = data.get('ids') as string;
	ids = JSON.parse(ids);

	for (let id of ids) {
		await modifyRequest({
			collection,
			data: [
				{
					_id: new mongoose.Types.ObjectId(id)
				}
			],
			user,
			fields: schema.fields,
			type: 'DELETE'
		});
		for (let link of schema.links || []) {
			let collection = collections[link];
			await collection.deleteMany({
				_link_id: new mongoose.Types.ObjectId(id),
				_linked_collection: schema.id
			});
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
