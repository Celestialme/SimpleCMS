import { type Params, GuiSchema, GraphqlSchema } from './types';
import MegaMenu from './MegaMenu.svelte';
import Text from '../text';
import { writable, type Writable } from 'svelte/store';
import { getFieldName, getGuiFields } from '@src/utils/utils';
import { entryData, mode } from '@src/stores/store';
import { headerActionButton } from '@src/stores/load';
import type { Permissions } from '@src/collections/types';
import type { User } from '@src/auth/types';
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
widget.modifyRequest = ({ field, data, user }: { field: ReturnType<typeof widget>; data: { [key: string]: any }; user: User }) => {
	let cleanChildren = (children, level = 1) => {
		for (let index in children) {
			for (let _field of field.fields[level]) {
				if (_field?.permissions?.[user.role].read == false) {
					delete children[index][getFieldName(_field)];
				}
			}

			children[index].children.length > 0 && field.fields[level + 1]?.length > 0 && cleanChildren(children[index].children, level + 1);
		}
	};

	cleanChildren(data.children);

	return data;
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
