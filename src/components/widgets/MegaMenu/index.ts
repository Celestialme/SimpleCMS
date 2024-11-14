import { type Params, GuiSchema } from './types';
import Input from '../Input';
import { entryData, mode, headerActionButton } from '@src/stores/store.svelte';

import widgets, { type ModifyRequestParams } from '..';
import { getGuiFields, getFieldName } from '@src/utils/fields';
import { store } from '@src/utils/reactivity.svelte';
export let currentChild = store({} as { [key: string]: any; children: any[] });
const WIDGET_NAME = 'MegaMenu' as const;
/**
 * Creates Mega Menu Field.
 */
const widget = (params: Params) => {
	let display;
	if (!params.display) {
		display = async ({ data, collection, field, entry, contentLanguage }) => {
			return data.Header[contentLanguage];
		};
		display.default = true;
	} else {
		display = params.display;
	}
	let widget = {
		Name: WIDGET_NAME,
		GuiFields: getGuiFields(params, GuiSchema)
	};

	for (let level of params.fields) {
		level.unshift(Input({ label: 'Header', translated: true, type: 'text' }));
	}
	params.fields.unshift([Input({ label: 'Header', translated: true, type: 'text' })]);
	let callback = ({ data }) => {
		entryData.set(data?.entryList[0]);
		mode.set('edit');
		headerActionButton.set('fa:refresh');
	};
	let field = {
		db_fieldName: params.db_fieldName,
		fields: params.fields,
		display,
		label: params.label,
		width: params.width,
		callback
	};

	return { ...field, widget };
};
widget.Name = WIDGET_NAME;
widget.GuiSchema = GuiSchema;
widget.toString = () => '';
widget.modifyRequest = async ({
	collection,
	field,
	data,
	user,
	type,
	id
}: ModifyRequestParams<typeof widget>) => {
	let _data = data.get();

	let cleanChildren = async (children, level = 1) => {
		for (let index in children) {
			for (let _field of field.fields[level]) {
				// if menu as other nested widgets inside which has its own modifyRequest method... neccessary for nested image to work
				let widget = widgets[_field.widget.Name];
				if ('modifyRequest' in widget) {
					let data = {
						get() {
							return children[index][getFieldName(_field)];
						},
						update(newData) {
							children[index][getFieldName(_field)] = newData;
						}
					};
					await widget.modifyRequest({
						collection,
						field: _field as ReturnType<typeof widget>,
						data,
						user,
						type,
						id
					});
				}
			}

			children[index].children.length > 0 &&
				field.fields[level + 1]?.length > 0 &&
				(await cleanChildren(children[index].children, level + 1));
		}
	};

	await cleanChildren(_data?.children);

	return _data;
};
widget.aggregations = {
	filters: async (info) => {
		let field = info.field as ReturnType<typeof widget>;

		return [
			{
				$match: {
					[`${getFieldName(field)}.Header.${info.contentLanguage}`]: {
						$regex: info.filter,
						$options: 'i'
					}
				}
			}
		];
	},
	sorts: async (info) => {
		let field = info.field as ReturnType<typeof widget>;
		let fieldName = getFieldName(field);
		return [{ $sort: { [`${fieldName}.Header.${info.contentLanguage}`]: info.sort } }];
	}
} as Aggregations;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
