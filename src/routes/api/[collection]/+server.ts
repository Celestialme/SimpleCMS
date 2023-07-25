import type { RequestHandler } from './$types';
import { collections } from '@src/routes/api/db';
import { parse, saveFiles } from '@src/utils/utils';

// Export an asynchronous function named GET that is a RequestHandler
export const GET: RequestHandler = async ({ params, url }) => {
	// Retrieve value of page key from search parameters of url object and parse it as integer. If value is not valid integer, assign 1 to page variable
	const page = parseInt(url.searchParams.get('page') as string) || 1;
	// Retrieve collection specified in params object
	const collection = collections[params.collection];
	// TODO: Create an index on the fields that are commonly used in queries to speed up find operation
	//collection.createIndex({ field1: 1 });
	// Retrieve value of length key from search parameters of url object and parse it as integer. If value is not valid integer, assign Infinity to length variable
	const length = parseInt(url.searchParams.get('length') as string) || Infinity;
	// Validate length against predefined rules or constraints
	if (length < 1) {
		return new Response('Invalid value for length');
	}
	// Calculate value of skip as (page - 1) * length
	const skip = (page - 1) * length;

	try {
		// Find documents in collection after skipping skip documents and limiting to length documents
		const entryList: Document[] = await collection.find().skip(skip).limit(length);
		// Count total number of documents in collection
		const totalCount = await collection.countDocuments();
		// Return new Response object containing JSON stringified object with two properties: entryList and totalCount
		return new Response(
			JSON.stringify({
				entryList,
				totalCount
			})
		);
	} catch (e) {
		// Return an error message if an error occurs
		return new Response('An error occurred while retrieving Data from the collection');
	}
};

// Export an asynchronous function named PATCH that is a RequestHandler
export const PATCH: RequestHandler = async ({ params, request }) => {
	// Retrieve the collection specified in the params object
	const collection = collections[params.collection];
	// Retrieve the form data from the request object
	const data = await request.formData();
	// Create an empty object named formData
	let formData: any = {};
	// Iterate over the keys of the form data
	for (const key of data.keys()) {
		try {
			// Try to parse the value of each key as a JSON object and assign it to the corresponding key in the formData object
			formData[key] = JSON.parse(data.get(key) as string);
		} catch (e) {
			// If parsing fails, assign the value of the key as a string to the corresponding key in the formData object
			formData[key] = data.get(key) as string;
		}
	}
	// Get value of _id key from form data and assign it to variable _id
	const _id = data.get('_id');
	// Call parse function with argument formData and assign its return value to formData
	formData = parse(formData);

	// TODO: Validate formData against predefined rules or constraints
	// if (!formData.field1 || typeof formData.field1 !== 'string') {
	// 	return new Response('Invalid value for field1');
	// }
	// if (!formData.field2 || typeof formData.field2 !== 'number') {
	// 	return new Response('Invalid value for field2');
	// }

	// Call saveFiles function with arguments data and params.collection and assign its return value to variable files
	const files = saveFiles(data, params.collection);

	// Return new Response object containing JSON stringified result of updating one document in collection where its _id property matches _id, with properties from both formData and files objects, with option to upsert
	return new Response(
		JSON.stringify(await collection.updateOne({ _id }, { ...formData, ...files }, { upsert: true }))
	);
};

// Export an asynchronous function named POST that is a RequestHandler
export const POST: RequestHandler = async ({ params, request }) => {
	// Retrieve the collection specified in the params object
	const collection = collections[params.collection];
	// Retrieve the form data from the request object
	const data = await request.formData();
	// Create an empty object named body
	const body = {};
	// Iterate over the keys of the form data
	for (const key of data.keys()) {
		try {
			// Try to parse the value of each key as a JSON object and assign it to the corresponding key in the body object
			body[key] = JSON.parse(data.get(key) as string);
		} catch (e) {
			// If parsing fails, assign the value of the key as a string to the corresponding key in the body object
			body[key] = data.get(key) as string;
		}
	}
	// If collection is not found, return a new Response object with message 'collection not found!!'
	if (!collection) return new Response('collection not found!!');

	// TODO: Validate body against predefined rules or constraints
	// if (!body.field1 || typeof body.field1 !== 'string') {
	// 	return new Response('Invalid value for field1');
	// }
	// if (!body.field2 || typeof body.field2 !== 'number') {
	// 	return new Response('Invalid value for field2');
	// }

	// Call saveFiles function with arguments data and params.collection and assign its return value to a variable named files
	const files = saveFiles(data, params.collection);

	try {
		// Insert many documents into collection with properties from both body and files objects
		const result = await collection.insertMany({ ...body, ...files });
		// Return a new Response object containing a JSON stringified result
		return new Response(JSON.stringify(result));
	} catch (e) {
		// Return an error message if an error occurs
		return new Response('An error occurred while inserting data into the collection');
	}
};

// Export an asynchronous function named DELETE that is a RequestHandler
// TODO: deleted files to a trash folder and automatically removing files from the trash folder after 30 days
export const DELETE: RequestHandler = async ({ params, request }) => {
	// Retrieve the collection specified in the params object
	const collection = collections[params.collection];
	// Retrieve the form data from the request object
	const data = await request.formData();

	// Get the value of the ids key from the form data and parse it as a JSON object
	let ids = data.get('ids') as string;
	ids = JSON.parse(ids);

	// Validate ids against predefined rules or constraints
	if (!Array.isArray(ids) || ids.length === 0) {
		return new Response('Invalid value for ids');
	}

	// Move deleted files to trash folder
	// for (const id of ids) {
	// 	// Get the file path and name based on the collection and id

	// 	// Move the file to the trash folder
	// 	await fs.promises.rename(filePath, `./trash/${fileName}`);
	// }

	// Log the value of ids and its type to the console
	// console.log(ids);
	// console.log(typeof ids);

	try {
		// Delete many documents from the collection where their _id property is in the array of ids
		const result = await collection.deleteMany({
			_id: {
				$in: ids
			}
		});
		// Return a new Response object containing a JSON stringified result
		return new Response(JSON.stringify(result));
	} catch (e) {
		// Return an error message if an error occurs
		return new Response('An error occurred while deleting data from the collection');
	}
};
