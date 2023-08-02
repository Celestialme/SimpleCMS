import { redirect, type Actions } from '@sveltejs/kit';
import { auth } from '../api/db';
import { validate } from '@src/utils/utils';
import { SESSION_COOKIE_NAME } from 'lucia-auth';
import type widgets from '@src/components/widgets';
import fs from 'fs';
type Widget = typeof widgets;
type fields = ReturnType<Widget[keyof Widget]>;
export async function load(event) {
	let session = event.cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await validate(auth, session);
	if (user.status == 200) {
		return {
			user: user.user
		};
	} else {
		throw redirect(302, `/login`);
	}
}

export const actions: Actions = {
	default: async ({ request }) => {
		let formData = await request.formData();
		let fieldsData = formData.get('fields') as string;
		let oldName = JSON.parse(formData.get('oldName') as string);
		let collectionName = JSON.parse(formData.get('collectionName') as string);
		let fields = JSON.parse(fieldsData) as Array<fields>;
		goThrough(fields);
		let content = `
	
	import widgets from '../components/widgets';
	import type { Schema } from './types';
	let schema: Schema = {
		name: '${collectionName}',
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
		content = content.replace(/["'](display)["']\s?:\s?["'](.*?)["']/, '$1:$2');
		if (oldName != collectionName) {
			fs.renameSync(`./src/collections/${oldName}.ts`, `./src/collections/${collectionName}.ts`);
		}
		fs.writeFileSync(`./src/collections/${collectionName}.ts`, content);

		return null;
	}
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
