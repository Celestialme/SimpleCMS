import type { Schema } from '@src/collections/types';
import widgets from '@src/components/widgets';
import { getFieldName, get_elements_by_id } from '@src/utils/utils';
import { getCollectionModels } from '../db';
import type { User } from '@src/auth/types';
import publicConfig from '@root/config/public';
import { modifyRequest } from './modifyRequest';
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
	let aggregations: any = [];
	let collections = await getCollectionModels();
	let collection = collections[schema.name as string];
	let skip = (page - 1) * limit;
	for (let field of schema.fields) {
		let widget = widgets[field.widget.Name];
		let fieldName = getFieldName(field);

		if ('aggregations' in widget) {
			let _filter = filter[fieldName];
			let _sort = sort[fieldName];

			if (widget.aggregations.filters && _filter) {
				let _aggregations = await widget.aggregations.filters({
					field,
					contentLanguage: contentLanguage,
					filter: _filter
				});
				aggregations.push(..._aggregations);
			}
			if (widget.aggregations.sorts && _sort) {
				let _aggregations = await widget.aggregations.sorts({
					field,
					contentLanguage: contentLanguage,
					sort: _sort
				});
				aggregations.push(..._aggregations);
			}
		}
	}
	let entryListWithCount = await collection.aggregate([
		{
			$facet: {
				entries: [...aggregations, { $skip: skip }, ...(limit ? [{ $limit: limit }] : [])],
				totalCount: [...aggregations, { $count: 'total' }]
			}
		}
	]);
	let entryList = entryListWithCount[0].entries;

	await modifyRequest({
		data: entryList,
		collection,
		fields: schema.fields,
		user,
		type: 'GET'
	});

	await get_elements_by_id.getAll(); //get all collected ids together and modify request.
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
