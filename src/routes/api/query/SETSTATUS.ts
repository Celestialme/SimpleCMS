import type { Schema } from '@src/collections/types';
import { adapter, collectionModels } from '../db';

export let _SETSTATUS = async ({ data, schema }: { data: FormData; schema: Schema }) => {
	let _ids = data.get('ids') as string;
	_ids = JSON.parse(_ids);
	let status = data.get('status') as string;
	let resp = await adapter.updateMany(schema.path as string, { status, _ids });
	return new Response(JSON.stringify(resp));
};
