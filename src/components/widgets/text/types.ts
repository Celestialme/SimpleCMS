import Toggle from '@src/components/system/buttons/Toggle.svelte';
import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';

export type Params = {
	label: string;
	display?: DISPLAY;
	db_fieldName?: string;
	translated?: boolean;
};

export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true },
	translated: { widget: Toggle, required: false }
};

export let GraphqlSchema = ({ label }) => {
	return /* GraphQL */ `
		type Text {
			en: String
		}
	`;
};
