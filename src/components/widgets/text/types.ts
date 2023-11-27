import Toggle from '@src/components/system/buttons/Toggle.svelte';
import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
import { graphql } from 'graphql';

export type Params = {
	label: string;
	width?: number;
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

export let GraphqlSchema: GraphqlSchema = ({ label, collection }) => {
	let typeName = `${collection.name}_${label}`;
	return {
		typeName,
		graphql: /* GraphQL */ `
		type ${typeName} {
			en: String
		}
	`
	};
};
