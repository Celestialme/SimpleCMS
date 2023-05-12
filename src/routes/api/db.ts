import mongoose from 'mongoose';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from '$env/static/private';
import schemas from '@src/collections';
import lucia, { type Session, type User } from 'lucia-auth';
import adapter from '@lucia-auth/adapter-mongoose';
import { session, key, UserSchema } from '@src/collections/Auth';
import { sveltekit } from 'lucia-auth/middleware';
import { fieldsToSchema } from '@src/utils/utils';
mongoose
	.connect(DB_HOST, {
		authSource: 'admin',
		user: DB_USER,
		pass: DB_PASSWORD,
		dbName: DB_NAME
	})
	.then(() => console.log('---------------------connected-----------------------'));
mongoose.set('strictQuery', false);
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
	collections[schema.name] = mongoose.models[schema.name] ? mongoose.model(schema.name) : mongoose.model(schema.name, schema_object);
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
			userId: userData.id,
			email: userData.email,
			role: userData.role,
			username: userData.username,

			firstname: userData.firstname,
			lastname: userData.lastname,
			avatar: userData.avatar,

			resetRequestedAt: userData.resetRequestedAt,
			resetToken: userData.resetToken,
			lastActiveAt: userData.lastActiveAt
		};
	},
	middleware: sveltekit()
});

export { collections, auth };
