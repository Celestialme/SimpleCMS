import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
import GuiFields from './GuiFields.svelte';
import widgets from '..';

export type Params = {
	widget?: any;
	schema?: { [Key: string]: any };
	db_fieldName?: string;
	label: string;
	menu: any[];
	display?: DISPLAY;
};
export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	menu: { widget: GuiFields, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true }
};

export let GraphqlSchema = ({ field, label, collection }) => {
	let menu = field.menu;

	let types = new Set();
	let levelCount = 0;
	for (let level of menu) {
		let children: Array<any> = [];
		for (let _field of level) {
			types.add(widgets[_field.widget.key].GraphqlSchema({ label: `${_field.label}_Level${levelCount}`, collection }));
			if (levelCount > 0) {
				children.push(`${_field.label}:${collection.name}_${_field.label}_Level${levelCount} `);
			}
		}
		if (levelCount > 0) {
			if (menu.length - levelCount > 1) {
				children.push(`children:[${collection.name}_${field.label}_Level${levelCount + 1}] `);
			}
			types.add(`
			type ${collection.name}_${field.label}_Level${levelCount} {
				${Array.from(children).join('\n')}
			}
			`);
		}
		levelCount++;
	}
	return /* GraphQL */ `
		${Array.from(types).join('\n')}
		type ${collection.name}_${field.label} {
			Header: ${collection.name}_Header_Level0
			children: [${collection.name}_${field.label}_Level1]
		}
	`;
};
