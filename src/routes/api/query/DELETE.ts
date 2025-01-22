import type { Schema } from '@src/collections/types';
import { adapter } from '../db';
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
			await adapter.deleteMany(collections()[link].id + '_links', [
				{
					_link_id: {
						value: id,
						strict: true
					},
					_linked_collection: {
						value: schema.id,
						strict: true
					}
				}
			]);
		}
	}

	return new Response(JSON.stringify(await adapter.deleteById(schema.path as string, ids)));
};
