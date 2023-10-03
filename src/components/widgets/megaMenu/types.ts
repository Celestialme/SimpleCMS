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

export let GraphqlSchema = ({ collection, field }) => {
	let menu = field.menu;

	let types = new Set();
	let levelCount = 0;
	for (let level of menu) {
		let children: Array<any> = [];
		for (let _field of level) {
			types.add(widgets[_field.widget.key].GraphqlSchema({}));
			if (levelCount > 0) {
				children.push(`${_field.label}:${_field.widget.key} `);
			}
		}
		if (levelCount > 0) {
			if (menu.length - levelCount > 1) {
				children.push(`children:[${field.label}_Level${levelCount + 1}] `);
			}
			types.add(`
			type ${field.label}_Level${levelCount} {
				${Array.from(children).join('\n')}
			}
			`);
		}
		levelCount++;
	}

	return /* GraphQL */ `
		${Array.from(types).join('\n')}
		type MegaMenu {
			Header: Text
			children: [${field.label}_Level1]
		}
	`;
};
