const { GraphQLServerLambda } = require('graphql-yoga');

const typeDefs = `
  type Query {
    hello(name: String): String
  }
`;

const resolvers = {
	Query: {
		hello: (_, { name }) => `Hello ${name || 'World'}`
	}
};

const lambda = new GraphQLServerLambda({ typeDefs, resolvers });

export async function post(request) {
	const context = {};

	const result = await new Promise((resolve, reject) => {
		lambda.handler(request, context, (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});

	return { body: result };
}
