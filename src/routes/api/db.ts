import { collections } from '@stores/load';
import { PUBLIC_SITENAME } from '$env/static/public';
import type { Unsubscriber } from 'svelte/store';

//Auth
import { Auth } from '@src/auth';

// mongoose
import mongoose from 'mongoose';
import {
	DB_HOST,
	DB_NAME,
	DB_USER,
	DB_PASSWORD,
	HOST_PROD,
	HOST_DEV,
	SECRET_GOOGLE_CLIENT_ID,
	SECRET_GOOGLE_CLIENT_SECERT
} from '$env/static/private';
import { mongooseSessionSchema, mongooseTokenSchema, mongooseUserSchema } from '@src/auth/types';

// Turn off strict mode for query filters. Default in Mongodb 7
mongoose.set('strictQuery', false);

console.log('\n\x1b[33m\x1b[5m====> Trying to Connect to your defined ' + DB_NAME + ' database ...\x1b[0m');

// Connect to MongoDB database using imported environment variables
try {
	await mongoose.connect(DB_HOST, {
		authSource: 'admin',
		user: DB_USER,
		pass: DB_PASSWORD,
		dbName: DB_NAME
	});
	console.log(`\x1b[32m====> Connection to ${DB_NAME} database successful!\x1b[0m\n====> Enjoying your \x1b[31m${PUBLIC_SITENAME}\x1b[0m`);
} catch (error) {
	console.error('\x1b[31mError connecting to database:\x1b[0m', error);
	throw new Error('Error connecting to database');
}

// Initialize collections object
const collectionsModels: { [Key: string]: mongoose.Model<any> } = {};
let unsubscribe: Unsubscriber | undefined;

// Set up collections in the database using imported schemas
export async function getCollectionModels() {
	// Return a new Promise that resolves with the collectionsModels object
	return new Promise<any>((resolve) => {
		// Subscribe to the collections store
		unsubscribe = collections.subscribe((collections) => {
			// If collections are defined
			if (collections) {
				// Iterate over each collection
				for (const collection of collections) {
					// Create a detailed revisions schema
					const RevisionSchema = new mongoose.Schema(
						{
							revisionNumber: { type: Number, default: 0 },
							editedAt: { type: Date, default: Date.now },
							editedBy: { type: String, default: 'System' },
							changes: { type: Object, default: {} }
						},
						{ _id: false }
					);

					// Create a new mongoose schema using the collection's fields and timestamps
					const schema_object = new mongoose.Schema(
						{
							createdAt: Number,
							updatedAt: Number,
							createdBy: String,
							__v: [RevisionSchema] // versionKey
						},
						{
							typeKey: '$type',
							strict: false,
							timestamps: { currentTime: () => Date.now() }
						}
					);

					// Add the revision field to the schema

					// Add the mongoose model for the collection to the collectionsModels object
					if (!collection.name) return;
					collectionsModels[collection.name] = mongoose.models[collection.name]
						? mongoose.model(collection.name)
						: mongoose.model(collection.name, schema_object);
				}

				// Unsubscribe from the collections store and resolve the Promise with the collectionsModels object
				unsubscribe && unsubscribe();
				unsubscribe = undefined;
				resolve(collectionsModels);
			}
		});
	});
}

// Set up authentication collections if they don't already exist
!mongoose.models['auth_tokens'] && mongoose.model('auth_tokens', mongooseTokenSchema);
!mongoose.models['auth_users'] && mongoose.model('auth_users', mongooseUserSchema);
!mongoose.models['auth_sessions'] && mongoose.model('auth_sessions', mongooseSessionSchema);

let auth = new Auth({
	User: mongoose.models['auth_users'],
	Session: mongoose.models['auth_sessions'],
	Token: mongoose.models['auth_tokens']
});

// Google OAuth2 - optional authentication
let googleAuth;

// if (SECRET_GOOGLE_CLIENT_ID && SECRET_GOOGLE_CLIENT_SECERT) {
// 	googleAuth = google(auth, {
// 		clientId: SECRET_GOOGLE_CLIENT_ID,
// 		clientSecret: SECRET_GOOGLE_CLIENT_SECERT,
// 		redirectUri: `${dev ? HOST_DEV : HOST_PROD}/oauth`,
// 		scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'openid'],
// 		accessType: dev ? 'offline' : 'online'
// 	});
// } else {
// 	console.warn('Google client ID and secret not provided. Google OAuth will not be available.');
// }

// Export collections and auth objects
export { collectionsModels, auth };
