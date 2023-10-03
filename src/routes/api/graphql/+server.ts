import { createSchema, createYoga } from 'graphql-yoga';
import type { RequestEvent } from '@sveltejs/kit';
import mongoose from 'mongoose';
import { getCollections } from '@src/collections';
import widgets from '@src/components/widgets';
let typeDefs = /* GraphQL */ ``;
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
		let label = field.label;
		let schema = widgets[field.widget.key].GraphqlSchema?.({ field, collection });
		if (schema) {
			if (!typeDefs.includes(schema)) {
				typeDefs += schema;
			}
			collectionSchema += `${label}: ${field.widget.key}\n`;
		}
	}
	collectionSchemas.push(collectionSchema + '}\n');
}
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
