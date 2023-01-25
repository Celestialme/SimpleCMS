import mongoose from 'mongoose';
import env from '@root/env';
import schemas from '@src/collections';
import { fieldsToSchema } from '@src/utils/utils';
import lucia, { generateRandomString } from 'lucia-auth';
import adapter from '@lucia-auth/adapter-mongoose';
import { user, session } from '@src/collections/Auth';
mongoose.set('strictQuery', false);
mongoose.connect(env.DB_HOST, {
	authSource: 'admin',
	user: env.DB_USER,
	pass: env.DB_PASSWORD,
	dbName: env.DB_NAME
}).then(()=>console.log("---------------------connected-----------------------"));
mongoose.set('strictQuery', false);
let collections: { [Key: string]: mongoose.Model<any> } = {};

// iterates over an array of schemas and creates a new Mongoose schema and model for each on
//if collections is not empty


for (let schema of schemas) {
	const schema_object = new mongoose.Schema(
		{ ...fieldsToSchema(schema.fields), createdAt: Number, updatedAt: Number },
		{
			strict: schema.strict || false,
			timestamps: { currentTime: () => Date.now() }
		}
	);
	collections[schema.name] = mongoose.model(schema.name, schema_object);
}




mongoose.model('user', new mongoose.Schema({ ...user }, { _id: false }));
mongoose.model('session', new mongoose.Schema({ ...session }, { _id: false }));
const auth = lucia({
	adapter: adapter(mongoose),
	env: 'DEV',
	generateCustomUserId: async () => generateRandomString(32),
	transformUserData: (user) => ({
		userId: user.id,
		username: user.username
	})
});



export {collections,auth}


