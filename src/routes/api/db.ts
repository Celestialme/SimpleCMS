import mongoose from 'mongoose';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from '$env/static/private';
import { collections } from '@src/stores/load';
import { lucia } from 'lucia';
import { mongoose as adapter } from '@lucia-auth/adapter-mongoose';
import { session, key, UserSchema, TokenSchema, UserSchema2, session2 } from '@src/collections/Auth';
import { sveltekit } from 'lucia/middleware';
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

!mongoose.models['auth_session'] && mongoose.model('auth_session', new mongoose.Schema({ ...session }, { _id: false }));
!mongoose.models['auth_key'] && mongoose.model('auth_key', new mongoose.Schema({ ...key }, { _id: false }));
!mongoose.models['auth_user'] && mongoose.model('auth_user', new mongoose.Schema({ ...UserSchema }, { _id: false, timestamps: true }));

!mongoose.models['auth_tokens'] && mongoose.model('auth_tokens', new mongoose.Schema({ ...TokenSchema }, { _id: false, timestamps: true }));
!mongoose.models['auth_users2'] && mongoose.model('auth_users2', new mongoose.Schema({ ...UserSchema2 }, { timestamps: true }));
!mongoose.models['auth_sessions2'] && mongoose.model('auth_sessions2', new mongoose.Schema({ ...session2 }));
const auth = lucia({
	adapter: adapter({
		User: mongoose.models['auth_user'],
		Key: mongoose.models['auth_key'],
		Session: mongoose.models['auth_session']
	}),
	//for production & cloned dev environment
	// env: dev ? "DEV" : "PROD",
	env: 'DEV',

	autoDatabaseCleanup: true,
	getUserAttributes: (userData) => {
		return {
			...userData
		};
	},
	middleware: sveltekit()
});

export { collectionsModels, auth };
