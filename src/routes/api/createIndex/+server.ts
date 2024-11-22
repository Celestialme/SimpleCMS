import fs from 'fs';
import type { RequestHandler } from './$types';

import { collections } from '@src/stores/store.svelte';
import { _GET } from '../query/GET';
import widgets from '@src/components/widgets';
import { getFieldName } from '@src/utils/fields';
export const GET: RequestHandler = async ({ locals }) => {
	fs.mkdirSync('./indexes', { recursive: true });
	let user = locals.user;
	if (!user || user.role != 'admin') {
		return new Response('', { status: 403 });
	}

	for (let collection of Object.values(collections())) {
		let text = '';
		let entryList = (
			await (
				await _GET({
					schema: collection,
					user
				})
			).json()
		).entryList;
		for (let entry of entryList) {
			let entry_text = '';
			for (let field of collection.fields) {
				let widget = widgets[field.widgetName];
				let fieldName = getFieldName(field);
				if ('toString' in widget) {
					entry_text += widget.toString({ field, data: entry[fieldName] }) + '\n';
				}
			}

			entry_text = entry_text.trim();
			if (entry_text) {
				text += `\n\n_id:${entry._id.toString()}\n`;
				text += entry_text;
			}
		}

		if (text) {
			fs.writeFileSync('./indexes/' + collection.path + '.txt', text);
		}
	}

	return new Response('', { status: 200 });
};
