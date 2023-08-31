import mongoose from 'mongoose';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from '$env/static/private';
import { collections } from '@src/stores/load';
import lucia from 'lucia-auth';
import adapter from '@lucia-auth/adapter-mongoose';
import { session, key, UserSchema } from '@src/collections/Auth';
import { sveltekit } from 'lucia-auth/middleware';
import { fieldsToSchema } from '@src/utils/utils';
import type { Unsubscriber } from 'svelte/store';

mongoose
	.connect(DB_HOST, {
		authSource: 'admin',
		user: DB_USER,
		pass: DB_PASSWORD,
		dbName: DB_NAME
	})
	.then(() => console.log('---------------------connected-----------------------'));
mongoose.set('strictQuery', false);
let collectionsModels: { [Key: string]: mongoose.Model<any> } = {};
let unsubscribe: Unsubscriber | undefined;
export async function getCollectionModels() {
	return new Promise<any>((resolve) => {
		unsubscribe = collections.subscribe((collections) => {
			if (collections) {
				for (let collection of collections) {
					const schema_object = new mongoose.Schema(
						{ ...fieldsToSchema(collection.fields), createdAt: Number, updatedAt: Number },
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

!mongoose.models['auth_session'] && mongoose.model('auth_session', new mongoose.Schema({ ...session }, { _id: false }));
!mongoose.models['auth_key'] && mongoose.model('auth_key', new mongoose.Schema({ ...key }, { _id: false }));
!mongoose.models['auth_user'] && mongoose.model('auth_user', new mongoose.Schema({ ...UserSchema }, { _id: false, timestamps: true }));
const auth = lucia({
	adapter: adapter(mongoose),
	//for production & cloned dev environment
	// env: dev ? "DEV" : "PROD",
	env: 'DEV',

	autoDatabaseCleanup: true,
	transformDatabaseUser: (userData) => {
		return {
			...userData
		};
	},
	middleware: sveltekit()
});

export { collectionsModels, auth };
