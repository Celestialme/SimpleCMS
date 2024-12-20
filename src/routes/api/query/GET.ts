import type { Schema } from '@src/collections/types';
import widgets from '@src/components/widgets';
import { adapter } from '../db';
import type { User } from '@src/auth/types';
import publicConfig from '@root/config/public';

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
	filter?: { [key: string]: { strict: boolean; value: string } };
	contentLanguage?: string;
	limit?: number;
	page?: number;
}) {
	let modifiers: any = [];
	let skip = (page - 1) * limit;

	for (let field of schema.fields.flatMap((field: any) =>
		field.extractFields ? field.fields : [field]
	)) {
		let widget = widgets[field.widgetName];
		let fieldName = getFieldName(field);

		if ('modifiers' in widget) {
			let _filter = filter[fieldName];
			let _sort = sort[fieldName];

			if (widget.modifiers) {
				let _modifiers = await widget.modifiers({
					field,
					contentLanguage: contentLanguage,
					filter: _filter?.value,
					sort: _sort
				});
				modifiers.push(_modifiers);
				delete filter[fieldName];
			}
		}
	}
	modifiers = modifiers.filter((x) => x).concat({ limit, skip });
	for (let [key, value] of Object.entries(filter)) {
		modifiers.push({
			match: {
				[key]: {
					strict: value.strict,
					value: value.value
				}
			}
		});
	}
	console.log(modifiers);
	let { rows: entryList, total } = await adapter.get(schema.path as string, modifiers);
	let pagesCount = Math.ceil(total / limit);
	return new Response(
		JSON.stringify({
			entryList,
			pagesCount
		})
	);
}
