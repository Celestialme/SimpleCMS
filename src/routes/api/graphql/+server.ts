import { createSchema, createYoga } from 'graphql-yoga';
import type { RequestEvent } from '@sveltejs/kit';
import mongoose from 'mongoose';
import { getCollections } from '@src/collections';
import widgets from '@src/components/widgets';
import { getFieldName } from '@src/utils/utils';
let typeDefs = /* GraphQL */ ``;
let types = new Set();
let resolvers = { Query: {} };
let collectionSchemas: string[] = [];
let collections = await getCollections();
for (let collection of collections) {
	let collectionSchema = `
	type ${collection.name} {
		_id: String
		createdAt: Float
		updatedAt: Float
	`;
	for (let field of collection.fields) {
		let schema = widgets[field.widget.key].GraphqlSchema?.({ field, label: getFieldName(field), collection });
		if (schema) {
			let _types = schema.split(/(?=type.*?{)/);
			for (let type of _types) {
				types.add(type);
			}
			if (!getFieldName(field) && (field as any).fields.length > 0) {
				// for helper widgets which extract its fields and does not exist in db itself like imagearray
				let _fields: Array<any> = (field as any).fields;
				for (let _field of _fields) {
					collectionSchema += `${getFieldName(_field)}: ${collection.name}_${getFieldName(_field)}\n`;
				}
			} else {
				collectionSchema += `${getFieldName(field)}: ${collection.name}_${getFieldName(field)}\n`;
			}
		}
	}
	collectionSchemas.push(collectionSchema + '}\n');
}

typeDefs += Array.from(types).join('\n');
typeDefs += collectionSchemas.join('\n');
typeDefs += `
type Query {
	${collections.map((collection) => `${collection.name}: [${collection.name}]`).join('\n')}
}
`;
for (let collection of collections) {
	resolvers.Query[collection.name as string] = async () => await mongoose.models[collection.name as string].find({}).lean();
}
const yogaApp = createYoga<RequestEvent>({
	schema: createSchema({
		typeDefs,
		resolvers
	}),
	// Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
	graphqlEndpoint: '/api/graphql',

	// Needed to let Yoga use sveltekit's Response object
	fetchAPI: globalThis
});

export { yogaApp as GET, yogaApp as POST };
