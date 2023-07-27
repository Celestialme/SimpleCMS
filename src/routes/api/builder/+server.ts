import type { RequestHandler } from './$types';
import type widgets from '@src/components/widgets';
import fs from 'fs';

type Widget = typeof widgets;
type fields = ReturnType<Widget[keyof Widget]>;
export const POST: RequestHandler = async ({ request, cookies }) => {
	let formData = await request.formData();
	let fieldsData = formData.get('fields') as string;
	let fields = JSON.parse(fieldsData) as Array<fields>;

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
						let _tmp = JSON.stringify(field[key]).replaceAll('\\n', '\n').replaceAll('\\t', '\t').replaceAll('\\', '');

						fieldsString += `${key}: ${_tmp.substring(1, _tmp.length - 1)},`;
					} else {
						fieldsString += `${key}: ${JSON.stringify(field[key]).replaceAll('\\n', '\n').replaceAll('\\t', '\t').replaceAll('\\', '')},`;
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

	fs.writeFileSync('./src/collections/New.ts', content);

	return new Response(null, { status: 200 });
};
