import type { User } from '@src/auth/types';
import type { Schema } from '@src/collections/types';
import widgets from '@src/components/widgets';
import { getFieldName } from '@src/utils/fields';
import type mongoose from 'mongoose';

export async function modifyRequest({
	data,
	fields,
	collection,
	user,
	type,
	storage
}: {
	data: any;
	fields: any[];
	collection: Schema;
	user: User;
	type: 'GET' | 'POST' | 'DELETE' | 'PATCH';
	storage?: {
		images: Set<ObjectId>;
	};
}) {
	for (let field of fields) {
		let widget = widgets[field.widgetName as keyof typeof widgets];
		let fieldName = getFieldName(field);

		if ('modifyRequest' in widget) {
			// widget can modify own portion of entryList;
			await Promise.all(
				data.map(async (entry: any) => {
					let data = {
						get() {
							return entry[fieldName];
						},
						update(newData) {
							entry[fieldName] = newData;
						}
					};
					await widget.modifyRequest({
						collection,
						field,
						data,
						entry,
						user,
						type,
						id: entry._id,
						storage
					});
					return entry;
				})
			);
		}
	}
}
