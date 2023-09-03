import { redirect, type Actions } from '@sveltejs/kit';
import { auth, getCollectionModels } from '../api/db';
import { validate } from '@src/utils/utils';
import { SESSION_COOKIE_NAME } from 'lucia-auth';
import widgets from '@src/components/widgets';
import fs from 'fs';
import prettier from 'prettier';
import prettierConfig from '@root/.prettierrc.json';
import { updateCollections } from '@src/collections';
import { compile } from '../api/compile/compile';
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
	saveCollection: async ({ request }) => {
		let formData = await request.formData();
		let fieldsData = formData.get('fields') as string;
		let originalName = JSON.parse(formData.get('originalName') as string);
		let collectionName = JSON.parse(formData.get('collectionName') as string);
		let fields = JSON.parse(fieldsData) as Array<fields>;
		let imports = goThrough(fields);

		let content = `
	${imports}
	import widgets from '../components/widgets';
	import type { Schema } from './types';
	let schema: Schema = {
		fields: [
			${fields}
		]
	};
	export default schema;
	
	`;
		content = content.replace(/\\n|\\t/g, '').replace(/\\/g, '');

		content = content.replace(/["']🗑️|🗑️["']/g, '').replace(/🗑️/g, '');
		content = prettier.format(content, { ...prettierConfig });
		if (originalName && originalName != collectionName) {
			fs.renameSync(`${import.meta.env.collectionsFolderTS}/${originalName}.ts`, `${import.meta.env.collectionsFolderTS}/${collectionName}.ts`);
		}
		fs.writeFileSync(`${import.meta.env.collectionsFolderTS}/${collectionName}.ts`, content);
		await compile();
		await updateCollections(true);
		await getCollectionModels();
		return null;
	},

	saveConfig: async ({ request }) => {
		let formData = await request.formData();
		let categories = formData.get('categories') as string;
		let config = `
		export function createCategories(collections) {
			return ${categories}
	
		}
		`;
		config = config.replace(/["']🗑️|🗑️["']/g, '').replace(/🗑️/g, '');
		config = prettier.format(config, { ...prettierConfig });
		fs.writeFileSync(`${import.meta.env.collectionsFolderTS}/config.ts`, config);
		await compile();
		await updateCollections(true);
		await getCollectionModels();
	}
};

function goThrough(object: any, imports: Set<string> = new Set()) {
	if (object instanceof Object) {
		for (let key in object) {
			let field = object[key];
			goThrough(field, imports);
			if (field.widget) {
				let widget = widgets[field.widget.key];
				for (let key in widget.GuiSchema) {
					if (!widget.GuiSchema[key].imports) continue;
					for (let _import of widget.GuiSchema[key].imports) {
						let replacement = field[key].replaceAll('🗑️', '').trim();
						imports.add(_import.replaceAll(`{${key}}`, replacement));
					}
				}

				object[key] = `🗑️widgets.${object[key].widget.key}(
					${JSON.stringify(object[key], (key, value) => {
						if (key == 'widget') {
							return undefined;
						}
						if (typeof value == 'string') {
							console.log(value);
							return value.replace(/\s*🗑️\s*/g, '🗑️').trim();
						}
						return value;
					})}
				)🗑️`;
			}
		}
	}
	return Array.from(imports).join('\n');
}
