export const resolvers = {
	Query: {
		posts: async (parent, args, context) => {
			// Check if the user is authorized to access the data
			if (!context.user || !context.user.isAuthorized) {
				throw new Error('Unauthorized');
			}

			// Fetch the data from the MongoDB database
			const posts = await context.db.collection('posts').find().toArray();

			// Return the data
			return posts;
		},
		names: async (parent, args, context) => {
			// Check if the user is authorized to access the data
			if (!context.user || !context.user.isAuthorized) {
				throw new Error('Unauthorized');
			}

			// Fetch the data from the MongoDB database
			const names = await context.db.collection('names').find().toArray();

			// Return the data
			return names;
		}
	}
};
