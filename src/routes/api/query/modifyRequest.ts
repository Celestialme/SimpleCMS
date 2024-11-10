import widgets from '@src/components/widgets';
import { getFieldName } from '@src/utils/fields';

export async function modifyRequest({ data, fields, collection, user, type }) {
	for (let field of fields) {
		let widget = widgets[field.widget.Name];
		let fieldName = getFieldName(field);

		if ('modifyRequest' in widget) {
			// widget can modify own portion of entryList;
			data = await Promise.all(
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
						user,
						type,
						id: entry._id,
						meta_data: entry.meta_data
					});
					return entry;
				})
			);
		}
	}
}
