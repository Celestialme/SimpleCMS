import { buildSchema } from 'graphql';
import * as collections from '@src/collections';

// Generate the GraphQL types and fields based on the collection schemas
const types = Object.values(collections).map((collection) => {
	const fields = collection.fields.map((field) => `${field.label}: ${field.type}`).join('\n');

	return `
    type ${collection.name} {
      id: ID!
      ${fields}
    }
  `;
});

// Define the Query type with a field for each collection
const query = `
  type Query {
    ${Object.values(collections)
			.map((collection) => `${collection.name}s: [${collection.name}]`)
			.join('\n')}
  }
`;

// Build the GraphQL schema
export const schema = buildSchema(`
  ${types.join('\n')}
  ${query}
`);