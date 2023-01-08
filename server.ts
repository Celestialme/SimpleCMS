import cors from 'cors';
import schemas from './src/collections';
import { fieldsToSchema, saveFiles, parse } from './src/utils/utils';
import env from './env';
import multer from 'multer';

// Lucia
import adapter from '@lucia-auth/adapter-mongoose';
import lucia, { generateRandomString } from 'lucia-auth';
import { user, session } from './src/collections/Auth';
import cookieParser from 'cookie-parser';

// get url to redirect the user to, with the state
const User = mongoose.model('user', new mongoose.Schema({ ...user }, { _id: false }));

const Session = mongoose.model('session', new mongoose.Schema({ ...session }, { _id: false }));

export const auth = lucia({
	adapter: adapter(mongoose),
	env: 'DEV',
	generateCustomUserId: async () => generateRandomString(32),
	transformUserData: (user) => ({
		userId: user.id,
		username: user.username
	})
});

// MongoDB database - set up a connection using the Mongoose library
import mongoose from 'mongoose';

// use for mongodb Atalas
// mongoose.connect(`mongodb+srv://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}/${env.DB_NAME}?retryWrites=true&w=majority`);

// use for mongodb
mongoose.connect(env.DB_HOST, {
	authSource: 'admin',
	user: env.DB_USER,
	pass: env.DB_PASSWORD,
	dbName: env.DB_NAME
});

// Turn off strict mode for query filters. Default in Mongodb 7
mongoose.set('strictQuery', false);

// Store Mongoose models representing each collection in the database
let collections: { [Key: string]: mongoose.Model<any> } = {};

// iterates over an array of schemas and creates a new Mongoose schema and model for each on
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

// Express Server
import express from 'express';
const app = express();

app.use(multer().any());
app.use(cors());
app.use(cookieParser());
app.get('/get_collections', async (req, res) => {
	console.log(schemas);

	res.send(schemas);
});

// Collection find by ID
app.get('/api/findById', async (req, res) => {
	let collection = collections[req.query.collection as string];
	res.send(await collection.findById(req.query.id as string));
});

app.get('/api/find', async (req, res) => {
	let collection = collections[req.query.collection as string];
	res.send(await collection.find(JSON.parse(req.query.query as string)));
});

// Sign In Route
app.post('/api/signin', async (req, res) => {
	console.log(req.cookies);
	let user = await auth
		.authenticateUser('email', req.body.email, req.body.password)
		.catch(() => null);
	if (!user) return res.send({ status: 404 });
	const session = await auth.createSession(user.userId);
	console.log(user);
	console.log(session);

	res.send({ user: user.username, session: session.sessionId, status: 200 });
});

// Sign Up Route
app.post('/api/signup', async (req, res) => {
	let user = await auth
		.createUser('email', req.body.email, {
			password: req.body.password,
			attributes: {
				username: 'Admin'
			}
		})
		.catch(() => null);
	console.log(user);
	if (!user) return res.send({ status: 404 });
	const session = await auth.createSession(user.userId);
	res.send({ user: user.username, session: session.sessionId, status: 200 });
});

// Validate User Session
app.post('/api/validateSession', async (req, res) => {
	// const resp = await auth.validateSessionUser(req.body.sessionId, () => {}).catch(() => null);
	const resp = await auth.validateSessionUser(req.body.sessionId).catch(() => null);
	if (!resp) return res.send({ status: 404 });
	res.send({ user: resp.user.username, session: resp.session?.sessionId, status: 200 });
});

// GET request that returns a list of entries from a specified collection, with optional pagination and filtering options.
app.get('/api/:endpoint', async (req, res) => {
	let page = parseInt(req.query.page as string) || 1;
	let collection = collections[req.params.endpoint];
	let length = parseInt(req.query.length as string) || Infinity;
	let skip = (page - 1) * length;
	res.send({
		entryList: await collection.find().skip(skip).limit(length),
		totalCount: await collection.countDocuments()
	});
});

// PATCH request that updates a single entry in a specified collection, using data from the request body.
app.patch('/api/:endpoint', async (req, res) => {
	let collection = collections[req.params.endpoint];
	let { _id, ...formData } = req.body;
	console.log(formData);
	formData = parse(formData);
	console.log(formData);
	let files = saveFiles(req);
	res.send(await collection.updateOne({ _id }, { ...formData, ...files }, { upsert: true }));
});

// DELETE request that removes one or more entries from a specified collection, using an array of IDs from the request body.
app.delete('/api/:endpoint', async (req, res) => {
	let collection = collections[req.params.endpoint];
	let { ids } = req.body;
	ids = JSON.parse(ids);
	console.log(ids);
	console.log(typeof ids);

	res.send(
		await collection.deleteMany({
			_id: {
				$in: ids
			}
		})
	);
});

// POST request that creates one or more new entries in a specified collection, using data from the request body.
app.post('/api/:endpoint', async (req, res) => {
	for (let key in req.body) {
		try {
			req.body[key] = JSON.parse(req.body[key]);
		} catch (e) {}
	}
	let collection = collections[req.params.endpoint];
	if (!collection) return 'collection not found!!';
	let files = saveFiles(req);
	res.send(await collection.insertMany({ ...req.body, ...files }));
});

// Listen for incoming requests on the port specified in the env.PORT environment variable.
app.listen(env.PORT, () => {
	console.log(`Example app listening on port ${env.PORT}`);
});
