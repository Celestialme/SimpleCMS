import type { Schema } from '@src/collections/types';
import { collectionModels } from '../db';

export let _SETSTATUS = async ({ data, schema }: { data: FormData; schema: Schema }) => {
	let collections = collectionModels;
	let collection = collections[schema.id as string];
	let ids = data.get('ids') as string;
	ids = JSON.parse(ids);
	let status = data.get('status') as string;
	return new Response(
		JSON.stringify(
			await collection.updateMany(
				{
					_id: {
						$in: ids
					}
				},
				{ status }
			)
		)
	);
};
