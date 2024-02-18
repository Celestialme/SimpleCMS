import mongoose from 'mongoose';
import privateEnv from '@root/config/private';
import { collections } from '@src/stores/load';
import type { Unsubscriber } from 'svelte/store';
import { Auth } from '@src/auth';
import { mongooseSessionSchema, mongooseTokenSchema, mongooseUserSchema } from '@src/auth/types';

mongoose
	.connect(privateEnv.DB_HOST, {
		authSource: 'admin',
		user: privateEnv.DB_USER,
		pass: privateEnv.DB_PASSWORD,
		dbName: privateEnv.DB_NAME
	})
	.then(() => console.log('---------------------connected-----------------------'));
mongoose.set('strictQuery', false);
let collectionsModels: { [Key: string]: mongoose.Model<any> } = {};
let unsubscribe: Unsubscriber | undefined;
export async function getCollectionModels() {
	return new Promise<typeof collectionsModels>((resolve) => {
		unsubscribe = collections.subscribe((collections) => {
			if (collections) {
				for (let collection of collections) {
					const schema_object = new mongoose.Schema(
						{ createdAt: Number, updatedAt: Number },
						{
							typeKey: '$type',
							strict: false,
							timestamps: { currentTime: () => Date.now() }
						}
					);
					if (!collection.name) return;
					collectionsModels[collection.name] = mongoose.models[collection.name]
						? mongoose.model(collection.name)
						: mongoose.model(collection.name, schema_object);
				}

				unsubscribe && unsubscribe();
				unsubscribe = undefined;
				resolve(collectionsModels);
			}
		});
	});
}

!mongoose.models['auth_tokens'] && mongoose.model('auth_tokens', mongooseTokenSchema);
!mongoose.models['auth_users'] && mongoose.model('auth_users', mongooseUserSchema);
!mongoose.models['auth_sessions'] && mongoose.model('auth_sessions', mongooseSessionSchema);

let auth = new Auth({
	User: mongoose.models['auth_users'],
	Session: mongoose.models['auth_sessions'],
	Token: mongoose.models['auth_tokens']
});
export { collectionsModels, auth };
