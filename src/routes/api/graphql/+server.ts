import { createSchema, createYoga } from 'graphql-yoga';
import type { RequestEvent } from '@sveltejs/kit';
import mongoose from 'mongoose';
import { getCollections } from '@src/collections';
import widgets from '@src/components/widgets';
import { getFieldName } from '@src/utils/utils';
import deepmerge from 'deepmerge';
let typeDefs = /* GraphQL */ ``;
let types = new Set();
let resolvers: { [key: string]: any } = {
	Query: {}
};
let collectionSchemas: string[] = [];
let collections = await getCollections();
for (let collection of collections) {
	resolvers[collection.name as string] = {};
	let collectionSchema = `
	type ${collection.name} {
		_id: String
		createdAt: Float
		updatedAt: Float
	`;
	for (let field of collection.fields) {
		let schema = widgets[field.widget.key].GraphqlSchema?.({ field, label: getFieldName(field, true), collection });
		if (schema.resolver) {
			resolvers = deepmerge(resolvers, schema.resolver);
		}
		if (schema) {
			let _types = schema.graphql.split(/(?=type.*?{)/);
			for (let type of _types) {
				types.add(type);
			}
			if ('extract' in field && field.extract && 'fields' in field && field.fields.length > 0) {
				// for helper widgets which extract its fields and does not exist in db itself like imagearray
				let _fields = field.fields;
				for (let _field of _fields) {
					collectionSchema += `${getFieldName(_field, true)}: ${widgets[_field.widget.key].GraphqlSchema?.({
						field: _field,
						label: getFieldName(_field, true),
						collection
					}).typeName}\n`;
					console.log('---------------------------');
					console.log(collectionSchema);
					resolvers[collection.name as string] = deepmerge(
						{
							[getFieldName(_field, true)]: (parent) => {
								return parent[getFieldName(_field)];
							}
						},
						resolvers[collection.name as string]
					);
				}
			} else {
				collectionSchema += `${getFieldName(field, true)}: ${schema.typeName}\n`;

				resolvers[collection.name as string] = deepmerge(
					{
						[getFieldName(field, true)]: (parent) => {
							return parent[getFieldName(field)];
						}
					},
					resolvers[collection.name as string]
				);
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
console.log(typeDefs);
for (let collection of collections) {
	resolvers.Query[collection.name as string] = async () =>
		await mongoose.models[collection.name as string].find({ status: { $ne: 'UNPUBLISHED' } }).lean();
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
