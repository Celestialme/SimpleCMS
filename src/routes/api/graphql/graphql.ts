import { createGraphQLServer } from '@graphql-yoga/core';
import { handleRequest } from '@graphql-yoga/lambda';
import { schema } from '$api/generateSchema';
import { resolvers } from '$api/resolvers';

const server = createGraphQLServer({ schema, resolvers });

export const post = async (request) => {
	return await handleRequest(request, server);
};
