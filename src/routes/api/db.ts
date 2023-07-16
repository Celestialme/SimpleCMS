import mongoose from 'mongoose';
import { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } from '$env/static/private';
import schemas from '@src/collections';
import { fieldsToSchema } from '@src/utils/utils';
import { dev } from '$app/environment';

// Lucia
import lucia, { type Session, type User } from 'lucia-auth';
import adapter from '@lucia-auth/adapter-mongoose';
import { session, key, UserSchema } from '@src/collections/Auth';
import { sveltekit } from 'lucia-auth/middleware';

// Turn off strict mode for query filters. Default in Mongodb 7
mongoose.set('strictQuery', false);

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

let collections: { [Key: string]: mongoose.Model<any> } = {};

for (let schema of schemas) {
	const schema_object = new mongoose.Schema(
		{ ...fieldsToSchema(schema.fields), createdAt: Number, updatedAt: Number },
		{
			typeKey: '$type',
			strict: false,
			timestamps: { currentTime: () => Date.now() }
		}
	);
	// Check if a model with the same name already exists
	if (mongoose.models[schema.name]) {
		// If it does, retrieve the existing model
		collections[schema.name] = mongoose.model(schema.name);
	} else {
		// If it doesn't, create a new model and assign it to the collections object
		collections[schema.name] = mongoose.model(schema.name, schema_object);
	}
}

!mongoose.models['auth_session'] &&
	mongoose.model('auth_session', new mongoose.Schema({ ...session }, { _id: false }));
!mongoose.models['auth_key'] &&
	mongoose.model('auth_key', new mongoose.Schema({ ...key }, { _id: false }));
!mongoose.models['auth_user'] &&
	mongoose.model(
		'auth_user',
		new mongoose.Schema({ ...UserSchema }, { _id: false, timestamps: true })
	);

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

export { collections, auth };
