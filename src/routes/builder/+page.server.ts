import { type Actions, error } from '@sveltejs/kit';
import { collectionModels } from '../api/db';
import type { WidgetType } from '@src/components/widgets';
import fs from 'fs';
import prettier from 'prettier';
import prettierConfig from '@root/.prettierrc.json';

import { sanitizePermissions } from '@src/collections/types';

type fields = ReturnType<WidgetType[keyof WidgetType]>;
export async function load(event) {
	let user = event.locals.user;
	if (user.role != 'admin') {
		throw error(404, {
			message: 'you dont have an access to this page'
		});
	}
	return {
		user
	};
}

export const actions: Actions = {
	saveCollection: async ({ request }) => {
		let formData = await request.formData();
		let fieldsData = formData.get('fields') as string;

		let originalName = JSON.parse(formData.get('originalName') as string).replaceAll('::', '/');
		let collectionName = JSON.parse(formData.get('collectionName') as string).replaceAll('::', '/');
		let permissions = sanitizePermissions(JSON.parse(formData.get('permissions') as string));
		let id = JSON.parse(formData.get('id') as string);
		let icon = JSON.parse((formData.get('icon') as string) || '""');
		let fields = JSON.parse(fieldsData) as Array<fields>;
		let imports = await goThrough(fields);
		let content = `
	${imports}
	import widgets from '@src/components/widgets';
	import type { Schema } from '@src/collections/types';
	let schema: Schema = {
		id: '${id}',
		icon:"${icon}",
		${permissions ? `permissions:${JSON.stringify(permissions)},` : ''}
		fields: [
			${fields}
		]
	};
	export default schema;
	
	`;

		content = content.replace(/\\n|\\t/g, '').replace(/\\/g, '');

		content = content.replace(/["']🗑️|🗑️["']/g, '').replace(/🗑️/g, '');
		content = await prettier.format(content, { ...(prettierConfig as any), parser: 'typescript' });
		if (originalName && originalName != collectionName) {
			fs.renameSync(
				`${import.meta.env.collectionsFolderTS}/${originalName}.ts`,
				`${import.meta.env.collectionsFolderTS}/${collectionName}.ts`
			);
		}
		fs.writeFileSync(`${import.meta.env.collectionsFolderTS}/${collectionName}.ts`, content);

		collectionModels;
		return null;
	}
};

async function goThrough(object: any, imports: Set<string> = new Set()) {
	let widgets = (await import('../../components/widgets')).default;
	if (object instanceof Object) {
		for (let key in object) {
			let field = object[key];
			await goThrough(field, imports);

			if (field.widgetName) {
				let widget = widgets[field.widgetName];
				for (let key in widget.GuiSchema) {
					if (!widget.GuiSchema[key].imports) continue;
					for (let _import of widget.GuiSchema[key].imports) {
						let replacement = field.params[key].replaceAll('🗑️', '').trim();
						imports.add(_import.replaceAll(`{${key}}`, replacement));
					}
				}

				object[key] = `🗑️widgets.${object[key].widgetName}(
					${JSON.stringify(object[key].params, (key, value) => {
						if (typeof value == 'string') {
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
