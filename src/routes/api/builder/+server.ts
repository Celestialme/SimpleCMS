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

		let content = `
	
		import widgets from '../components/widgets';
		import type { Schema } from './types';
		let schema: Schema = {
			name: 'posts1',
			fields: [
				${fields.map((field) => {
					let fieldsString = '';
					let fieldKeys = Object.keys(field);
					for (let key of fieldKeys.filter((key) => key != 'widget')) {
						if (key == 'display') {
							let _tmp = JSON.stringify(field[key])
								.replaceAll('\\n', '\n')
								.replaceAll('\\t', '\t')
								.replaceAll('\\', '');

							fieldsString += `${key}: ${_tmp.substring(1, _tmp.length - 1)},`;
						} else {
							fieldsString += `${key}: ${JSON.stringify(field[key])
								.replaceAll('\\n', '\n')
								.replaceAll('\\t', '\t')
								.replaceAll('\\', '')},`;
						}
					}
					fieldsString = fieldsString.substring(0, fieldsString.length - 1);
					return `widgets.${field.widget}({
						${fieldsString}
					})`;
				})}
			]
		};
		export default schema;
		
		`;

		// Write the fields data to a file
		fs.writeFileSync('./src/collections/New.ts', content);

		// Return a successful response
		return new Response(null, { status: 200 });
	} catch (error) {
		// Handle any errors that might occur
		console.error(error);
		return new Response(null, { status: 500 });
	}
};
