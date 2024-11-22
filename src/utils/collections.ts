import fs from 'fs';
import prettier from 'prettier';
import prettierConfig from '../../.prettierrc.json';
import mongoose from 'mongoose';

export let writeCollection = async ({
	id,
	icon,
	fields,
	originalName,
	collectionName,
	permissions
}) => {
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

	return null;
};

async function goThrough(object: any, imports: Set<string> = new Set()) {
	let widgets = (await import('@src/components/widgets')).default;
	if (object instanceof Object) {
		for (let key in object) {
			let field = object[key];
			await goThrough(field, imports);

			if (field?.widgetName) {
				let widget = widgets[field.widgetName];
				for (let key in widget.GuiSchema) {
					if (!widget.GuiSchema[key].imports) continue;
					for (let _import of widget.GuiSchema[key].imports) {
						let replacement = field.params[key].replaceAll('🗑️', '').trim();
						imports.add(_import.replaceAll(`{${key}}`, replacement));
					}
				}
				!object[key].params.id &&
					(object[key].params.id = new mongoose.Types.ObjectId().toString());
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
