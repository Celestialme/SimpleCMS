import { type Params, GuiSchema, GraphqlSchema } from './types';
import MegaMenu from './MegaMenu.svelte';
import Text from '../text';
import { writable, type Writable } from 'svelte/store';
import { getFieldName, getGuiFields } from '@src/utils/utils';
import { entryData, mode } from '@src/stores/store';
import { headerActionButton } from '@src/stores/load';

import type { User } from '@src/auth/types';
import widgets, { type ModifyRequestParams } from '..';
export let currentChild: Writable<any> = writable({});
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
	let widget: { type: typeof MegaMenu; key: 'MegaMenu'; GuiFields: ReturnType<typeof getGuiFields> } = {
		type: MegaMenu,
		key: 'MegaMenu',
		GuiFields: getGuiFields(params, GuiSchema)
	};

	for (let level of params.fields) {
		level.unshift(Text({ label: 'Header', translated: true }));
	}
	params.fields.unshift([Text({ label: 'Header', translated: true })]);
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
		callback,
		permissions: params.permissions
	};

	return { ...field, widget };
};
widget.GuiSchema = GuiSchema;
widget.GraphqlSchema = GraphqlSchema;
widget.modifyRequest = async ({ collection, field, data, user, type, id }: ModifyRequestParams<typeof widget>) => {
	let _data = data.get();
	let old_data: Array<any>;
	let process_OldData = (children, level = 1, result = []) => {
		for (let index in children) {
			for (let _field of field.fields[level]) {
				if (_field?.permissions?.[user.role].write == false) {
					(result as Array<any>).push(children[index]);
				}
			}
			children[index].children.length > 0 && field.fields[level + 1]?.length > 0 && process_OldData(children[index].children, level + 1, result);
		}
		return result;
	};
	let cleanChildren = async (children, level = 1) => {
		for (let index in children) {
			for (let _field of field.fields[level]) {
				if (_field?.permissions?.[user.role].write == false && type == 'PATCH') {
					// if req type is patch get old data and rewrite "write false" field
					if (!old_data) {
						let res = await collection.findOne({ _id: id });
						old_data = process_OldData(res[getFieldName(field)].children);
					}
					let i = old_data.findIndex((item) => item._id == children[index]._id);
					children[index][getFieldName(_field)] = old_data.splice(i, 1)[0][getFieldName(_field)];
				} else if (
					// if read or write is false remove field from body
					(type == 'GET' && _field?.permissions?.[user.role].read == false) ||
					(['POST', 'PATCH'].includes(type) && _field?.permissions?.[user.role].write == false)
				) {
					delete children[index][getFieldName(_field)];
				} else {
					// if menu as other nested widgets inside which has its own modifyRequest method...
					let widget = widgets[_field.widget.key];
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
			}

			children[index].children.length > 0 && field.fields[level + 1]?.length > 0 && (await cleanChildren(children[index].children, level + 1));
		}
	};

	await cleanChildren(_data.children);

	return _data;
};
widget.aggregations = {
	filters: async (info) => {
		let field = info.field as ReturnType<typeof widget>;

		return [{ $match: { [`${getFieldName(field)}.Header.${info.contentLanguage}`]: { $regex: info.filter, $options: 'i' } } }];
	},
	sorts: async (info) => {
		let field = info.field as ReturnType<typeof widget>;
		let fieldName = getFieldName(field);
		return [{ $sort: { [`${fieldName}.Header.${info.contentLanguage}`]: info.sort } }];
	}
} as Aggregations;
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
