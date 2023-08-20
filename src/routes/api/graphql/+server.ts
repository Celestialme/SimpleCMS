// TODO: Protect Graphql Api Endpoint
import { createSchema, createYoga } from 'graphql-yoga';
import type { RequestEvent } from '@sveltejs/kit';

import { schema } from '@src/routes/api/graphql/generateSchema';
import { resolvers } from '@src/routes/api/graphql/resolver';

const yogaApp = createYoga<RequestEvent>({
	// Import schema and resolvers
	schema: createSchema({
		typeDefs: schema,
		resolvers: resolvers
	}),
	// Define the GraphQL endpoint
	graphqlEndpoint: '/api/graphql',
	// Use SvelteKit's Response object
	fetchAPI: globalThis
	// Add middleware for authentication, rate limiting, and query depth limiting
	//middleware: [
	// 	authenticate, // Authenticate the user
	// 	rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }), // Limit requests to 100 per 15 minutes
	// 	depthLimit(10) // Limit query depth to 10
	// ]
});

export { yogaApp as GET, yogaApp as POST };
