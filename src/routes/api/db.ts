import mongoose from 'mongoose';
import privateEnv from '@root/config/private';
import { collections } from '@src/stores/store.svelte';

import { Auth } from '@src/auth';
import { mongooseSessionSchema, mongooseTokenSchema, mongooseUserSchema } from '@src/auth/types';
import { writeCollection } from '@src/utils/collections';
import { sanitizePermissions } from '@src/collections/types';
import { Adapter } from '@src/utils/adapters';

mongoose
	.connect(privateEnv.DB_HOST, {
		authSource: 'admin',
		user: privateEnv.DB_USER,
		pass: privateEnv.DB_PASSWORD,
		dbName: privateEnv.DB_NAME
	})
	.then(() => console.log('---------------------connected-----------------------'));
mongoose.set('strictQuery', false);
console.log('updating db...');
export let collectionModels: { [Key: string]: mongoose.Model<any> } = {};
for (let collection of Object.values(collections())) {
	const schema_object = new mongoose.Schema(
		{ createdAt: Number, updatedAt: Number },
		{
			typeKey: '$type',
			strict: false,
			timestamps: { currentTime: () => Date.now() }
		}
	);
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
	collectionModels[collection.id] = mongoose.models[collection.id]
		? mongoose.model(collection.id)
		: mongoose.model(collection.id, schema_object);
}

!mongoose.models['_storage_images'] &&
	mongoose.model(
		'_storage_images',
		new mongoose.Schema(
			{},
			{
				typeKey: '$type',
				strict: false,
				timestamps: true
			}
		)
	);

!mongoose.models['auth_tokens'] && mongoose.model('auth_tokens', mongooseTokenSchema);
!mongoose.models['auth_users'] && mongoose.model('auth_users', mongooseUserSchema);
!mongoose.models['auth_sessions'] && mongoose.model('auth_sessions', mongooseSessionSchema);

export let auth = new Auth({
	User: mongoose.models['auth_users'],
	Session: mongoose.models['auth_sessions'],
	Token: mongoose.models['auth_tokens']
});
await auth.fetchData();

export let adapter = new Adapter(collections());
await adapter.setup();
