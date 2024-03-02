import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
import GuiFields from './GuiFields.svelte';
import widgets from '..';
import { getFieldName } from '@src/utils/utils';

export type Params = {
	widget?: any;
	db_fieldName?: string;
	label: string;
	width?: number;
	menu: any[];
	display?: DISPLAY;
};
export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	menu: { widget: GuiFields, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true }
};

export let GraphqlSchema: GraphqlSchema = ({ field, label, collection }) => {
	let menu = field.menu;
	let typeName = `${collection.name}_${getFieldName(field, true)}`;
	let types = new Set();
	let levelCount = 0;
	for (let level of menu) {
		let children: Array<any> = [];
		for (let _field of level) {
			types.add(widgets[_field.widget.key].GraphqlSchema({ label: `${getFieldName(_field, true)}_Level${levelCount}`, collection }).graphql);
			if (levelCount > 0) {
				children.push(`${getFieldName(_field, true)}:${collection.name}_${getFieldName(_field, true)}_Level${levelCount} `);
			}
		}
		if (levelCount > 0) {
			if (menu.length - levelCount > 1) {
				children.push(`children:[${collection.name}_${getFieldName(field, true)}_Level${levelCount + 1}] `);
			}
			types.add(`
			type ${collection.name}_${getFieldName(field, true)}_Level${levelCount} {
				${Array.from(children).join('\n')}
			}
			`);
		}
		levelCount++;
	}
	return {
		typeName,
		graphql: /* GraphQL */ `
		${Array.from(types).join('\n')}
		type ${typeName} {
			Header: ${collection.name}_Header_Level0
			children: [${collection.name}_${getFieldName(field, true)}_Level1]
		}
	`
	};
};

export interface CustomDragEvent extends Event {
	detail: {
		closest_index: number;
		clone_index: number;
		children: any[];
		isParent: boolean;
		expanded_list: [boolean];
		refresh_expanded_list: () => void;
	};
}
