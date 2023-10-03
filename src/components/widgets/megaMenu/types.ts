import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
import GuiFields from './GuiFields.svelte';

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
	return /* GraphQL */ `
		type MegaMenu {
			Header: Text
			children: [MegaMenu]
		}
	`;
};
