import collections from '@src/collections';
import { fieldsToSchema } from '@src/utils/utils';
import { dev } from '$app/environment';

// Lucia
import lucia from 'lucia-auth';
import adapter from '@lucia-auth/adapter-mongoose';
import { session, key, UserSchema } from '@src/collections/Auth';
import { sveltekit } from 'lucia-auth/middleware';

// mongoose
import mongoose from 'mongoose';
import { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } from '$env/static/private';

// Turn off strict mode for query filters. Default in Mongodb 7
mongoose.set('strictQuery', false);

// Connect to MongoDB database using imported environment variables
mongoose
	.connect(DB_HOST, {
		authSource: 'admin',
		user: DB_USER,
		pass: DB_PASSWORD,
		dbName: DB_NAME
	})
	.then(() =>
		console.log(
			'---------------------Connection to database is successful! -----------------------'
		)
	)
	.catch((error) => console.error('Error connecting to database:', error));

// Initialize collections object
const collectionsModels: { [Key: string]: mongoose.Model<any> } = {};

// Set up collections in the database using imported schemas
export async function getCollectionModels() {
	return new Promise<any>((resolve) => {
		const unsubscribe = collections.subscribe((collections) => {
			if (collections) {
				for (const schema of collections) {
					const schema_object = new mongoose.Schema(
						{ ...fieldsToSchema(schema.fields), createdAt: Number, updatedAt: Number },
						{
							typeKey: '$type',
							strict: false,
							timestamps: { currentTime: () => Date.now() }
						}
					);
					collectionsModels[schema.name] = mongoose.models[schema.name]
						? mongoose.model(schema.name)
						: mongoose.model(schema.name, schema_object);
				}
				resolve(collectionsModels);
				unsubscribe();
			}
		});
	});
}

// Set up authentication collections if they don't already exist
!mongoose.models['auth_session'] &&
	mongoose.model('auth_session', new mongoose.Schema({ ...session }, { _id: false }));
!mongoose.models['auth_key'] &&
	mongoose.model('auth_key', new mongoose.Schema({ ...key }, { _id: false }));
!mongoose.models['auth_user'] &&
	mongoose.model(
		'auth_user',
		new mongoose.Schema({ ...UserSchema }, { _id: false, timestamps: true })
	);

// Set up authentication using Lucia and export auth object
const auth = lucia({
	adapter: adapter(mongoose),

	//for production & cloned dev environment
	env: dev ? 'DEV' : 'PROD',

	autoDatabaseCleanup: true,

	transformDatabaseUser: (userData) => {
		return {
			...userData
		};
	},
	middleware: sveltekit()
});

// Export collections and auth objects
export { collectionsModels, auth };
