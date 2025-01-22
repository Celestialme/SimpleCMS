import mongoose from 'mongoose';
import { collections } from '@src/stores/store.svelte';

import { Auth } from '@src/auth';
import { writeCollection } from '@src/utils/collections';
import { sanitizePermissions } from '@src/collections/types';
import { Adapter } from '@src/utils/adapters/mongo';

console.log('updating db...');
for (let collection of Object.values(collections())) {
	if (!collection.id || collection.fields.some((field) => !(field.params as any).id)) {
		!collection.id && (collection.id = new mongoose.Types.ObjectId().toString());
		await writeCollection({
			collectionName: collection.path?.replaceAll('::', '/'),
			fields: collection.fields,
			icon: collection.icon,
			originalName: collection.path?.replaceAll('::', '/'),
			permissions: sanitizePermissions(collection.permissions),
			id: collection.id
		});
	}
}

export let adapter = new Adapter(collections());
export let auth = new Auth(adapter);
await adapter.setup();
await auth.fetchData();
