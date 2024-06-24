import fs from 'fs';
import type { RequestHandler } from './$types';
import { auth } from '../db';
import { SESSION_COOKIE_NAME } from '@src/auth';
import { collections } from '@src/stores/load';
import { get } from 'svelte/store';
import { _GET } from '../query/GET';
import widgets from '@src/components/widgets';
import { getFieldName } from '@src/utils/utils';
export const GET: RequestHandler = async ({ cookies }) => {
	fs.mkdirSync('./indexes', { recursive: true });
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await auth.validateSession(session_id);
	if (!user || user.role != 'admin') {
		return new Response('', { status: 403 });
	}
	let $collections = get(collections);

	for (let collection of Object.values($collections)) {
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
				let widget = widgets[field.widget.Name];
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
			fs.writeFileSync('./indexes/' + collection.name + '.txt', text);
		}
	}

	return new Response('', { status: 200 });
};
