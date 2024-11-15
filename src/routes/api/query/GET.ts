import type { Schema } from '@src/collections/types';
import widgets from '@src/components/widgets';
import { collectionModels } from '../db';
import type { User } from '@src/auth/types';
import publicConfig from '@root/config/public';
import { modifyRequest } from './modifyRequest';

import { collections } from '@src/stores/store.svelte';
import { getFieldName } from '@src/utils/fields';

export async function _GET({
	schema,
	sort = {},
	filter = {},
	contentLanguage = publicConfig.DEFAULT_CONTENT_LANGUAGE,
	user,
	limit = 0,
	page = 1
}: {
	schema: Schema;
	user: User;
	sort?: { [key: string]: number };
	filter?: { [key: string]: string };
	contentLanguage?: string;
	limit?: number;
	page?: number;
}) {
	let modifiers: any = [];

	let collection = collectionModels[schema.id as string];
	let skip = (page - 1) * limit;
	for (let field of schema.fields.flatMap((field: any) =>
		field.extractFields ? field.fields : [field]
	)) {
		let widget = widgets[field.widget.Name];
		let fieldName = getFieldName(field);

		if ('modifiers' in widget) {
			let _filter = filter[fieldName];
			let _sort = sort[fieldName];

			if (widget.modifiers) {
				let _modifiers = await widget.modifiers({
					field,
					contentLanguage: contentLanguage,
					filter: _filter,
					sort: _sort
				});
				modifiers.push(..._modifiers);
			}
		}
	}
	modifiers = modifiers.filter((x) => x);
	let entryListWithCount = await collection.aggregate([
		{
			$facet: {
				entries: [...modifiers, { $skip: skip }, ...(limit ? [{ $limit: limit }] : [])],
				totalCount: [...modifiers, { $count: 'total' }]
			}
		}
	]);
	let entryList = entryListWithCount[0].entries;

	for (let index in entryList) {
		let entry = entryList[index];
		if (entry._link_id && entry._linked_collection) {
			let collection = collectionModels[collections()[entry._linked_collection].id as string];
			let resp = await collection.findOne({ _id: entry._link_id }).lean();
			if (!resp) {
				entryList.splice(index, 1);
				continue;
			}
			entryList[index] = resp;
			entryList[index]._is_link = true;
			entryList[index]._linked_collection = entry._linked_collection;
		}
	}

	await modifyRequest({
		data: entryList,
		collection,
		fields: schema.fields,
		user,
		type: 'GET'
	});

	let totalCount = entryListWithCount[0].totalCount[0]
		? entryListWithCount[0].totalCount[0].total
		: 0;

	let pagesCount = Math.ceil(totalCount / limit);
	return new Response(
		JSON.stringify({
			entryList,
			pagesCount
		})
	);
}
