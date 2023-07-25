import type { RequestHandler } from './$types';
import type widgets from '@src/components/widgets';
import fs from 'fs';

type Widget = typeof widgets;
type fields = ReturnType<Widget[keyof Widget]>;

// Function to handle a POST request
export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		// Get the form data from the request
		const formData = await request.formData();

		// Get the 'fields' data from the form data
		const fieldsData = formData.get('fields') as string;

		// Parse the 'fields' data as an array of fields
		const fields = JSON.parse(fieldsData) as Array<fields>;

		// Write the fields data to a file
		fs.writeFileSync('fields.json', JSON.stringify(fields));

		// Return a successful response
		return new Response(null, { status: 200 });
	} catch (error) {
		// Handle any errors that might occur
		console.error(error);
		return new Response(null, { status: 500 });
	}
};
