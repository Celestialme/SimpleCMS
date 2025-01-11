import type { Schema } from '@src/collections/types';
import { adapter, collectionModels } from '../db';
import mongoose from 'mongoose';

import type { User } from '@src/auth/types';
import { modifyRequest } from './modifyRequest';
import { collections } from '@src/stores/store.svelte';
export let _DELETE = async ({
	data,
	schema,
	user
}: {
	data: FormData;
	schema: Schema;
	user: User;
}) => {
	let collection = collectionModels[schema.id as string];

	let ids: string[] = JSON.parse(data.get('ids') as string);

	for (let id of ids) {
		await modifyRequest({
			collection: schema,
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
			let collection = collectionModels[collections()[link].id];
			await collection.deleteMany({
				_link_id: new mongoose.Types.ObjectId(id),
				_linked_collection: schema.path
			});
		}
	}
	await adapter.deleteById(schema.path as string, ids);
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
