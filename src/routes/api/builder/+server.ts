import type { RequestHandler } from './$types';
import type widgets from '@src/components/widgets';
import fs from 'fs';

type Widget = typeof widgets;
type fields = ReturnType<Widget[keyof Widget]>;

// Function to handle a POST request
export const POST: RequestHandler = async ({ request, cookies }) => {
	// Get the form data from the request
	let formData = await request.formData();
	// Get the 'fields' data from the form data
	let fieldsData = formData.get('fields') as string;
	// Parse the 'fields' data as an array of fields
	let fields = JSON.parse(fieldsData) as Array<fields>;

	goThrough(fields);
	console.log(fields);

	let content = `
	
	import widgets from '../components/widgets';
	import type { Schema } from './types';
	let schema: Schema = {
		name: 'posts1',
		fields: [
			${fields}
		]
	};
	export default schema;
	
	`;

	content = content.replace(/\\n|\\t/g, '').replace(/\\/g, '');

	while (true) {
		let _temp = content;
		content = content.replace(/["'](widgets.*?\(.*?\))['"]/gm, '$1');
		if (content == _temp) {
			break;
		}
		console.log('run');
	}

	fs.writeFileSync('./src/collections/New.ts', content);

	// Return a successful response
	return new Response(null, { status: 200 });
};

function goThrough(object: any) {
	if (object instanceof Object) {
		for (let key in object) {
			goThrough(object[key]);
			if (object[key].widget) {
				object[key] = `widgets.${object[key].widget}(
					${JSON.stringify(object[key], (key, value) => {
						if (key == 'widget') {
							return undefined;
						}
						return value;
					})}
				)`;
			}
		}
	}
}
