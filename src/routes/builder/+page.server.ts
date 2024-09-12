import { redirect, type Actions, error } from '@sveltejs/kit';
import { auth, getCollectionModels } from '../api/db';
import type { WidgetType } from '@src/components/widgets';
import fs from 'fs';
import prettier from 'prettier';
import prettierConfig from '@root/.prettierrc.json';

import { SESSION_COOKIE_NAME } from '@src/auth';
import { sanitizePermissions } from '@src/collections/types';

type fields = ReturnType<WidgetType[keyof WidgetType]>;
export async function load(event) {
	let session_id = event.cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await auth.validateSession(session_id);
	if (user) {
		if (user.role != 'admin') {
			throw error(404, {
				message: 'you dont have an access to this page'
			});
		}
		return {
			user
		};
	} else {
		throw redirect(302, `/login`);
	}
}

export const actions: Actions = {
	saveCollection: async ({ request }) => {
		let formData = await request.formData();
		let fieldsData = formData.get('fields') as string;

		let originalName = JSON.parse(formData.get('originalName') as string).replaceAll('::', '/');
		let collectionName = JSON.parse(formData.get('collectionName') as string).replaceAll('::', '/');
		let permissions = sanitizePermissions(JSON.parse(formData.get('permissions') as string));
		console.log(JSON.parse(formData.get('permissions') as string));
		let icon = JSON.parse((formData.get('icon') as string) || '""');
		let fields = JSON.parse(fieldsData) as Array<fields>;
		let imports = await goThrough(fields);
		let content = `
	${imports}
	import widgets from '@src/components/widgets';
	import type { Schema } from '@src/collections/types';
	let schema: Schema = {
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

		await getCollectionModels();
		return null;
	}
};

async function goThrough(object: any, imports: Set<string> = new Set()) {
	let widgets = (await import('../../components/widgets')).default;
	if (object instanceof Object) {
		for (let key in object) {
			let field = object[key];
			await goThrough(field, imports);

			if (field.widget) {
				let widget = widgets[field.widget.Name];
				for (let key in widget.GuiSchema) {
					if (!widget.GuiSchema[key].imports) continue;
					for (let _import of widget.GuiSchema[key].imports) {
						let replacement = field.widget.GuiFields[key].replaceAll('🗑️', '').trim();
						imports.add(_import.replaceAll(`{${key}}`, replacement));
					}
				}

				object[key] = `🗑️widgets.${object[key].widget.Name}(
					${JSON.stringify(object[key].widget.GuiFields, (key, value) => {
						if (key == 'type' || key == 'key') {
							return undefined;
						}
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
